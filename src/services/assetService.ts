import api from './api';
import { Asset } from '../types/asset';

export const assetService = {
  getAssets: async (): Promise<Asset[]> => {
    const response = await api.get('/assets');
    return response.data.data;
  },

  getAssetById: async (id: number): Promise<Asset> => {
    const response = await api.get(`/assets/${id}`);
    return response.data.data;
  },

  createAsset: async (data: any): Promise<Asset> => {
    const response = await api.post('/assets', data);
    return response.data.data;
  },

  updateAsset: async (id: number, data: any): Promise<Asset> => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data.data;
  },

  deleteAsset: async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}`);
  }
};
