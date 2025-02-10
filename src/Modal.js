import React from "react";
import "./Modal.css"; // Add appropriate styles for your modal

function Modal({ message, closeModal, success }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {success && <span className="checkmark">✔️</span>}
        <h2> Account created successfully</h2>
        <button onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default Modal;
