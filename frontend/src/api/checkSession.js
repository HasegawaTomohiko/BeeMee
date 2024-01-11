import axios from 'axios';

const checkSession = async () => {
    const jwtToken = sessionStorage.getItem('jwtToken');
    
    if (!jwtToken && window.location.pathname !== '/login' && window.location.pathname !== '/regist') {
        window.location.href = '/login';
        return;
    }
    
    try {
        const res = await axios.get('http://localhost:4000/auth/session', {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            }
        });

        if (res.status === 200) {
            console.log(res.data);
            return;
        }

    } catch (error) {
        if (error.response && error.response.status === 401 && window.location.pathname !== '/login' && window.location.pathname !== '/regist') {
            window.location.href = '/login';
        }
    }
};

export default checkSession;
