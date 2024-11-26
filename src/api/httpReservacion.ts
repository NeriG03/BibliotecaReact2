import axios from 'axios';

/* const URL = "https://biblioteca-ingenieria.onrender.com/api/v1/"; */

const getAllReservaciones = async (URL: string) => {
    return await axios.get(`${URL}reservacion`);
};

const getReservacionById = async (URL: string, id: number) => {
    return await axios.get(`${URL}reservacion/${id}`);
};

const createReservacion = async (URL: string, reservacion: any) => {
    try {
        console.log('Sending request to create reservacion:', reservacion); // Log the request data
        const response = await axios.post(`${URL}reservacion`, reservacion);
        console.log('Response from server:', response.data); // Log the response data
        return response;
    } catch (error) {
        console.error('Error creating reservacion:', error);
        console.error('Request data:', reservacion);
        throw error;
    }
};

const updateReservacion = async (URL: string, id: number, reservacion: any) => {
    return await axios.put(`${URL}reservacion/${id}`, reservacion);
};

const deleteReservacion = async (URL: string, id: number) => {
    return await axios.delete(`${URL}reservacion/${id}`);
};

export { getAllReservaciones, getReservacionById, createReservacion, updateReservacion, deleteReservacion };