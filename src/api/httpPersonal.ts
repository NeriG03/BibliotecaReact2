import axios from "axios";

const URL = "https://biblioteca-ingenieria.onrender.com/api/v1";

const getAllPersonal = async () => {
    return await axios.get(`${URL}/personal`);
};

function getPersonalById(url: string, id: number) {
    return axios.get(url + "personal/" + id);
}

function createPersonal(url: string, data: any) {
    return axios.post(url + "personal", data);
}

function updatePersonal(url: string, id: number, data: any) {
    return axios.put(url + "personal/" + id, data);
}

function deletePersonal(url: string, id: number) {
    return axios.delete(url + "personal/" + id);
}

export { getAllPersonal, getPersonalById, createPersonal, updatePersonal, deletePersonal };






