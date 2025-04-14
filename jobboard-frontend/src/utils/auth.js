export const getUserRole = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
      // Decoding the token to get the payload
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role;  // Make sure 'role' exists in the token
  } catch (e) {
      console.error("Error decoding token", e);
      return null;
  }
};
