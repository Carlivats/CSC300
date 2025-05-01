// MBTALayoutPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TrainTest from './trainTest';
import TrainInfo from './trainInfo';
import TrainSchedule from './trainSchedule';

const MBTALayoutPage = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [routeShape, setRouteShape] = useState([]);

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
    <Container fluid className="p-3">
      <Row>
        <Col>
          <TrainSchedule routeShape={routeShape} />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <TrainTest onLineSelect={setSelectedLine} />
        </Col>
        <Col md={6}>
          <TrainInfo />
        </Col>
      </Row>
    </Container>
  );
};

export default MBTALayoutPage;
