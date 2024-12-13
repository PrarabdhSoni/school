import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Make sure you have react-router-dom installed
import axios from 'axios';
import Loading from '../Loading/loading';

const HomePage = () => {
  const { userId } = useParams(); // Get userId from URL parameters
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          navigate('/login');
          return; // Prevent further execution
        }
  
        const response = await axios.get(`http://localhost:4000/home/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 403) {
            console.log('Access forbidden: Redirecting to login...');
            navigate('/login');
          } else {
            console.error('An error occurred:', err.response.data);
            setError('An error occurred while fetching user data.');
          }
        } else {
          console.error('An error occurred:', err);
          setError('Network error. Please try again.');
        }
      } finally {
        const TimeoutId = setTimeout(()=>{
          setLoading(false)
        }, 2000)
        return () => clearTimeout(TimeoutId);
      }
    };
    fetchUserData();
  },[userId, navigate]);

  if (loading) return <Loading/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Welcome, User {userData.userId}</h1>
      <p>Here is your personalized content:</p>
      {/* Display user-specific information */}
      <pre>{JSON.stringify(userData, null, 2)}</pre>
    </div>
  );
};

export default HomePage;
