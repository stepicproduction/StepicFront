import axios from "axios";

const instance = axios.create({
  baseURL: 'https://stepic-back.onrender.com/api/',
  headers: {
    "Content-Type": "application/json",
  }
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");

      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return instance(originalRequest);
        });
      }

      isRefreshing = true;

      try {
        const response = await axios.post(
          "https://stepic-back.onrender.com/api/token/refresh/",
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access_token", newAccessToken);

        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instance(originalRequest);

      } catch (err) {
        processQueue(err, null);

        // 👉 Déconnexion forcée
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export {instance};
// récupérer les données
export const getData = (url) => instance.get(url);

export const getDataPdf = async (url, filename) => {
  try {
    const response = await instance.get(url, { responseType: 'blob' });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlBlob);
  } catch (error) {
    console.error("Erreur lors du téléchargement du PDF : ", error);
    throw error;
  }
}

//endpoint pour le token

export const getToken = (url, config = {}) => instance.get(url, config);

//créer des données
export const createData = (url, data) => instance.post(url, data);

//modifier toutes les données
export const updateData = (url, data) => instance.put(url, data);

//modifier partiellement les données
export const patchData = (url, data) => instance.patch(url, data);

//supprimer les données
export const deleteData = (url) => instance.delete(url);

//envoyer des données avec image
export const createFormData = (url, formData) => {
  // axios va automatiquement mettre multipart/form-data avec boundary
  return instance.post(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const updateDataFormData = (url, formData) => {
  // axios va automatiquement mettre multipart/form-data avec boundary
  return instance.put(url, formData, { headers: { "Content-Type": "multipart/form-data" } });
};

export const patchFormData = (url, formData, config = {}) => {
    // Le Content-Type doit être ici pour gérer les fichiers.
    const fileHeader = { "Content-Type": "multipart/form-data" };
    
    // Fusionner les configurations
    const mergedConfig = {
        ...config,
        headers: {
            // Conserver les headers existants (comme 'Authorization')
            ...(config.headers || {}), 
            // Ajouter/écraser le Content-Type
            ...fileHeader, 
        }
    };

    return instance.patch(url, formData, mergedConfig);
};


