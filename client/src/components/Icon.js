import React from 'react';
import PropTypes from 'prop-types';
import '../styles/icon.css';

const Icon = ({ type, onClick, className, dataId, src, alt, ...props }) => {
  const iconClass = `icon ${type} ${className}`;
  
  return (
    <div className={iconClass} onClick={onClick} data-id={dataId} {...props}>
      {src ? <img src={src} alt={alt} className="icon-image" /> : <span>{type}</span>}
    </div>
  );
};

Icon.propTypes = {
  type: PropTypes.oneOf(['close', 'back', 'action', 'custom']).isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
  dataId: PropTypes.string,
  src: PropTypes.string,
  alt: PropTypes.string,
};

Icon.defaultProps = {
  onClick: () => {},
  className: '',
  dataId: '',
  src: '',
  alt: 'icon',
};

export default Icon;
