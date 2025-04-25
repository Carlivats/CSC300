import React, { useState } from 'react';

const TrainTest = () => {
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [direction, setDirection] = useState('');
  const [trains, setTrains] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8081/api/trains?line=${line}&station=${station}&direction=${direction}`);
    const data = await res.json();
    console.log('Received data:', data);  // Add logging here to see the raw response
    setTrains(data.arrival_times);  // Make sure you're mapping the correct field
  };
  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Train Test Page</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Select Line:</label>
          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">-- Choose Line --</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Orange">Orange</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1">Select Station:</label>
          <input
            type="text"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="p-2 border rounded w-full"
            placeholder="Enter station name"
          />
        </div>

        <div>
          <label className="block mb-1">Select Direction:</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">-- Choose Direction --</option>
            <option value="0">Inbound</option>
            <option value="1">Outbound</option>
          </select>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Get Trains
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Upcoming Trains:</h2>
        {trains.length > 0 ? (
          <ul className="list-disc pl-5">
            {trains.map((train, index) => (
              <li key={index}>{train}</li>
            ))}
          </ul>
        ) : (
          <p>No train data loaded.</p>
        )}
      </div>
    </div>
  );
};

export default TrainTest;
