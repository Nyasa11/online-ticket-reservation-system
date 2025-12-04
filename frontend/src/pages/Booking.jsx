import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Check, X } from 'lucide-react';

const Booking = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchEvent();
  }, [id, user]);

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`/api/events/${id}`);
      setEvent(res.data.event);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeatType = (row) => {
    if (row < 2) return 'vip';
    if (row < 5) return 'premium';
    return 'regular';
  };

  const getSeatPrice = (type) => {
    return event.pricing[type];
  };

  const isSeatBooked = (seatNum) => {
    return event.bookedSeats.some(s => s.seatNumber === seatNum);
  };

  const isSeatSelected = (seatNum) => {
    return selectedSeats.some(s => s.seatNumber === seatNum);
  };

  const handleSeatClick = (row, col) => {
    const seatNum = `${String.fromCharCode(65 + row)}${col + 1}`;
    
    if (isSeatBooked(seatNum)) return;

    if (isSeatSelected(seatNum)) {
      setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatNum));
    } else {
      const seatType = getSeatType(row);
      setSelectedSeats([
        ...selectedSeats,
        {
          seatNumber: seatNum,
          type: seatType,
          price: getSeatPrice(seatType)
        }
      ]);
    }
  };

  const getTotalAmount = () => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setBooking(true);
    try {
      const res = await axios.post('/api/bookings', {
        eventId: id,
        seats: selectedSeats
      });

      alert('Booking successful!');
      navigate('/my-bookings');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Select Your Seats
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-6">
              <div className="w-full h-12 bg-gray-300 rounded-t-3xl flex items-center justify-center text-gray-700 font-semibold">
                SCREEN
              </div>
            </div>

            <div className="space-y-2">
              {Array.from({ length: event.seatLayout.rows }).map((_, row) => (
                <div key={row} className="flex justify-center gap-2">
                  <span className="w-8 text-center font-semibold text-gray-700">
                    {String.fromCharCode(65 + row)}
                  </span>
                  {Array.from({ length: event.seatLayout.columns }).map((_, col) => {
                    const seatNum = `${String.fromCharCode(65 + row)}${col + 1}`;
                    const booked = isSeatBooked(seatNum);
                    const selected = isSeatSelected(seatNum);
                    const seatType = getSeatType(row);

                    return (
                      <button
                        key={col}
                        onClick={() => handleSeatClick(row, col)}
                        disabled={booked}
                        className={`w-8 h-8 rounded-t-lg transition ${
                          booked
                            ? 'bg-gray-400 cursor-not-allowed'
                            : selected
                            ? 'bg-green-500 text-white'
                            : seatType === 'vip'
                            ? 'bg-yellow-200 hover:bg-yellow-300'
                            : seatType === 'premium'
                            ? 'bg-blue-200 hover:bg-blue-300'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {booked ? <X className="h-4 w-4" /> : selected ? <Check className="h-4 w-4" /> : ''}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-6 text-sm">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-yellow-200 rounded-t-lg mr-2"></div>
                <span>VIP - ₹{event.pricing.vip}</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-200 rounded-t-lg mr-2"></div>
                <span>Premium - ₹{event.pricing.premium}</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-200 rounded-t-lg mr-2"></div>
                <span>Regular - ₹{event.pricing.regular}</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-green-500 rounded-t-lg mr-2"></div>
                <span>Selected</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gray-400 rounded-t-lg mr-2"></div>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {new Date(event.date).toLocaleDateString()} | {event.time}
              </p>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <h3 className="font-semibold mb-2">Selected Seats</h3>
              {selectedSeats.length === 0 ? (
                <p className="text-sm text-gray-600">No seats selected</p>
              ) : (
                <div className="space-y-2">
                  {selectedSeats.map((seat) => (
                    <div key={seat.seatNumber} className="flex justify-between text-sm">
                      <span>
                        {seat.seatNumber} ({seat.type})
                      </span>
                      <span>₹{seat.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{getTotalAmount()}
                </span>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={selectedSeats.length === 0 || booking}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;