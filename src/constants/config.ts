import { Platform } from 'react-native';

const config = {
  // Web runs on same machine so use localhost; mobile needs the LAN IP
  API_BASE_URL: Platform.OS === 'web'
    ? 'http://localhost:5000/api'
    : 'http://10.31.212.212:5000/api',
  API_TIMEOUT: 15000,
};

export default config;
