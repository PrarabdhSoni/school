import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before new request

    try {
      const response = await axios.post('http://localhost:4000/login', { username, password });

      
      if (response.status === 200 && response.data.token) {
        // Save token to localStorage
        localStorage.setItem('token', response.data.token);
        // const user_id = response.data.user_id;
        const { userId, message } = response.data;
        console.log(message)
        // Navigate to home page
        navigate(`/home/${userId}`);
      } else {
        console.error('Token not received from server');
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Error logging in', error);
      setError('Login failed. Please check your credentials or verify your account first');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      </form>
    </div>
  );
};

export default LoginPage;
