const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001/api/v1/user';

const users = [
  {
    firstName: 'Tony',
    lastName: 'Stark',
    email: 'tony@stark.com',
    password: 'password123',
    userName: 'ironman'
  },
  {
    firstName: 'Steve',
    lastName: 'Rogers',
    email: 'steve@rogers.com',
    password: 'password456',
    userName: 'captain'
  }
];

const populate = async () => {
  try {
    for (const user of users) {
      const response = await axios.post(`${API_BASE_URL}/signup`, user);
      console.log(`User ${user.userName} created:`, response.data);
    }
    console.log('Database populated successfully!');
  } catch (error) {
    console.error('Error populating database:', error.response?.data || error.message);
  }
};

populate();