import { useState, useEffect } from 'react';
import { getAllReservaciones, deleteReservacion, createReservacion, updateReservacion } from '../api/httpReservacion';
import { getAllLectura } from '../api/httpLectura';
import { getAllCliente } from '../api/httpCliente';
import { getAllRecepcionista } from '../api/httpRecepcionista';
import { getAllPersonal } from '../api/httpPersonal';
import Modal from './Modal';
import ReservacionForm from './ReservacionForm';

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
        </div>
    );
};

export default Reservacion;