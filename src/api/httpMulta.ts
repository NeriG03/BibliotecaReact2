import axios from 'axios';

const url = "https://biblioteca-ingenieria.onrender.com/api/v1/";

export const createMulta = (multaData: { ReservacionId: number, diasRetraso: number, monto: number }) => {
    return axios.post(`${url}multa`, multaData);
};

export const getMultas = () => {
    return axios.get(`${url}multa`); // Ensure this endpoint is correct
};