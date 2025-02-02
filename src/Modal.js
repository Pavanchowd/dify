import React from "react";
import { motion } from "framer-motion";
import "./Modal.css";

const Modal = ({ message, closeModal }) => {
  return (
    <motion.div
      className="modal-container"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="modal-overlay">
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{message}</h2>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Modal;
