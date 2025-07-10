import React, { useEffect } from "react";

const Modal = ({ show, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (show) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-400/50">
      <div className="bg-white p-6 rounded-lg border-2 w-[40%] h-[50%] ">
        {children}
      </div>
    </div>
  );
};

export default Modal;
