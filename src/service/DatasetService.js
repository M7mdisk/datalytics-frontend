import { axiosAPI } from '../axiosAPI';

export const CLEANED = 'C';
export const UNCLEANED = 'U';
export default class DatasetService {
    getDatasets() {
        return axiosAPI.get('/datasets').then((res) => res.data);
    }
    getDataset(datasetId) {
        return axiosAPI.get(`/datasets/${datasetId}`).then((res) => res.data);
    }
    uploadDataset(file, description) {
        console.log(file, description);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        return axiosAPI.post('/datasets/', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res);
    }
}
