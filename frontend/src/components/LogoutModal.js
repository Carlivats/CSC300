import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const LogoutModal = ({ show, setShow, handleLogout }) => {
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
      <Modal.Header closeButton className="bg-red-600 text-white">
        <Modal.Title>Confirm Logout</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white text-center">
        <p className="mb-0 text-gray-800">Are you sure you want to log out?</p>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100">
        <Button
          variant="secondary"
          className="rounded-pill px-4"
          onClick={() => setShow(false)}
        >
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#ef4444", border: "none" }} // Red-500
          className="rounded-pill px-4"
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogoutModal;
