import React from "react";

const SelectionPanel = ({ 
  line, 
  station, 
  direction, 
  stations, 
  setLine,
  setStation,
  setDirection,
  onSubmit, 
  onShowGreenLineModal,
  onLineChangeCleanup // callback to reset trains/vehicles when line changes
}) => {
  const handleLineChange = (selectedValue) => {
    if (selectedValue === "Green") {
      onShowGreenLineModal(true);
    } else {
      setLine(selectedValue);
      setStation(""); // Reset station in SelectionPanel
      if (onLineChangeCleanup) {
        onLineChangeCleanup(); // Reset trains/vehicles in parent
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 text-2xl font-semibold text-white">
          Select Line:
        </label>
        <select
          value={line}
          onChange={(e) => handleLineChange(e.target.value)}
          className="p-2 border rounded w-60 h-10"
        >
          <option value="">-- Choose Line --</option>
          <option value="Red">Red</option>
          <option value="Blue">Blue</option>
          <option value="Green">Green</option>
          <option value="Orange">Orange</option>
          <option value="Green-B">Green B</option>
          <option value="Green-C">Green C</option>
          <option value="Green-D">Green D</option>
          <option value="Green-E">Green E</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 text-2xl font-semibold text-white">
          Select Station:
        </label>
        <select
          value={station}
          onChange={(e) => setStation(e.target.value)}
          className="p-2 border rounded w-60 h-10"
          disabled={!stations.length}
        >
          <option value="">-- Choose Station --</option>
          {stations.length ? (
            stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))
          ) : (
            <option value="">No stations available</option>
          )}
        </select>
      </div>

      <div>
        <label className="block mb-1 text-2xl font-semibold text-white">
          Select Direction:
        </label>
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

      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded"
        disabled={!(line && station && direction)}
      >
        Get Trains
      </button>
    </form>
  );
};

export default SelectionPanel;
