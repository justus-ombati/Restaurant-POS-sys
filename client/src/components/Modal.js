import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Icon from './Icon';
import close from '../icons/close.png';
import '../styles/modal.css';

const Modal = ({ type, title, message, isOpen }) => {
  const modalClass = `modal ${type}`;
  const [ isModalOpen, setIsModalOpen ] = useState(false);

  const closeModal = () => {
    setTimeout(() => {
      setIsModalOpen(false);
    }, 300);
  };

  return (
    <div className="modal-container">
      <div className={modalClass}>
        <div className="modal-header">
          <h2>{title}</h2>
          <Icon
            type="close"
            onClick={closeModal}
            className="close-btn"
            dataId="closeIcon"
            src={close}
            alt="Close"
            title="Close the popup"
          />        
        </div>
        <div className="modal-body">
          <p>{message}</p>
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
  actions: PropTypes.node,
};

Modal.defaultProps = {
  actions: null,
};

export default Modal;
