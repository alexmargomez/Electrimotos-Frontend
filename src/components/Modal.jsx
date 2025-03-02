import React, {useEffect} from 'react';

const Modal = ({ show, onClose, children }) => {

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  },[onClose, show]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-700/20 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[80%] h-[80%]">
        {children}
      </div>
    </div>
  );
};

export default Modal;