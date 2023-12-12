import axios from 'axios';

const checkSession = async () => {
  try {
    const getStaticProps = async () => {
      const res = await axios.get('http://localhost:4000/auth/check');
      console.log(res.data);
      return res.data;
    }

    getStaticProps();

  } catch (error) {
    console.error(error);
    return false;
  }
}

export { checkSession };