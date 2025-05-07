// MBTALayoutPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TrainTest from './trainTest';
import TrainInfo from './trainInfo';
import ArrivingTrains from './ArrivingTrains';  // Updated to use ArrivingTrains instead of TrainSchedule

const MBTALayoutPage = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [routeShape, setRouteShape] = useState([]);

  const bgClass =
    selectedLine === 'Blue'   ? 'bg-blue-500'   :
    selectedLine === 'Red'    ? 'bg-red-500'    :
    selectedLine === 'Green'  ? 'bg-green-500'  :
    selectedLine === 'Orange' ? 'bg-orange-500' :
                                'bg-[#435ED3]';      // default background

  useEffect(() => {
    const fetchRouteShape = async () => {
      if (!selectedLine) return;
      const res = await fetch(`https://api-v3.mbta.com/shapes?filter[route]=${selectedLine}`);
      const data = await res.json();

      // Extract lat/lng pairs
      const shape = data.data.map(point => [
        parseFloat(point.attributes.latitude),
        parseFloat(point.attributes.longitude)
      ]);
      setRouteShape(shape);
    };

    fetchRouteShape();
  }, [selectedLine]);

  return (
    <Container fluid className={`p-3 ${bgClass}`}>
      <Row>
        <Col>
          <ArrivingTrains routeShape={routeShape} />  {/* Replaced TrainSchedule with ArrivingTrains */}
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <TrainInfo />
        </Col>
      </Row>
    </Container>
  );
};

export default MBTALayoutPage;


