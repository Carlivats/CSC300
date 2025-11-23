import React, { useState, useEffect } from "react";
import SelectionPanel from "./SelectionPanel";
import TrainArrivalList from "./TrainArrivalList";
import GreenLineBranchModal from "./GreenLineBranchModal";
import TrainMap from "./TrainMap";

const ArrivingTrains = ({ onLineSelect = () => {}, routeShape = [] }) => {
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");
  const [direction, setDirection] = useState("");
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]); // next 3 arrival times
  const [vehicles, setVehicles] = useState([]); // live vehicle locations
  const [showGreenLineModal, setShowGreenLineModal] = useState(false);

  // Handle line selection and notify parent component
  useEffect(() => {
    if (line) {
      console.log("Line selected in ArrivingTrains:", line);
      onLineSelect(line);
    }
  }, [line, onLineSelect]);

  // fetch stations when line changes
  useEffect(() => {
    if (!line) return;
    if (line === "Green") {
      setShowGreenLineModal(true);
      return;
    }

    fetch(`http://localhost:8081/api/stations?line=${line}`)
      .then((r) => r.json())
      .then((data) => setStations(data.stations || []))
      .catch((err) => {
        console.error("stations error", err);
        setStations([]);
      });
  }, [line]);

  // Handle selecting a Green Line branch
  const handleGreenLineBranchSelect = (branchId) => {
    setLine(branchId);
    setShowGreenLineModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1) fetch next arrival times
    try {
      const res = await fetch(
        `http://localhost:8081/api/trains?line=${line}&station=${station}&direction=${direction}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setTrains(Array.isArray(data.arrival_times) ? data.arrival_times : []);
    } catch (err) {
      console.error("trains error", err);
      setTrains([]);
      alert("Could not load train times.");
    }

    // 2) fetch live vehicle positions (only by route + optional direction)
    try {
      const url =
        `https://api-v3.mbta.com/vehicles?filter[route]=${line}` +
        `${direction ? `&filter[direction_id]=${direction}` : ""}`;

      const vres = await fetch(url);
      const vdata = await vres.json();
      setVehicles(vdata.data || []);
    } catch (err) {
      console.error("vehicles error", err);
      setVehicles([]);
    }
  };

  return (
    <div className="p-4">
      <div className="flex space-x-8 items-start">
        {/* —— Selection Panel —— */}
        <SelectionPanel
          line={line}
          station={station}
          direction={direction}
          stations={stations}
          setLine={setLine}
          setStation={setStation}
          setDirection={setDirection}
          onSubmit={handleSubmit}
          onShowGreenLineModal={setShowGreenLineModal}
          onLineChangeCleanup={() => {
            setTrains([]);
            setVehicles([]);
          }}
        />

        {/* —— Map —— */}
        <TrainMap vehicles={vehicles} />

        {/* —— Next Trains List —— */}
        <TrainArrivalList trains={trains} />
      </div>

      {/* Green Line Branches Modal */}
      <GreenLineBranchModal
        show={showGreenLineModal}
        onHide={() => setShowGreenLineModal(false)}
        onBranchSelect={handleGreenLineBranchSelect}
      />
    </div>
  );
};

export default ArrivingTrains;
