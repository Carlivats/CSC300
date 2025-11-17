import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Modal, Button, Row, Col, Card } from "react-bootstrap";

// fix Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const ArrivingTrains = ({ onLineSelect = () => {}, routeShape = [] }) => {
  const [line, setLine] = useState("");
  const [station, setStation] = useState("");
  const [direction, setDirection] = useState("");
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState([]); // next 3 arrival times
  const [vehicles, setVehicles] = useState([]); // live vehicle locations
  const [showGreenLineModal, setShowGreenLineModal] = useState(false);

  // Green Line branches
  const greenLineBranches = [
    {
      id: "Green-B",
      name: "B Branch",
      description: "Boston College to Government Center",
    },
    {
      id: "Green-C",
      name: "C Branch",
      description: "Cleveland Circle to Government Center",
    },
    {
      id: "Green-D",
      name: "D Branch",
      description: "Riverside to Government Center",
    },
    {
      id: "Green-E",
      name: "E Branch",
      description: "Heath Street to Lechmere",
    },
  ];

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

    // Special handling for Green Line without branch specification
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
    console.log(`Selected Green Line branch: ${branchId}`);
    setLine(branchId);
    setShowGreenLineModal(false);
  };

  // on "Get Trains" click: fetch predictions & vehicles
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-2xl font-semibold text-white">
              Select Line:
            </label>
            <select
              value={line}
              onChange={(e) => {
                const selectedValue = e.target.value;
                if (selectedValue === "Green") {
                  setShowGreenLineModal(true);
                } else {
                  setLine(selectedValue);
                  setStation("");
                  setTrains([]);
                  setVehicles([]);
                }
              }}
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

        {/* —— Map —— */}
        <div className="flex-1 h-[600px]">
          <MapContainer
            center={[42.3601, -71.0589]}
            zoom={12}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
            />
            {vehicles.map((train) => (
              <Marker
                key={train.id}
                position={[
                  train.attributes.latitude,
                  train.attributes.longitude,
                ]}
              >
                <Popup>
                  Train {train.attributes.label}
                  <br />
                  Status: {train.attributes.current_status}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* —— Next Trains List —— */}
        <div className="self-start">
          <h2 className="text-3xl underline font-semibold mb-2 text-white">
            Next Trains
          </h2>
          {trains.length > 0 ? (
            <ul className="pl-6 list-disc text-white text-2xl">
              {trains.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xl font-semibold text-white">
              No train data loaded.
            </p>
          )}
        </div>
      </div>

      {/* Green Line Branches Modal */}
      <Modal
        show={showGreenLineModal}
        onHide={() => setShowGreenLineModal(false)}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#00843d", color: "white" }}
        >
          <Modal.Title>Select Green Line Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#f8f9fa" }}>
          <Row xs={1} md={2} className="g-3">
            {greenLineBranches.map((branch) => (
              <Col key={branch.id}>
                <Card
                  onClick={() => handleGreenLineBranchSelect(branch.id)}
                  style={{
                    backgroundColor: "#00843d",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    minHeight: "120px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  }}
                  className="hover-shadow"
                >
                  <Card.Body>
                    <Card.Title>{branch.name}</Card.Title>
                    <Card.Text>{branch.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ArrivingTrains;
