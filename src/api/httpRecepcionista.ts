import axios from 'axios';

const URL = "https://biblioteca-ingenieria.onrender.com/api/v1/";

const getAllRecepcionista = async () => {
    return await axios.get(`${URL}recepcionista`);
};

export { getAllRecepcionista };
