import React, { useState, useEffect } from 'react';
import { getAllRecepcionista } from '../api/httpRecepcionista';
import { getAllPersonal } from '../api/httpPersonal';

interface Reservacion {
    id?: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: boolean;
    DatosLecturaId: number;
    ClienteId: number;
    RecepcionistaId: number;
}

interface Lectura {
    id: number;
    nombre: string;
}

interface Cliente {
    id: number;
    nombre: string;
}

interface Personal {
    id: number;
    nombre: string;
}


interface ReservacionFormProps {

    reservacion: Reservacion | null;

    lecturas: Lectura[];

    clientes: Cliente[];

    recepcionistas: Personal[];

    onSave: (reservacion: Reservacion) => void;

    onCancel: () => void;
}





const ReservacionForm: React.FC<ReservacionFormProps> = ({ reservacion, lecturas, clientes, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Reservacion>({
        id: reservacion?.id || undefined,
        fecha_inicio: reservacion?.fecha_inicio || '',
        fecha_fin: reservacion?.fecha_fin || '',
        estado: reservacion?.estado || false,
        DatosLecturaId: reservacion?.DatosLecturaId || 0,
        ClienteId: reservacion?.ClienteId || 0,
        RecepcionistaId: reservacion?.RecepcionistaId || 0,
    });

    const [recepcionistasList, setRecepcionistasList] = useState<Personal[]>([]);

    useEffect(() => {
        getAllRecepcionista().then(response => {
            const recepcionistaPersonalIds = response.data.map((r: { PersonalId: number }) => r.PersonalId);
            getAllPersonal().then(personalResponse => {
                const filteredPersonal = personalResponse.data.filter((p: Personal) => recepcionistaPersonalIds.includes(p.id));
                setRecepcionistasList(filteredPersonal);
            });
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.fecha_inicio && formData.fecha_fin && formData.DatosLecturaId && formData.ClienteId && formData.RecepcionistaId) {
            const formattedData = {
                ...formData,
                DatosLecturaId: parseInt(formData.DatosLecturaId.toString(), 10),
                ClienteId: parseInt(formData.ClienteId.toString(), 10),
                RecepcionistaId: parseInt(formData.RecepcionistaId.toString(), 10),
            };
            console.log('Formatted data:', formattedData); // Log the formatted data
            onSave(formattedData);
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700">Fecha Inicio</label>
                <input
                    type="date"
                    name="fecha_inicio"
                    value={formData.fecha_inicio}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Fecha Fin</label>
                <input
                    type="date"
                    name="fecha_fin"
                    value={formData.fecha_fin}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Estado</label>
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Lectura</label>
                <select
                    name="DatosLecturaId"
                    value={formData.DatosLecturaId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Seleccione una lectura</option>
                    {lecturas.map(lectura => (
                        <option key={lectura.id} value={lectura.id}>
                            {lectura.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Cliente</label>
                <select
                    name="ClienteId"
                    value={formData.ClienteId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Recepcionista</label>
                <select
                    name="RecepcionistaId"
                    value={formData.RecepcionistaId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                >
                    <option value="">Seleccione un recepcionista</option>
                    {recepcionistasList.map(recepcionista => (
                        <option key={recepcionista.id} value={recepcionista.id}>
                            {recepcionista.nombre}
                        </option>
                    ))}
                </select>
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

export default ReservacionForm;