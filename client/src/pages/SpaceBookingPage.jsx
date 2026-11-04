import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export default function SpaceBookingPage() {
  const [space, setSpace] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const spaces = [
    { id: 'quiet-pod-1', name: 'Quiet Study Pod 1 (1 person)' },
    { id: 'quiet-pod-2', name: 'Quiet Study Pod 2 (1 person)' },
    { id: 'group-room-a', name: 'Group Study Room A (4-6 people)' },
    { id: 'group-room-b', name: 'Group Study Room B (6-8 people)' },
    { id: 'media-lab', name: 'Digital Media Studio (Recording & Editing)' },
    { id: 'conference-hall', name: 'Library Seminar Room (up to 25 people)' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!space || !date || !startTime || !endTime) {
      setError('Please fill in all required fields.');
      return;
    }

    if (startTime >= endTime) {
      setError('End time must be after start time.');
      return;
    }

    // Simulate booking submission
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center space-x-3 pb-6 border-b border-gray-200">
          <Calendar className="w-8 h-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reserve a Library Space</h1>
            <p className="text-sm text-gray-600">Book study pods, group rooms, or media labs for your study sessions.</p>
          </div>
        </div>

        {submitted ? (
          <div className="my-8 p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-semibold text-emerald-900">Reservation Confirmed!</h2>
            <p className="text-sm text-emerald-700">
              Your reservation for <span className="font-semibold">{spaces.find(s => s.id === space)?.name}</span> on <span className="font-semibold">{date}</span> from <span className="font-semibold">{startTime}</span> to <span className="font-semibold">{endTime}</span> has been confirmed.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setSpace('');
                setDate('');
                setStartTime('');
                setEndTime('');
                setPurpose('');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Book Another Space
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                <MapPin className="w-4 h-4 text-indigo-600" />
                <span>Select Space *</span>
              </label>
              <select
                required
                value={space}
                onChange={(e) => setSpace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              >
                <option value="">-- Choose a study room or pod --</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>Start Time *</span>
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>End Time *</span>
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose / Group Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Group study for CS101 final exam"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Confirm Space Reservation
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
