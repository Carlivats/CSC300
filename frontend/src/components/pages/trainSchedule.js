import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';


// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TrainSchedule = () => {
  const { lineId } = useParams();
  const [schedule, setSchedule] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(
          `https://api-v3.mbta.com/schedules?filter[route]=${lineId}`
        );
        setSchedule(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [lineId]);

  // Fetch live vehicle locations
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await axios.get(`https://api-v3.mbta.com/vehicles?filter[route]=${lineId}`);
        setVehicles(res.data.data);
      } catch (err) {
        console.error('Error fetching vehicle data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 15000); // refresh every 15s
    return () => clearInterval(interval); // cleanup
  }, [lineId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Train Schedule & Live Map</h3>

      {/* Map */}
      <MapContainer center={[42.3601, -71.0589]} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a> contributors'
        />
        {vehicles.map((train) => {
          const { latitude, longitude, label } = train.attributes;
          return (
            <Marker key={train.id} position={[latitude, longitude]}>
              <Popup>
                Train {label} <br />
                Current Status: {train.attributes.current_status}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
          </tr>
        </thead>
        <tbody>
          {schedule.map((item) => (
            <tr key={item.id}>
              <td>{new Date(item.attributes.departure_time).toLocaleTimeString()}</td>
              <td>{new Date(item.attributes.arrival_time).toLocaleTimeString()}</td>
              <td>{item.attributes.direction_id === 0 ? 'Outbound' : 'Inbound'}</td>
              <td>{item.attributes.status || 'On Time'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default TrainSchedule;