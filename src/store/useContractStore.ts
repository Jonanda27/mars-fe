import { create } from 'zustand';
import { contractService } from '../services/contractService';
import { Contract } from '../types/contract';

interface ContractState {
  contracts: Contract[];
  tenantContracts: Contract[];
  currentContract: Contract | null;
  isLoading: boolean;
  error: string | null;
  fetchContracts: () => Promise<void>;
  fetchContractById: (id: number) => Promise<void>;
  updateContract: (id: number, data: Partial<Contract>) => Promise<void>;
  fetchTenantContracts: () => Promise<void>;
  fetchTenantContractById: (id: number) => Promise<void>;
  updateTenantContractStatus: (id: number, status: string, signature?: string) => Promise<void>;
  extendContract: (id: number, durationMonths: number) => Promise<void>;
}

export const useContractStore = create<ContractState>((set, get) => ({
  contracts: [],
  tenantContracts: [],
  currentContract: null,
  isLoading: false,
  error: null,

  fetchContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await contractService.getContracts();
      set({ contracts: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch contracts', isLoading: false });
    }
  },

  fetchContractById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await contractService.getContractById(id);
      set({ currentContract: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch contract details', isLoading: false });
    }
  },

  updateContract: async (id: number, data: Partial<Contract>) => {
    set({ isLoading: true, error: null });
    try {
      const updatedContract = await contractService.updateContract(id, data);
      const { contracts, currentContract } = get();
      set({
        contracts: contracts.map(c => c.id === id ? updatedContract : c),
        currentContract: currentContract?.id === id ? updatedContract : currentContract,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update contract', isLoading: false });
      throw err;
    }
  },

  fetchTenantContracts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await contractService.getTenantContracts();
      set({ tenantContracts: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant contracts', isLoading: false });
    }
  },

  fetchTenantContractById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await contractService.getTenantContractById(id);
      set({ currentContract: data, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tenant contract details', isLoading: false });
    }
  },

  updateTenantContractStatus: async (id: number, status: string, signature?: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedContract = await contractService.updateTenantContractStatus(id, { status, tenant_signature: signature });
      const { tenantContracts, currentContract } = get();
      set({
        tenantContracts: tenantContracts.map(c => c.id === id ? updatedContract : c),
        currentContract: currentContract?.id === id ? updatedContract : currentContract,
        isLoading: false
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to update tenant contract status', isLoading: false });
      throw err;
    }
  },

  extendContract: async (id: number, durationMonths: number) => {
    set({ isLoading: true, error: null });
    try {
      await contractService.extendContract(id, durationMonths);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to extend contract', isLoading: false });
      throw err;
    }
  }
}));
