import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, MapPin, Clock, Users, ArrowLeft } from 'lucide-react';

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvent();
  }, [id]);

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

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Events
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-8">
            <div className="mb-4">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-semibold rounded-full capitalize">
                {event.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>

            <p className="text-gray-600 mb-6">
              {event.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="font-medium">
                  {new Date(event.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="font-medium">{event.time} | Duration: {event.duration}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="font-medium">{event.venue}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Users className="h-5 w-5 mr-3 text-indigo-600" />
                <span className="font-medium">
                  {event.availableSeats} of {event.totalSeats} seats available
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Ticket Pricing</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">VIP</span>
                  <span className="text-lg font-bold text-gray-900">₹{event.pricing.vip}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Premium</span>
                  <span className="text-lg font-bold text-gray-900">₹{event.pricing.premium}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Regular</span>
                  <span className="text-lg font-bold text-gray-900">₹{event.pricing.regular}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBookNow}
              disabled={event.availableSeats === 0}
              className="w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {event.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;