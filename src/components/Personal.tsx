// Personal.tsx
import { useState, useEffect } from 'react';
import { getAllPersonal, deletePersonal } from '../api/httpPersonal';
import PersonalForm from './PersonalForm';
import Modal from './Modal';

interface User {
    id: number;
    nombre: string;
    apellido_pat: string;
    apellido_mat: string;
    email: string;
    telefono: string;
    direccion: string;
    hora_entrada: string;
    hora_salida: string;
    salario: number;
}

const Personal = () => {
    const [user, setUser] = useState<User[]>([]);
    const [filteredUser, setFilteredUser] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDataModalOpen, setIsDataModalOpen] = useState(false);
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
        getAllPersonal(url).then(response => {
            setUser(response.data);
            setFilteredUser(response.data);
        });
    }, []);

    const handleAddPersonal = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleEditPersonal = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleDeletePersonal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeletePersonal = () => {
        if (userToDelete) {
            deletePersonal(url, userToDelete.id).then(() => {
                setUser(user.filter(u => u.id !== userToDelete.id));
                setFilteredUser(filteredUser.filter(u => u.id !== userToDelete.id));
                setIsDeleteConfirmOpen(false);
                setUserToDelete(null);
            });
        }
    };

    const filterBySalary = (min: number, max: number) => {
        setFilteredUser(user.filter(u => u.salario >= min && u.salario <= max));
    };

    const handleViewData = (user: User) => {
        setSelectedUser(user);
        setIsDataModalOpen(true);
    };

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                <button onClick={handleAddPersonal} className="bg-blue-600 text-white py-2 px-4 rounded">
                    + Agregar Personal
                </button>
                <button onClick={() => filterBySalary(0, 2000)} className="bg-blue-400 text-white py-2 px-4 rounded">
                    Limpieza
                </button>
                <button onClick={() => filterBySalary(2001, 4000)} className="bg-blue-400 text-white py-2 px-4 rounded">
                    Ayudante
                </button>
                <button onClick={() => filterBySalary(4001, 6000)} className="bg-blue-400 text-white py-2 px-4 rounded">
                    Recepcionista
                </button>
                <button onClick={() => filterBySalary(6001, Infinity)} className="bg-blue-400 text-white py-2 px-4 rounded">
                    Administrador
                </button>
            </div>
            <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                    <tr className='bg-blue-900 text-white'>
                        <th className='py-2 px-4 border-b'>Nombre</th>
                        <th className='py-2 px-4 border-b'>Apellido Paterno</th>
                        <th className='py-2 px-4 border-b'>Email</th>
                        <th className='py-2 px-4 border-b'>Telefono</th>
                        <th className='py-2 px-4 border-b rounded-r-lg'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUser.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className='text-center py-2 px-4 border-b'>{item.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.apellido_pat}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.email}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.telefono}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    onClick={() => handleEditPersonal(item)}
                                    className='bg-yellow-400 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDeletePersonal(item)}
                                    className='bg-red-400 text-white py-1 px-3 rounded'
                                >
                                    Eliminar
                                </button>
                                <button
                                    onClick={() => handleViewData(item)}
                                    className='bg-blue-400 text-white py-1 px-3 rounded ml-2'
                                >
                                    Datos
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                title={selectedUser ? "Modificar Personal" : "Agregar Personal"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            >
                <PersonalForm
                    user={selectedUser}
                    onSave={() => {
                        setIsFormOpen(false);
                        getAllPersonal(url).then(response => {
                            setUser(response.data);
                            setFilteredUser(response.data);
                        });
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <p>¿Estás seguro de que deseas eliminar este personal?</p>
                <div className="flex justify-end">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={confirmDeletePersonal} className="bg-red-500 text-white py-2 px-4 rounded">
                        Eliminar
                    </button>
                </div>
            </Modal>

            <Modal
                title="Datos del Personal"
                isOpen={isDataModalOpen}
                onClose={() => setIsDataModalOpen(false)}
            >
                {selectedUser && (
                    <div>
                        <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                        <p><strong>Apellido Paterno:</strong> {selectedUser.apellido_pat}</p>
                        <p><strong>Apellido Materno:</strong> {selectedUser.apellido_mat}</p>
                        <p><strong>Email:</strong> {selectedUser.email}</p>
                        <p><strong>Teléfono:</strong> {selectedUser.telefono}</p>
                        <p><strong>Dirección:</strong> {selectedUser.direccion}</p>
                        <p><strong>Hora de Entrada:</strong> {selectedUser.hora_entrada}</p>
                        <p><strong>Hora de Salida:</strong> {selectedUser.hora_salida}</p>
                        <p><strong>Salario:</strong> {selectedUser.salario}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Personal;