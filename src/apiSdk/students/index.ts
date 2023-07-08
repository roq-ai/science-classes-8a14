import axios from 'axios';
import queryString from 'query-string';
import { StudentInterface, StudentGetQueryInterface } from 'interfaces/student';
import { GetQueryInterface } from '../../interfaces';

export const getStudents = async (query?: StudentGetQueryInterface) => {
  const response = await axios.get(`/api/students${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createStudent = async (student: StudentInterface) => {
  const response = await axios.post('/api/students', student);
  return response.data;
};

export const updateStudentById = async (id: string, student: StudentInterface) => {
  const response = await axios.put(`/api/students/${id}`, student);
  return response.data;
};

export const getStudentById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/students/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteStudentById = async (id: string) => {
  const response = await axios.delete(`/api/students/${id}`);
  return response.data;
};
