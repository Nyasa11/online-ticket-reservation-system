const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { eventId, seats } = req.body;

    // Find event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Check if seats are available
    const requestedSeats = seats.map(s => s.seatNumber);
    const bookedSeatsNumbers = event.bookedSeats.map(s => s.seatNumber);
    const unavailableSeats = requestedSeats.filter(s => bookedSeatsNumbers.includes(s));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats ${unavailableSeats.join(', ')} are already booked`
      });
    }

    // Calculate total amount
    let totalAmount = 0;
    seats.forEach(seat => {
      totalAmount += seat.price;
    });

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      seats,
      totalAmount
    });

    // Update event with booked seats
    event.bookedSeats.push(...seats.map(s => ({ 
      seatNumber: s.seatNumber, 
      type: s.type 
    })));
    event.availableSeats -= seats.length;
    await event.save();

    // Populate booking details
    await booking.populate('event user');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (admin) or user bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // If not admin, only show user's bookings
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }

    const bookings = await Booking.find(query)
      .populate('event', 'title date time venue')
      .populate('user', 'name email phone')
      .sort('-bookingDate');

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/:id
// @desc    Get single booking
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('event')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// @route   PUT /api/bookings/:id/cancel
// @desc    Cancel booking
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled'
      });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    // Update event seats
    const event = await Event.findById(booking.event);
    booking.seats.forEach(seat => {
      event.bookedSeats = event.bookedSeats.filter(
        s => s.seatNumber !== seat.seatNumber
      );
    });
    event.availableSeats += booking.seats.length;
    await event.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling booking',
      error: error.message
    });
  }
});

// @route   GET /api/bookings/stats/dashboard
// @desc    Get booking statistics (admin only)
// @access  Private/Admin
router.get('/stats/dashboard', protect, authorize('admin'), async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    
    const revenue = await Booking.aggregate([
      { $match: { status: 'confirmed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenue.length > 0 ? revenue[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;