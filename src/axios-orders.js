import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://react-my-burger-2f9cc.firebaseio.com/'
});

export default instance;