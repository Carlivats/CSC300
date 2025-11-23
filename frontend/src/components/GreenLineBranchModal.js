import React from "react";
import { Modal, Row, Col, Card } from "react-bootstrap";

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

const GreenLineBranchModal = ({ show, onHide, onBranchSelect }) => {
  const handleCardClick = (branchId) => {
    onBranchSelect(branchId);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
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
                onClick={() => handleCardClick(branch.id)}
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
  );
};

export default GreenLineBranchModal;
