const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description']
  },
  category: {
    type: String,
    enum: ['movie', 'concert', 'sports', 'theater', 'other'],
    required: true
  },
  venue: {
    type: String,
    required: [true, 'Please provide venue']
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date']
  },
  time: {
    type: String,
    required: [true, 'Please provide event time']
  },
  duration: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/400x600?text=Event+Poster'
  },
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  availableSeats: {
    type: Number,
    required: true
  },
  seatLayout: {
    rows: {
      type: Number,
      default: 10
    },
    columns: {
      type: Number,
      default: 10
    }
  },
  pricing: {
    vip: {
      type: Number,
      default: 500
    },
    premium: {
      type: Number,
      default: 300
    },
    regular: {
      type: Number,
      default: 150
    }
  },
  bookedSeats: [{
    seatNumber: String,
    type: String
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Initialize availableSeats before saving
eventSchema.pre('save', function(next) {
  if (this.isNew && !this.availableSeats) {
    this.availableSeats = this.totalSeats;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);