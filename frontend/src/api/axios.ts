import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', // Backend URL
  withCredentials: true, // Cookies için gerekli
  headers: {
    'Content-Type': 'application/json',
  },
});

// İsteğe bağlı: Token'ı localStorage'dan alıp header'a ekleme (Cookie kullanıyorsak şart değil ama yedek olsun)
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        const { state } = JSON.parse(storage);
        if (state?.user?.token) {
          config.headers.Authorization = `Bearer ${state.user.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
