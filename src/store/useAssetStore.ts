import { create } from 'zustand';
import { assetService } from '../services/assetService';
import { Asset } from '../types/asset';

interface AssetState {
  assets: Asset[];
  currentAsset: Asset | null;
  isLoading: boolean;
  error: string | null;
  fetchAssets: () => Promise<void>;
  fetchAssetById: (id: number) => Promise<void>;
  createAsset: (data: any) => Promise<void>;
  updateAsset: (id: number, data: any) => Promise<void>;
  deleteAsset: (id: number) => Promise<void>;
}

export const useAssetStore = create<AssetState>((set, get) => ({
  assets: [],
  currentAsset: null,
  isLoading: false,
  error: null,

  fetchAssets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await assetService.getAssets();
      set({ assets: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch assets', isLoading: false });
    }
  },

  fetchAssetById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await assetService.getAssetById(id);
      set({ currentAsset: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch asset details', isLoading: false });
    }
  },

  createAsset: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const newAsset = await assetService.createAsset(data);
      set((state) => ({
        assets: [newAsset, ...state.assets],
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to create asset', isLoading: false });
      throw err;
    }
  },

  updateAsset: async (id: number, data: any) => {
    set({ isLoading: true, error: null });
    try {
      const updatedAsset = await assetService.updateAsset(id, data);
      const { assets, currentAsset } = get();
      set({
        assets: assets.map(a => a.id === id ? updatedAsset : a),
        currentAsset: currentAsset?.id === id ? updatedAsset : currentAsset,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update asset', isLoading: false });
      throw err;
    }
  },

  deleteAsset: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await assetService.deleteAsset(id);
      set((state) => ({
        assets: state.assets.filter(a => a.id !== id),
        currentAsset: state.currentAsset?.id === id ? null : state.currentAsset,
        isLoading: false
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to delete asset', isLoading: false });
      throw err;
    }
  }
}));
