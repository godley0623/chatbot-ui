// Modal.js
import React, { useContext } from 'react';
import HomeContext from '@/pages/api/home/home.context';

const Modal = ({ show, onClose, children }) => {
    const { state: { lightMode } } = useContext(HomeContext);

    if (!show) {
        return null;
    }

    const modalStyle = lightMode ? "modal-light" : "modal-dark";
    const overlayStyle = lightMode ? "modal-overlay-light" : "modal-overlay-dark";

    return (
        <div className={`modal-overlay ${overlayStyle}`}>
            <div className={`modal ${modalStyle}`}>
                <button onClick={onClose}>Close</button>
                {children}
            </div>
            <style jsx>{`
                .modal-overlay-light, .modal-overlay-dark {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .modal-overlay-light {
                    background-color: rgba(255, 255, 255, 0.5); // Adjust for light mode
                }

                .modal-overlay-dark {
                    background-color: rgba(0, 0, 0, 0.5); // Adjust for dark mode
                }

                .modal-light, .modal-dark {
                    padding: 20px;
                    border-radius: 5px;
                }

                .modal-light {
                    background: #fff; // Light background
                    color: #000; // Dark text for light background
                }

                .modal-dark {
                    background: #202123; // Dark background
                    color: #fff; // Light text for dark background
                }
            `}</style>
        </div>
    );
};

export default Modal;
