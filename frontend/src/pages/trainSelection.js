import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Container, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create a custom CSS style to enforce background color
const createGlobalStyle = (color) => {
  const style = document.createElement('style');
  style.id = 'mbta-background-style';
  style.innerHTML = `
    body {
      background-color: ${color} !important;
      padding: 20px !important;
      transition: background-color 0.3s ease !important;
    }
  `;
  return style;
};

const TrainSelection = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [showGreenLineModal, setShowGreenLineModal] = useState(false);
  const [selectedGreenLineId, setSelectedGreenLineId] = useState(null);
  const navigate = useNavigate();

  // MBTA Line colors mapping
  const lineColors = {
    'Red': '#da291c',
    'Blue': '#003da5',
    'Green': '#00843d',
    'Orange': '#ed8b00',
    'Commuter Rail': '#80276c'
  };

  // Green Line branches with real MBTA API IDs
  const greenLineBranches = [
    { id: 'Green-B', name: 'B Branch', description: 'Boston College to Government Center' },
    { id: 'Green-C', name: 'C Branch', description: 'Cleveland Circle to Government Center' },
    { id: 'Green-D', name: 'D Branch', description: 'Riverside to Government Center' },
    { id: 'Green-E', name: 'E Branch', description: 'Heath Street to Lechmere' }
  ];

  useEffect(() => {
    const fetchLines = async () => {
      try {
        const response = await axios.get('https://api-v3.mbta.com/routes?filter[type]=0,1,2');
        setLines(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLines();
    
    // Set initial background color to white
    const initialStyle = createGlobalStyle('#ffffff');
    document.head.appendChild(initialStyle);
    
    return () => {
      // Cleanup style on component unmount
      const styleElement = document.getElementById('mbta-background-style');
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Function to handle line selection
  const handleLineSelect = (lineId, lineName) => {
    console.log(`Selected line: ${lineName} with ID: ${lineId}`);
    setSelectedLine(lineName);
    
    // Apply background color change
    applyBackgroundColor(lineName);
    
    // Special handling for Green Line
    if (lineName === 'Green') {
      setShowGreenLineModal(true);
      setSelectedGreenLineId(lineId);
      return;
    }
    
    // For other lines, navigate directly after a brief delay
    setTimeout(() => {
      navigate(`/train-schedule/${lineId}`);
    }, 300);
  };

  // Handle Green Line branch selection
  const handleGreenLineBranchSelect = (branchId) => {
    console.log(`Selected Green Line branch: ${branchId}`);
    setShowGreenLineModal(false);
    
    // Apply the background color (already green from parent selection)
    setTimeout(() => {
      navigate(`/train-schedule/${branchId}`);
    }, 300);
  };

  // Function to apply background color
  const applyBackgroundColor = (lineName) => {
    // Remove existing style if present
    const existingStyle = document.getElementById('mbta-background-style');
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }
    
    // Create and apply new style
    const color = lineColors[lineName] || '#ffffff';
    const newStyle = createGlobalStyle(color);
    document.head.appendChild(newStyle);
    
    console.log(`Applied background color: ${color} for line: ${lineName}`);
  };

  if (loading) return (
    <Container className="text-center mt-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );

  if (error) return <Container className="mt-5 text-danger">Error: {error}</Container>;

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">Select MBTA Line</h2>
      <Row xs={1} md={2} lg={3} className="g-4">
        {lines.map((line) => (
          <Col key={line.id}>
            <Card 
              onClick={() => handleLineSelect(line.id, line.attributes.long_name)}
              style={{ 
                backgroundColor: lineColors[line.attributes.long_name] || '#666',
                color: 'white',
                minHeight: '150px',
                cursor: 'pointer',
                opacity: selectedLine === line.attributes.long_name ? 1 : 0.9,
                transform: selectedLine === line.attributes.long_name ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                border: selectedLine === line.attributes.long_name ? '3px solid white' : 'none'
              }}
              className="hover-shadow train-card"
            >
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <Card.Title>{line.attributes.long_name}</Card.Title>
                  <Card.Text>
                    {line.attributes.description || 'MBTA Transit Line'}
                  </Card.Text>
                </div>
                <Button 
                  variant="light" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card click event
                    handleLineSelect(line.id, line.attributes.long_name);
                  }}
                  className="align-self-start"
                >
                  View Schedule
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Green Line Branches Modal */}
      <Modal 
        show={showGreenLineModal} 
        onHide={() => setShowGreenLineModal(false)}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton style={{ backgroundColor: '#00843d', color: 'white' }}>
          <Modal.Title>Select Green Line Branch</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
          <Row xs={1} md={2} className="g-3">
            {greenLineBranches.map((branch) => (
              <Col key={branch.id}>
                <Card 
                  onClick={() => handleGreenLineBranchSelect(branch.id)}
                  style={{ 
                    backgroundColor: '#00843d',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    minHeight: '120px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
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
    </Container>
  );
};

export default TrainSelection;