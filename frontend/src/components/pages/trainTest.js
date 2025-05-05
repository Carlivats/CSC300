import React, { useState, useEffect } from 'react';

const TrainTest = ({ onLineSelect = () => {} }) => {
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [direction, setDirection] = useState('');
  const [trains, setTrains] = useState([]);

  const bgClass =
  line === 'Blue'   ? 'bg-blue-500'   :
  line === 'Red'    ? 'bg-red-500'    :
  line === 'Green'  ? 'bg-green-500'  :
  line === 'Orange' ? 'bg-orange-500' :
                      'bg-[#435ED3]';    

  useEffect(() => {
    if (line && typeof onLineSelect === 'function') {
      onLineSelect(line);
    }
  }, [line, onLineSelect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:8081/api/trains?line=${line}&station=${station}&direction=${direction}`);
    const data = await res.json();
    console.log('Received data:', data);  // Add logging here to see the raw response
    setTrains(data.arrival_times);  // Make sure you're mapping the correct field
  };
  

  

  return (
    <div className={`p-4 ${bgClass}`}>

    <div className="flex space-x-8 items-start"> 
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-lg font-semibold text-white ">Select Line:</label>
          <select
            value={line}
            onChange={(e) => setLine(e.target.value)}
            className="p-2 border rounded w-60 h-10"
          >
            <option value="">-- Choose Line --</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Orange">Orange</option>
          </select>
        </div>
        
        <div>
          <label className="block mb-1 text-lg font-semibold text-white">Select Station:</label>
          <input
            type="text"
            value={station}
            onChange={(e) => setStation(e.target.value)}
            className="p-2 border rounded w-60 h-10"
            placeholder="Enter station name"
          />
        </div>

        <div>
          <label className="block mb-1 text-lg font-semibold text-white">Select Direction:</label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="p-2 border rounded w-60 h-10"
          >
            <option value="">-- Choose Direction --</option>
            <option value="0">Inbound</option>
            <option value="1">Outbound</option>
          </select>
        </div>

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Get Trains
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-white">Upcoming Trains:</h2>
        {trains.length > 0 ? (
          <ul className="list-disc pl-5">
            {trains.map((train, index) => (
              <li key={index}>{train}</li>
            ))}
          </ul>
        ) : (
            <p className="text-xl font-semibold mb-2 text-white">No train data loaded.</p>
        )}
        </div>
      </div>
    </div>
  );
};

export default TrainTest;
