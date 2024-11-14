// Modal.tsx
import React from 'react';

interface ModalProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-md w-1/2">
                <div className="flex justify-between items-center mb-4">
                
                    <button onClick={onClose} className="text-gray-500">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;