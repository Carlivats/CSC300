// MBTALayoutPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TrainInfo from './trainInfo';
import ArrivingTrains from '../components/ArrivingTrains';
import Alerts from '../components/Alerts';
import Hero from '../components/Hero';

const MBTALayoutPage = () => {
  const [selectedLine, setSelectedLine] = useState('');
  const [routeShape, setRouteShape] = useState([]);
  
  // Function to handle line selection from child components
  const handleLineSelect = (line) => {
    setSelectedLine(line);
  };

  // Function to get the background color class based on the selected line
  const getBackgroundClass = () => {
    if (!selectedLine) return 'bg-white';
    if (selectedLine === 'Red') return 'bg-red-500';
    if (selectedLine === 'Blue') return 'bg-blue-500';
    if (selectedLine === 'Orange') return 'bg-orange-500';
    if (selectedLine.startsWith('Green') || selectedLine === 'Green') return 'bg-green-500';
    return 'bg-[#435ED3]'; // Default background
  };

  useEffect(() => {
    const fetchRouteShape = async () => {
      if (!selectedLine) return;
      
      try {
        const res = await fetch(`https://api-v3.mbta.com/shapes?filter[route]=${selectedLine}`);
        const data = await res.json();

        // Extract lat/lng pairs
        const shape = data.data.map(point => [
          parseFloat(point.attributes.latitude),
          parseFloat(point.attributes.longitude)
        ]);
        setRouteShape(shape);
      } catch (error) {
        console.error("Error fetching route shape:", error);
        setRouteShape([]);
      }
    };

    fetchRouteShape();
  }, [selectedLine]);

  // Set background color using inline style to ensure it takes precedence
  const bgStyle = {
    backgroundColor: selectedLine === 'Red' ? '#da291c' :
                     selectedLine === 'Blue' ? '#003da5' :
                     selectedLine === 'Orange' ? '#ed8b00' :
                     (selectedLine === 'Green' || selectedLine.startsWith('Green')) ? '#00843d' :
                     '#ffffff',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={bgStyle}>
      <Alerts />
      <Hero />
      <Container fluid className="p-3">
        <Row>
          <Col>
            <ArrivingTrains onLineSelect={handleLineSelect} routeShape={routeShape} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <TrainInfo />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MBTALayoutPage;


