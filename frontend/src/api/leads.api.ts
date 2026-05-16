import apiClient from './axios';
import { ApiResponse, Lead, LeadFilters, LeadFormData } from '../types';

export const leadsApi = {
  getLeads: async (filters: Partial<LeadFilters>): Promise<ApiResponse<Lead[]>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
    const res = await apiClient.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLeadById: async (id: string): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: LeadFormData): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: Partial<LeadFormData>): Promise<ApiResponse<Lead>> => {
    const res = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string): Promise<ApiResponse<void>> => {
    const res = await apiClient.delete<ApiResponse<void>>(`/leads/${id}`);
    return res.data;
  },

  exportCSV: async (filters: Partial<LeadFilters>): Promise<Blob> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '' && k !== 'page' && k !== 'limit')
        params.append(k, String(v));
    });
    const res = await apiClient.get(`/leads/export?${params.toString()}`, {
      responseType: 'blob',
    });
    return res.data as Blob;
  },
};
