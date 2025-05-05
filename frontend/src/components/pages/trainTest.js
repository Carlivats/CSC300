import React, { useState, useEffect } from 'react';

const TrainTest = ({ onLineSelect = () => {} }) => {
  const [line, setLine] = useState('');
  const [station, setStation] = useState('');
  const [direction, setDirection] = useState('');
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]); 

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

  useEffect(() => {
    if (line) {
      // Fetch stations based on the selected line
      const fetchStations = async () => {
        const res = await fetch(`http://localhost:8081/api/stations?line=${line}`);
        const data = await res.json();
        setStations(data.stations || []);  // Assuming the API returns a list of stations
      };
      fetchStations();
    }
  }, [line]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch(`http://localhost:8081/api/trains?line=${line}&station=${station}&direction=${direction}`);
      
      // Check if the response is ok (status 200)
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
  
      const data = await res.json();
  
      // Log the received data for debugging purposes
      console.log('API Response:', data);
  
      // Check if the arrival_times array exists and has items
      if (data && data.arrival_times && Array.isArray(data.arrival_times) && data.arrival_times.length > 0) {
        setTrains(data.arrival_times);  // Set the trains if data is valid
      } else {
        setTrains([]);  // Clear any existing train data
        alert('No trains available for this station or direction at the moment.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);  // Log the error
      setTrains([]);  // Clear the trains data in case of an error
      alert('Failed to fetch train predictions. Please try again.');
    }
  };
  
  

  

  return (
    <div className={`p-4 ${bgClass}`}>

    <div className="flex space-x-8 items-start"> 
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-2xl font-semibold text-white ">Select Line:</label>
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
          <label className="block mb-1 text-2xl font-semibold text-white">Select Station:</label>
          <select
           value={station}
           onChange={(e) => setStation(e.target.value)}
           className="p-2 border rounded w-60 h-10"
>
          <option value="">-- Choose Station --</option>
            {stations && stations.length > 0 ? (  // Check if stations exist and are not empty
              stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
          </option>
    ))
  ) : (
    <option value="">No stations available</option>
  )}
</select>

          </div>

        <div>
          <label className="block mb-1 text-2xl font-semibold text-white">Select Direction:</label>
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

      <div className="self-start">
        <h2 className="text-3xl underline font-semibold mb-2 text-white">Next Inbound Trains</h2>
        {trains.length > 0 ? (
          <ul className="pl-15 list-disc text-white text-4xl">
            {trains.map((train, index) => (
              <li key={index}>  {train}</li>
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
