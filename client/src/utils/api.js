import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const updateScore = async (userId, score) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/update-score`, { userId, score });
    return response.data;
  } catch (error) {
    console.error('Error updating score:', error);
    throw error;
  }
};

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/leaderboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
};