import axios from 'axios';
import queryString from 'query-string';
import { ParentInterface, ParentGetQueryInterface } from 'interfaces/parent';
import { GetQueryInterface } from '../../interfaces';

export const getParents = async (query?: ParentGetQueryInterface) => {
  const response = await axios.get(`/api/parents${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createParent = async (parent: ParentInterface) => {
  const response = await axios.post('/api/parents', parent);
  return response.data;
};

export const updateParentById = async (id: string, parent: ParentInterface) => {
  const response = await axios.put(`/api/parents/${id}`, parent);
  return response.data;
};

export const getParentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/parents/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteParentById = async (id: string) => {
  const response = await axios.delete(`/api/parents/${id}`);
  return response.data;
};
