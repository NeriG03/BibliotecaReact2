import React, { useState } from 'react';
import { createCliente, updateCliente } from '../api/httpCliente';

interface Cliente {
    id?: number;
    nombre: string;
    apellido_pat: string;
    apellido_mat: string;
    email: string;
    telefono: string;
    direccion: string;
}

interface ClienteFormProps {
    cliente?: Cliente | null;
    onSave: () => void;
    onCancel: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ cliente, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Cliente>({
        nombre: cliente?.nombre || '',
        apellido_pat: cliente?.apellido_pat || '',
        apellido_mat: cliente?.apellido_mat || '',
        email: cliente?.email || '',
        telefono: cliente?.telefono || '',
        direccion: cliente?.direccion || '',
    });

    const [errors, setErrors] = useState({
        nombre: '',
        apellido_pat: '',
        apellido_mat: '',
        email: '',
        telefono: '',
        direccion: '',
    });

    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        let valid = true;
        const newErrors = {
            nombre: '',
            apellido_pat: '',
            apellido_mat: '',
            email: '',
            telefono: '',
            direccion: '',
        };

        if (!formData.nombre) {
            newErrors.nombre = 'El nombre es requerido';
            valid = false;
        }
        if (!formData.apellido_pat) {
            newErrors.apellido_pat = 'El apellido paterno es requerido';
            valid = false;
        }
        if (!formData.apellido_mat) {
            newErrors.apellido_mat = 'El apellido materno es requerido';
            valid = false;
        }
        if (!formData.email) {
            newErrors.email = 'El email es requerido';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
            valid = false;
        }
        if (!formData.telefono) {
            newErrors.telefono = 'El teléfono es requerido';
            valid = false;
        } else if (!/^\d{10}$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono debe tener 10 dígitos';
            valid = false;
        }
        if (!formData.direccion) {
            newErrors.direccion = 'La dirección es requerida';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            if (cliente?.id) {
                updateCliente(url, cliente.id, formData)
                    .then(() => onSave())
                    .catch((err) => console.log(err));
            } else {
                createCliente(url, formData)
                    .then(() => onSave())
                    .catch((err) => console.log(err));
            }
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
                    {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
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
                    {errors.apellido_pat && <p className="text-red-500 text-sm">{errors.apellido_pat}</p>}
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
                    {errors.apellido_mat && <p className="text-red-500 text-sm">{errors.apellido_mat}</p>}
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
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
                    {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
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
                    {errors.direccion && <p className="text-red-500 text-sm">{errors.direccion}</p>}
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

export default ClienteForm;
