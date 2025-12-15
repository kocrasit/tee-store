import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is required');
}

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Authorization header ekle
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('auth-storage');
      if (storage) {
        try {
          const { state } = JSON.parse(storage);
          if (state?.user?.token) {
            config.headers.Authorization = `Bearer ${state.user.token}`;
          }
        } catch {
          // ignore parse errors
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh state (to prevent multiple refresh calls)
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Unwrap data + Token refresh
api.interceptors.response.use(
  (response) => {
    const payload = response.data;
    // Backend format: { success: boolean, data?: any, message?: string }
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (payload.success === true && 'data' in payload) {
        return { ...response, data: payload.data };
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 401 ve henüz retry yapılmadıysa token refresh dene
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Zaten refresh yapılıyorsa kuyruğa ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token && originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token'ı cookie'den veya localStorage'dan al
        let refreshToken: string | undefined;
        if (typeof window !== 'undefined') {
          const storage = localStorage.getItem('auth-storage');
          if (storage) {
            const { state } = JSON.parse(storage);
            refreshToken = state?.user?.refreshToken;
          }
        }

        const res = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        const data = res.data?.data || res.data;
        const newAccessToken = data?.accessToken || data?.token;

        if (newAccessToken && typeof window !== 'undefined') {
          // localStorage'daki user objesini güncelle
          const storage = localStorage.getItem('auth-storage');
          if (storage) {
            const parsed = JSON.parse(storage);
            if (parsed.state?.user) {
              parsed.state.user.token = newAccessToken;
              if (data.refreshToken) {
                parsed.state.user.refreshToken = data.refreshToken;
              }
              localStorage.setItem('auth-storage', JSON.stringify(parsed));
            }
          }
        }

        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Refresh başarısız: logout yap
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
          // Opsiyonel: login sayfasına yönlendir
          // window.location.href = '/auth/login';
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Type-safe API helpers
export const apiGet = <T>(url: string, config?: Parameters<typeof api.get>[1]) =>
  api.get<T>(url, config).then((res) => res.data);

export const apiPost = <T>(url: string, data?: unknown, config?: Parameters<typeof api.post>[2]) =>
  api.post<T>(url, data, config).then((res) => res.data);

export const apiPut = <T>(url: string, data?: unknown, config?: Parameters<typeof api.put>[2]) =>
  api.put<T>(url, data, config).then((res) => res.data);

export const apiDelete = <T>(url: string, config?: Parameters<typeof api.delete>[1]) =>
  api.delete<T>(url, config).then((res) => res.data);


