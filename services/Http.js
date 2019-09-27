import axios from 'axios';

import { Alert } from 'react-native';
import { fetchPersistentData } from '../services/LocalStorage';
import { TOKEN_STORAGE_KEY } from '../configurations/Constants';

const _axios = axios.create({
  baseURL: 'https://www.yhspy.com/',
  timeout: 60 * 1000, 
  withCredentials: true
});

_axios.interceptors.request.use(async (config) => {
  config.headers = {
    token: await fetchPersistentData(TOKEN_STORAGE_KEY),
  };
  return config;
}, err => {
  return Promise.reject(err);
});

_axios.interceptors.response.use(response => {
  return response.data;
}, (err) => {
  Alert.alert(
    'Network Error',
    JSON.stringify(err),
    {
      cancelable: false
    },
  );
  return Promise.reject(err);
});

export default _axios;
