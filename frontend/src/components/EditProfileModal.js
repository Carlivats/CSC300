import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const EditProfileModal = ({ editShow, setEditShow, newDescription, handleDescriptionChange, handleFileChange, imageUrlInput, setImageUrlInput, handleSaveEdit}) => {
  return (
    <Modal show={editShow} onHide={() => setEditShow(false)} centered>
      <Modal.Header closeButton className="bg-indigo-600 text-white">
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-white">
        <form>
          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              value={newDescription}
              onChange={handleDescriptionChange}
              rows="3"
              placeholder="Write something about yourself..."
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              Upload New Profile Image
            </label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Or Enter Image URL</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://example.com/image.jpg"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="bg-gray-100">
        <Button
          variant="secondary"
          className="rounded-pill px-4"
          onClick={() => setEditShow(false)}
        >
          Cancel
        </Button>
        <Button
          style={{ backgroundColor: "#6366f1", border: "none" }} // Indigo-500
          className="rounded-pill px-4"
          onClick={handleSaveEdit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;