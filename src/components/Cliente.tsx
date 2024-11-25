import { useState, useEffect } from 'react';
import { getAllCliente, deleteCliente } from '../api/httpCliente';
import ClienteForm from './ClienteForm';
import Modal from './Modal';

interface Cliente {
    id: number;
    nombre: string;
    apellido_pat: string;
    apellido_mat: string;
    email: string;
    telefono: string;
    direccion: string;
}

const Cliente = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null);
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
        getAllCliente(url).then(response => setClientes(response.data));
    }, []);

    const handleAddCliente = () => {
        setSelectedCliente(null);
        setIsFormOpen(true);
    };

    const handleEditCliente = (cliente: Cliente) => {
        setSelectedCliente(cliente);
        setIsFormOpen(true);
    };

    const handleDeleteCliente = (cliente: Cliente) => {
        setClienteToDelete(cliente);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteCliente = () => {
        if (clienteToDelete) {
            deleteCliente(url, clienteToDelete.id).then(() => {
                setClientes(clientes.filter(c => c.id !== clienteToDelete.id));
                setIsDeleteConfirmOpen(false);
                setClienteToDelete(null);
            }).catch((err) => {
                const error = err as any;
                if (error.response) {
                    console.error("Error deleting cliente:", error.response.data);
                } else {
                    console.error("Error deleting cliente:", error.message);
                }
            });
        }
    };

    return (
        <div>
            <button onClick={handleAddCliente} className="bg-blue-500 text-white py-2 px-4 rounded">
                Agregar Cliente
            </button>
            <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                    <tr className='bg-red-700 text-white'>
                        <th className='py-2 px-4 border-b'>Nombre</th>
                        <th className='py-2 px-4 border-b'>Apellido Paterno</th>
                        <th className='py-2 px-4 border-b'>Apellido Materno</th>
                        <th className='py-2 px-4 border-b'>Email</th>
                        <th className='py-2 px-4 border-b'>Teléfono</th>
                        <th className='py-2 px-4 border-b'>Dirección</th>
                        <th className='py-2 px-4 border-b rounded-r-lg'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {clientes.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className='text-center py-2 px-4 border-b'>{item.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.apellido_pat}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.apellido_mat}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.email}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.telefono}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.direccion}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    onClick={() => handleEditCliente(item)}
                                    className='bg-yellow-500 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDeleteCliente(item)}
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
                title={selectedCliente ? "Modificar Cliente" : "Agregar Cliente"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            >
                <ClienteForm
                    cliente={selectedCliente}
                    onSave={() => {
                        setIsFormOpen(false);
                        getAllCliente(url).then(response => setClientes(response.data));
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <p>¿Estás seguro de que deseas eliminar este cliente?</p>
                <div className="flex justify-end">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={confirmDeleteCliente} className="bg-red-500 text-white py-2 px-4 rounded">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Cliente;
