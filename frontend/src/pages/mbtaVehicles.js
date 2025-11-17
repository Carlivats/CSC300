import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import axios from 'axios';


function Vehichles() {
  const [vehicles, setVehicles] = useState([]);


  useEffect(() => {
    async function fetchData() {
      const result = await axios(
        'https://api-v3.mbta.com/vehicles',
      );
      setVehicles(result.data.data);
    }
    fetchData();
  }, []);


  return (
    <div>
      <h1>Vehicles!</h1>
      {vehicles.map(vehicles => (
        <Card
        body
        outline
        color="success" //change for "info"?
        className="mx-1 my-2"
        style={{ width: "30rem" }}
        key={vehicles.id}
      >
        <Card.Body>
            <Card.Title>Vehicle ID: {vehicles.id}</Card.Title>
            <Card.Text>
              <strong>Label:</strong> {vehicles.attributes.label || "N/A"}
            </Card.Text>
            <Card.Text>
              <strong>Status:</strong> {vehicles.attributes.current_status || "Unknown"}
            </Card.Text>
            <Card.Text>
              <strong>Direction:</strong> {vehicles.attributes.direction_id === 0 ? "Outbound" : "Inbound"}
            </Card.Text>
          </Card.Body>
      </Card>
      ))}
    </div>
  );
}


export default Vehichles;