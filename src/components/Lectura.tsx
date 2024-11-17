import { useState, useEffect } from 'react';
import { getAllLectura, deleteLectura } from '../api/httpLectura';
import LecturaForm from './LecturaForm';
import Modal from './Modal';

interface Lectura {
    id: number;
    nombre: string;
    autor: string;
    editorial: string;
    yearPublicacion: Date;
    numTomo: number;
    paisPublicacion: string;
}

const Lectura = () => {
    const [lectura, setLectura] = useState<Lectura[]>([]);
    const [selectedLectura, setSelectedLectura] = useState<Lectura | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [lecturaToDelete, setLecturaToDelete] = useState<Lectura | null>(null);
    const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

    useEffect(() => {
        getAllLectura(url).then(response => setLectura(response.data));
    }, []);

    const handleAddLectura = () => {
        setSelectedLectura(null);
        setIsFormOpen(true);
    };

    const handleEditLectura = (lectura: Lectura) => {
        setSelectedLectura(lectura);
        setIsFormOpen(true);
    };

    const handleDeleteLectura = (lectura: Lectura) => {
        setLecturaToDelete(lectura);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDeleteLectura = () => {
        if (lecturaToDelete) {
            deleteLectura(url, lecturaToDelete.id).then(() => {
                setLectura(lectura.filter(l => l.id !== lecturaToDelete.id));
                setIsDeleteConfirmOpen(false);
                setLecturaToDelete(null);
            }).catch((err) => {
                const error = err as any;
                if (error.response) {
                    console.error("Error deleting lectura:", error.response.data);
                } else {
                    console.error("Error deleting lectura:", error.message);
                }
            });
        }
    };

    return (
        <div>
            <button onClick={handleAddLectura} className="bg-blue-500 text-white py-2 px-4 rounded">
                Agregar Lectura
            </button>
            <table className='min-w-full bg-white border border-gray-200'>
                <thead>
                    <tr className='bg-red-700 text-white'>
                        <th className='py-2 px-4 border-b'>Nombre</th>
                        <th className='py-2 px-4 border-b'>Autor</th>
                        <th className='py-2 px-4 border-b'>Editorial</th>
                        <th className='py-2 px-4 border-b'>Año de Publicación</th>
                        <th className='py-2 px-4 border-b'>Número de Tomo</th>
                        <th className='py-2 px-4 border-b'>País de Publicación</th>
                        <th className='py-2 px-4 border-b rounded-r-lg'>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lectura.map((item, index) => (
                        <tr key={index} className='hover:bg-gray-100'>
                            <td className='text-center py-2 px-4 border-b'>{item.nombre}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.autor}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.editorial}</td>
                            <td className='text-center py-2 px-4 border-b'>{new Date(item.yearPublicacion).toISOString().split('T')[0]}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.numTomo}</td>
                            <td className='text-center py-2 px-4 border-b'>{item.paisPublicacion}</td>
                            <td className='text-center py-2 px-4 border-b'>
                                <button
                                    onClick={() => handleEditLectura(item)}
                                    className='bg-yellow-500 text-white py-1 px-2 rounded mr-2 ml-2 mb-2'
                                >
                                    Modificar
                                </button>
                                <button
                                    onClick={() => handleDeleteLectura(item)}
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
                title={selectedLectura ? "Modificar Lectura" : "Agregar Lectura"}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
            >
                <LecturaForm
                    lectura={selectedLectura}
                    onSave={() => {
                        setIsFormOpen(false);
                        getAllLectura(url).then(response => setLectura(response.data));
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal>

            <Modal
                title="Confirmar Eliminación"
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
            >
                <p>¿Estás seguro de que deseas eliminar esta lectura?</p>
                <div className="flex justify-end">
                    <button onClick={() => setIsDeleteConfirmOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded mr-2">
                        Cancelar
                    </button>
                    <button onClick={confirmDeleteLectura} className="bg-red-500 text-white py-2 px-4 rounded">
                        Eliminar
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Lectura;