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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
            getAllPersonal(url).then(response => setUser(response.data));
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
                setIsDeleteConfirmOpen(false);
                setUserToDelete(null);
            });
        }
    };

    return (
        <div>
            <button onClick={handleAddPersonal} className="bg-blue-500 text-white py-2 px-4 rounded">
                Agregar Personal
            </button>
            <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                    <tr className='bg-red-700 text-white'>
                        <th className='py-2 px-4 border-b'>Nombre</th>
                        <th className='py-2 px-4 border-b'>Apellido Paterno</th>
                        <th className='py-2 px-4 border-b'>Email</th>
                        <th className='py-2 px-4 border-b'>Salario</th>
                        <th className='py-2 px-4 border-b rounded-r-lg'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {user.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className='text-center py-2 px-4 border-b'>{item.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.apellido_pat}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.email}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.salario}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    onClick={() => handleEditPersonal(item)}
                                    className='bg-yellow-500 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDeletePersonal(item)}
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
                title={selectedUser ? "Modificar Personal" : "Agregar Personal"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            >
                <PersonalForm
                    user={selectedUser}
                    onSave={() => {
                        setIsFormOpen(false);
                        getAllPersonal(url).then(response => setUser(response.data));
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
        </div>
    );
};

export default Personal;