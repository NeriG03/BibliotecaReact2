import { useState, useEffect } from 'react';
import { getAllReservaciones, deleteReservacion, createReservacion, updateReservacion } from '../api/httpReservacion';
import { getAllLectura } from '../api/httpLectura';
import { getAllCliente } from '../api/httpCliente';
import { getAllRecepcionista } from '../api/httpRecepcionista';
import { getAllPersonal } from '../api/httpPersonal';
import Modal from './Modal';
import ReservacionForm from './ReservacionForm';
import { createMulta } from '../api/httpMulta'; // Import the createMulta function

interface Reservacion {
    id?: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado: boolean;
    DatosLecturaId: number;
    ClienteId: number;
    RecepcionistumId: number;
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
    salario: number;
}

const Reservacion = () => {
    const [reservaciones, setReservaciones] = useState<Reservacion[]>([]);
    const [lecturas, setLecturas] = useState<Lectura[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [recepcionistas, setRecepcionistas] = useState<Personal[]>([]);
    const [selectedReservacion, setSelectedReservacion] = useState<Reservacion | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [reservacionToDelete, setReservacionToDelete] = useState<Reservacion | null>(null);
    const [isMultaFormOpen, setIsMultaFormOpen] = useState(false);
    const [selectedReservacionId, setSelectedReservacionId] = useState<number | null>(null);
    const [multaData, setMultaData] = useState({ diasRetraso: '', monto: '' });
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
        const fetchData = async () => {
            const reservacionesResponse = await getAllReservaciones(url);
            const lecturasResponse = await getAllLectura(url);
            const clientesResponse = await getAllCliente(url);
            const recepcionistasResponse = await getAllRecepcionista();
            const personalResponse = await getAllPersonal();

            const recepcionistaPersonalIds = recepcionistasResponse.data.map((r: { PersonalId: number }) => r.PersonalId);
            const filteredPersonal = personalResponse.data.filter((p: Personal) => recepcionistaPersonalIds.includes(p.id));

            setReservaciones(reservacionesResponse.data);
            setLecturas(lecturasResponse.data);
            setClientes(clientesResponse.data);
            setRecepcionistas(filteredPersonal);
        };

        fetchData();
    }, []);

    const handleAddReservacion = () => {
        setSelectedReservacion(null);
        setIsFormOpen(true);
    };

    const handleEditReservacion = (reservacion: Reservacion) => {
        setSelectedReservacion(reservacion);
        setIsFormOpen(true);
    };

    const handleDeleteReservacion = (reservacion: Reservacion) => {
        setReservacionToDelete(reservacion);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteReservacion = () => {
        if (reservacionToDelete) {
            deleteReservacion(url, reservacionToDelete.id!).then(() => {
                setReservaciones(reservaciones.filter(r => r.id !== reservacionToDelete.id));
                setIsDeleteConfirmOpen(false);
                setReservacionToDelete(null);
            });
        }
    };

    const handleSaveReservacion = (reservacion: Reservacion) => {
        if (reservacion.id) {
            updateReservacion(url, reservacion.id, reservacion).then(() => {
                setReservaciones(reservaciones.map(r => (r.id === reservacion.id ? reservacion : r)));
                setIsFormOpen(false);
            }).catch(error => {
                console.error('Error updating reservacion:', error);
            });
        } else {
            createReservacion(url, reservacion).then(response => {
                setReservaciones([...reservaciones, response.data]);
                setIsFormOpen(false);
            }).catch(error => {
                console.error('Error creating reservacion:', error);
            });
        }
    };

    const handleMultaReservacion = (reservacionId: number) => {
        setSelectedReservacionId(reservacionId);
        setIsMultaFormOpen(true);
    };

    const handleMultaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMultaData({
            ...multaData,
            [name]: value,
        });
    };

    const handleMultaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedReservacionId && multaData.diasRetraso && multaData.monto) {
            const multaPayload = {
                ReservacionId: selectedReservacionId,
                diasRetraso: parseInt(multaData.diasRetraso, 10),
                monto: parseFloat(multaData.monto),
            };
            createMulta(multaPayload).then(() => {
                setIsMultaFormOpen(false);
                setMultaData({ diasRetraso: '', monto: '' });
                setSelectedReservacionId(null);
            }).catch(error => {
                console.error('Error creating multa:', error);
            });
        } else {
            alert('Please fill in all required fields.');
        }
    };

    return (
        <div>
            <button onClick={handleAddReservacion} className="bg-blue-500 text-white py-2 px-4 rounded">
                Agregar Reservación
            </button>
            <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                    <tr className='bg-green-700 text-white'>
                        <th className='py-2 px-4 border-b'>Fecha Inicio</th>
                        <th className='py-2 px-4 border-b'>Fecha Fin</th>
                        <th className='py-2 px-4 border-b'>Estado</th>
                        <th className='py-2 px-4 border-b'>Lectura</th>
                        <th className='py-2 px-4 border-b'>Cliente</th>
                        <th className='py-2 px-4 border-b rounded-r-lg'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {reservaciones.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className='text-center py-2 px-4 border-b'>{item.fecha_inicio}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.fecha_fin}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className='text-center py-2 px-4 border-b'>{lecturas.find(l => l.id === item.DatosLecturaId)?.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>{clientes.find(c => c.id === item.ClienteId)?.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    onClick={() => handleEditReservacion(item)}
                                    className='bg-yellow-500 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDeleteReservacion(item)}
                                    className='bg-red-500 text-white py-1 px-3 rounded'
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleMultaReservacion(item.id!)}
                                    className='bg-purple-500 text-white py-1 px-3 rounded'
                                >
                                    Multa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                title={selectedReservacion ? "Modificar Reservación" : "Agregar Reservación"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            >
                <ReservacionForm
                    reservacion={selectedReservacion}
                    lecturas={lecturas}
                    clientes={clientes}
                    recepcionistas={recepcionistas}
                    onSave={handleSaveReservacion}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <p>¿Estás seguro de que deseas eliminar esta reservación?</p>
                <div className="flex justify-end">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={confirmDeleteReservacion} className="bg-red-500 text-white py-2 px-4 rounded">
                        Eliminar
                    </button>
                </div>
            </Modal>

            <Modal
                title="Agregar Multa"
                isOpen={isMultaFormOpen}
                onClose={() => setIsMultaFormOpen(false)}
            >
                <form onSubmit={handleMultaSubmit} className="bg-white p-4 rounded shadow-md">
                    <div className="mb-4">
                        <label className="block text-gray-700">Días de Retraso</label>
                        <input
                            type="number"
                            name="diasRetraso"
                            value={multaData.diasRetraso}
                            onChange={handleMultaChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Monto</label>
                        <input
                            type="number"
                            name="monto"
                            value={multaData.monto}
                            onChange={handleMultaChange}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={() => setIsMultaFormOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                            Cancelar
                        </button>
                        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                            Guardar
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Reservacion;