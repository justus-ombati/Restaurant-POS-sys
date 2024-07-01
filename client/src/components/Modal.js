import React from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

import '../styles/modal.css';

const Modal = ({ type, title, message, isOpen, onClose, actions }) => {
  if (!isOpen) return null;

  const modalClass = `modal ${type}`;

  return (
    <div className="modal-overlay">
      <div className={modalClass}>
        <div className="modal-header">
          <h2>{title}</h2>
          <Button className="close-button" type="close" label="X" onClick={onClose} />
        </div>
        <div className="modal-body">
          <p>{message}</p>
        </div>
        <div className="modal-footer">
          {actions}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  type: PropTypes.oneOf(['alert', 'confirmation', 'error', 'info', 'warning', 'success']).isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.node,
};

Modal.defaultProps = {
  actions: null,
};

export default Modal;
