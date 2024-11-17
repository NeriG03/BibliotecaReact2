import React, { useState } from 'react';
import { createLectura, updateLectura } from '../api/httpLectura';

interface Lectura {
    id?: number;
    nombre: string;
    autor: string;
    editorial: string;
    yearPublicacion: Date;
    numTomo: number;
    paisPublicacion: string;
}

interface LecturaFormProps {
    lectura?: Lectura | null;
    onSave: () => void;
    onCancel: () => void;
}

const LecturaForm: React.FC<LecturaFormProps> = ({ lectura, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Lectura>({
        nombre: lectura?.nombre || '',
        autor: lectura?.autor || '',
        editorial: lectura?.editorial || '',
        yearPublicacion: lectura?.yearPublicacion ? new Date(lectura.yearPublicacion) : new Date(),
        numTomo: lectura?.numTomo || 0,
        paisPublicacion: lectura?.paisPublicacion || '',
    });

    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/"; // Add your URL here

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ 
            ...formData, 
            [name]: name === 'yearPublicacion' ? new Date(value) : value 
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (lectura?.id) {
            updateLectura(url, lectura.id, formData)
                .then(() => onSave())
                .catch((err) => console.log(err));
        } else {
            createLectura(url, formData)
                .then(() => onSave())
                .catch((err) => console.log(err));
        }
    };

    return (
        <div className="overflow-y-auto max-h-screen">
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
                <div className="flex justify-end">
                    <button type="button" onClick={onCancel} className="text-gray-500">&times;</button>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Autor</label>
                    <input
                        type="text"
                        name="autor"
                        value={formData.autor}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Editorial</label>
                    <input
                        type="text"
                        name="editorial"
                        value={formData.editorial}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Año de Publicación</label>
                    <input
                        type="date"
                        name="yearPublicacion"
                        value={formData.yearPublicacion.toISOString().split('T')[0]}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Número de Tomo</label>
                    <input
                        type="number"
                        name="numTomo"
                        value={formData.numTomo}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">País de Publicación</label>
                    <input
                        type="text"
                        name="paisPublicacion"
                        value={formData.paisPublicacion}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={onCancel} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LecturaForm;