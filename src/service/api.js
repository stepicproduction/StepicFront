import axios from "axios";

const instance = axios.create({
  baseURL: 'https://projectback-vmfg.onrender.com/api/',
  headers: {
    "Content-Type": "application/json",
  }
});

export {instance};
// récupérer les données
export const getData = (url) => instance.get(url);

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
