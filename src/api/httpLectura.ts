import axios from 'axios';

interface Lectura {
    id?: number;
    nombre: string;
    autor: string;
    editorial: string;
    yearPublicacion: Date;
    numTomo: number;
    paisPublicacion: string;
}

const formatLectura = (lectura: Lectura) => ({
    ...lectura,
    yearPublicacion: lectura.yearPublicacion.toISOString().split('T')[0],
});

export const getAllLectura = async (url: string) => {
    try {
        return await axios.get(`${url}datosLectura`);
    } catch (error) {
        console.error("Error fetching lecturas:", error);
        throw error;
    }
};

export const createLectura = async (url: string, lectura: Lectura) => {
    try {
        const formattedLectura = formatLectura(lectura);
        console.log("Creating Lectura:", formattedLectura);
        return await axios.post(`${url}datosLectura`, formattedLectura);
    } catch (error) {
        console.error("Error creating lectura:", error);
        throw error;
    }
};

export const updateLectura = async (url: string, id: number, lectura: Lectura) => {
    try {
        const formattedLectura = formatLectura(lectura);
        console.log("Updating Lectura:", formattedLectura);
        const response = await axios.put(`${url}datosLectura/${id}`, formattedLectura);
        console.log("Update response:", response.data);
        return response.data;
    } catch (error) {
        const err = error as any;
        if (err.response) {
            console.error("Error updating lectura:", err.response.data);
        } else {
            console.error("Error updating lectura:", err.message);
        }
        throw error;
    }
};

export const deleteLectura = async (url: string, id: number) => {
    try {
        console.log("Deleting Lectura ID:", id);
        const response = await axios.delete(`${url}datosLectura/${id}`);
        console.log("Delete response:", response.data);
        return response.data;
    } catch (error) {
        const err = error as any;
        if (err.response) {
            console.error("Error deleting lectura:", err.response.data);
        } else {
            console.error("Error deleting lectura:", err.message);
        }
        throw error;
    }
};