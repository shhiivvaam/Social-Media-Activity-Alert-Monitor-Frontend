import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
});

export const getAccounts = async () => (await api.get('/accounts')).data;
export const addAccount = async (username: string, platform: string) => (await api.post('/accounts', { username, platform })).data;
export const getGroups = async (platform: string) => (await api.get(`/groups?platform=${platform}`)).data;
export const addGroup = async (name: string, platform: string, groupId: string) => (await api.post('/groups', { name, platform, groupId })).data;
export const getWhatsAppGroups = async () => (await api.get('/whatsapp/groups')).data;

export default api;
