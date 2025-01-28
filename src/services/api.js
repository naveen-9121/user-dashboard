import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
const ITEMS_PER_PAGE = 5;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchUsers = async (page = 1) => {
  try {
    const response = await api.get('/users');
    const allUsers = response.data;
    
    // Simulate server-side pagination
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const paginatedUsers = allUsers.slice(start, end);
    
    return {
      users: paginatedUsers.map(user => ({
        id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        email: user.email,
        department: user.company.name
      })),
      total: allUsers.length
    };
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const createUser = async (userData) => {
  try {
    const response = await api.post('/users', {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      company: {
        name: userData.department
      }
    });
    
    return {
      id: response.data.id,
      ...userData
    };
  } catch (error) {
    throw new Error('Failed to create user');
  }
};

export const updateUser = async (id, userData) => {
  try {
    await api.put(`/users/${id}`, {
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      company: {
        name: userData.department
      }
    });
    
    return {
      id,
      ...userData
    };
  } catch (error) {
    throw new Error('Failed to update user');
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    throw new Error('Failed to delete user');
  }
};