import apiClient from './axios';
import { ApiResponse, LoginCredentials, RegisterCredentials, User } from '../types';

interface AuthResponseData {
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: RegisterCredentials): Promise<ApiResponse<AuthResponseData>> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginCredentials): Promise<ApiResponse<AuthResponseData>> => {
    const res = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await apiClient.get<ApiResponse<User>>('/auth/me');
    return res.data;
  },
};
