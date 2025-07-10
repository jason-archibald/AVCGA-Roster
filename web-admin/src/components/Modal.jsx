import React, { useEffect } from 'react';
import './Modal.css';

const Modal = ({ children, onClose, title }) => {
    useEffect(() => {
        const handleEscape = (e) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close" onClick={onClose} type="button">×</button>
                </div>
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
};
export default Modal;
