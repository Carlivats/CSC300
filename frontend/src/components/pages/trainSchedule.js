import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

const TrainSchedule = () => {
  const { lineId } = useParams();
  const [schedule, setSchedule] = useState([]);
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

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return <Container className="mt-5"><Alert variant="danger">Error: {error}</Alert></Container>;

  return (
    <Container className="mt-4">
      <h3 className="mb-4">Train Schedule</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Departure Time</th>
            <th>Arrival Time</th>
            <th>Direction</th>
            <th>Status</th>
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