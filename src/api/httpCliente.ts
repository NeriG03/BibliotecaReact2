import axios from 'axios';

interface Cliente {
    id?: number;
    nombre: string;
    apellido_pat: string;
    apellido_mat: string;
    email: string;
    telefono: string;
    direccion: string;
}

export const getAllCliente = (url: string) => {
    return axios.get(`${url}cliente`);
};

export const createCliente = (url: string, cliente: Cliente) => {
    return axios.post(`${url}cliente`, cliente);
};

export const updateCliente = (url: string, id: number, cliente: Cliente) => {
    return axios.put(`${url}cliente/${id}`, cliente);
};

export const deleteCliente = (url: string, id: number) => {
    return axios.delete(`${url}cliente/${id}`);
};
