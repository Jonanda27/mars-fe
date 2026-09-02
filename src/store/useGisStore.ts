import { create } from 'zustand';
import { Asset } from '@/types/asset';

export type GisPanelType = 'katalog-aset' | 'detail-aset' | 'tentang';

interface PanelState {
  type: GisPanelType;
  title: string;
}

interface GisStore {
  activePanels: PanelState[];
  selectedAsset: Asset | null;
  openPanel: (type: GisPanelType, title: string) => void;
  closePanel: (type: GisPanelType) => void;
  closePanelsToTheRight: (index: number) => void;
  clearPanels: () => void;
  setSelectedAsset: (asset: Asset | null) => void;
  resetMapContext: () => void;
}

export const useGisStore = create<GisStore>((set, get) => ({
  activePanels: [],
  selectedAsset: null,

  openPanel: (type, title) => {
    set((state) => {
      // If panel already open, don't add
      if (state.activePanels.some(p => p.type === type)) {
        return state;
      }
      return {
        activePanels: [...state.activePanels, { type, title }]
      };
    });
  },

  closePanel: (type) => {
    set((state) => ({
      activePanels: state.activePanels.filter(p => p.type !== type),
      // If we close the detail panel, also clear selected asset
      selectedAsset: type === 'detail-aset' ? null : state.selectedAsset
    }));
  },

  closePanelsToTheRight: (index) => {
    set((state) => ({
      activePanels: state.activePanels.slice(0, index + 1)
    }));
  },

  clearPanels: () => {
    set({ activePanels: [], selectedAsset: null });
  },

  setSelectedAsset: (asset) => {
    set({ selectedAsset: asset });
  },

  resetMapContext: () => {
    set({ activePanels: [], selectedAsset: null });
  }
}));
