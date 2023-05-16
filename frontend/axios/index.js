import axios from 'axios';

// ✨ implement axiosWithAuth

const axiosWithAuthentication =() => {
    const token = localStorage.getItem('token');

    return axios.create({
        headers: {
            Authorization: token,
        },
    });
};

export default axiosWithAuthentication;
