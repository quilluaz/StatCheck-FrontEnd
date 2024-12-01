const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token;
    localStorage.setItem('token', token);
    console.log('Token stored:', token);
    return response.data;
  } catch (error) {
    throw error;
  }
}; 