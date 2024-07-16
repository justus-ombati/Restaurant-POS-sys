import React from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';


import '../styles/modal.css';

const Modal = ({ type, title, message, isOpen, onClose, actions }) => {
  if (!isOpen) return null;

  const modalClass = `modal ${type}`;

  return (
    <div className="modal-overlay">
      <div className={modalClass}>
        <div className="modal-header">
          <h2>{title}</h2>
          <Icon
            type="close"
            onClick={() => handleIconClick('close')}
            className="my-close-class" // Custom class for additional styles
            dataId="closeIcon" // Custom data attribute
            src={closeIcon} // Image source
            alt="Close" // Image alt text
            title="Close the popup" // Tooltip text
          />        
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
