import React from 'react';
import PropTypes from 'prop-types';
import '../styles/button.css';

const Button = ({ type, label, onClick, className, dataId, ...props }) => {
  const buttonClass = `button ${type} ${className}`;
  
  return (
    <button className={buttonClass} onClick={onClick} data-id={dataId} {...props}>
      {label}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['save', 'delete', 'cancel', 'confirm', 'add', 'remove', 'submit', 'close', 'view']).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  dataId: PropTypes.string,
};

Button.defaultProps = {
  onClick: () => {},
  className: '',
  dataId: '',
};

export default Button;