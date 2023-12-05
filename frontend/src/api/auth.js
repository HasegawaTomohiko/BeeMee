import axios from 'axios';

const checkSession = async () => {
  try {
    const res = await axios.get('http://localhost:4000/auth/check');
    return res.data.auth;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export { checkSession };