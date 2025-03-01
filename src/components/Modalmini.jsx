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
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-700/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[30%] h-[40%]">
       
        {children}
      </div>
    </div>
  );
};

export default Modal;