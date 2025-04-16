import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Container, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrainSelection = () => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // MBTA Line colors mapping
  const lineColors = {
    'Red': '#da291c',
    'Blue': '#003da5',
    'Green': '#00843d',
    'Orange': '#ed8b00',
    'Commuter Rail': '#80276c'
  };

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
  }, []);

  const handleLineSelect = (lineId) => {
    navigate(`/train-schedule/${lineId}`);
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
              style={{ 
                backgroundColor: lineColors[line.attributes.long_name] || '#666',
                color: 'white',
                minHeight: '150px'
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
                  onClick={() => handleLineSelect(line.id)}
                  className="align-self-start"
                >
                  View Schedule
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TrainSelection;