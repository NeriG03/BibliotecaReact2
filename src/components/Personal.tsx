import { useState, useEffect } from 'react';
import { getAllPersonal, deletePersonal } from '../api/httpPersonal'; // Asegúrate de ajustar la ruta según tu estructura de archivos
import PersonalForm from './PersonalForm';

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
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        getAllPersonal(url)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDelete = (id: number) => {
        deletePersonal(url, id)
            .then(() => {
                fetchData();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleModify = (user: User) => {
        setSelectedUser(user);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setSelectedUser(null);
        setIsFormOpen(true);
    };

    const handleSave = () => {
        setIsFormOpen(false);
        fetchData();
    };

    const handleCancel = () => {
        setIsFormOpen(false);
    };

    return (
        <>
            <div className='container mx-auto p-4'>
                <h1 className='text-center font-bold text-2xl mb-4'>PERSONAL</h1>
                <button
                    onClick={handleAdd}
                    className='mb-4 bg-blue-500 text-white py-2 px-4 rounded'
                >
                    Agregar Personal
                </button>
                <hr className='mb-4' />
                {isFormOpen && (
                    <PersonalForm
                        user={selectedUser}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                )}
                <div className='overflow-x-auto'>
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
                                            onClick={() => handleModify(item)}
                                            className='bg-yellow-500 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                        >
                                            Modificar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className='bg-red-500 text-white py-1 px-3 rounded'
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default Personal;