import React, { useState } from 'react';
import { createPersonal, updatePersonal } from '../api/httpPersonal';

interface User {
    id?: number;
    nombre: string;
    apellido_pat: string;
    apellido_mat: string;
    telefono: string;
    email: string;
    direccion: string;
    hora_entrada: string;
    hora_salida: string;
    salario: number;
}

interface PersonalFormProps {
    user?: User | null;
    onSave: () => void;
    onCancel: () => void;
}

const PersonalForm: React.FC<PersonalFormProps> = ({ user, onSave, onCancel }) => {
    const [formData, setFormData] = useState<User>({
        nombre: user?.nombre || '',
        apellido_pat: user?.apellido_pat || '',
        apellido_mat: user?.apellido_mat || '',
        telefono: user?.telefono || '',
        email: user?.email || '',
        direccion: user?.direccion || '',
        hora_entrada: user?.hora_entrada || '',
        hora_salida: user?.hora_salida || '',
        salario: user?.salario || 0,
    });

    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user?.id) {
            updatePersonal(url, user.id, formData)
                .then(() => onSave())
                .catch((err) => console.log(err));
        } else {
            createPersonal(url, formData)
                .then(() => onSave())
                .catch((err) => console.log(err));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
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
                <label className="block text-gray-700">Apellido Paterno</label>
                <input
                    type="text"
                    name="apellido_pat"
                    value={formData.apellido_pat}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Apellido Materno</label>
                <input
                    type="text"
                    name="apellido_mat"
                    value={formData.apellido_mat}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Teléfono</label>
                <input
                    type="text"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Dirección</label>
                <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Hora de Entrada</label>
                <input
                    type="text"
                    name="hora_entrada"
                    value={formData.hora_entrada}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Hora de Salida</label>
                <input
                    type="text"
                    name="hora_salida"
                    value={formData.hora_salida}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Salario</label>
                <input
                    type="number"
                    name="salario"
                    value={formData.salario}
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
    );
};

export default PersonalForm;