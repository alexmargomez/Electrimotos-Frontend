import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-700/20 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-[80%] h-[80%]">
        <button
          className="absolute top-3 right-3 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;