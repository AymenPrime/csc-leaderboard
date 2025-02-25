import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file
import backVideo from './assests/background.mp4';

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error message
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(''); // Clear previous errors

        try {
            // Fetch the CSRF token from Django
            const csrfResponse = await axios.get('https://csc-backend-production.up.railway.app/api/csrf/');
            const csrfToken = csrfResponse.data.csrfToken;

            // Include the CSRF token in the login request
            const response = await axios.post('https://csc-backend-production.up.railway.app/api/login/', {
                name, // Use 'name' instead of 'username'
                password,
            }, {
                headers: {
                    'X-CSRFToken': csrfToken,
                },
            });

            if (response.status === 200) {
                localStorage.setItem('username', name); // Store the username in localStorage
                navigate('/leaderboard'); // Redirect to the leaderboard page
            }
        } catch (error) {
            setError('Invalid username or password'); // Set error message
        }
    };

    return (
        <div className="login-container">
            {/* Video background */}
            <video autoPlay loop muted className="video-background">
                <source src={backVideo} type="video/mp4" />
            </video>

            {/* Form container */}
            <div className="login-form">
                <h2 className="login-heading">Login</h2>

                {/* Error message */}
                {error && <p className="login-error">{error}</p>}

                <div className="login-input-group">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="login-input"
                    />
                    <button onClick={handleLogin} className="login-button">
                        Login
                    </button>
                    <button onClick={() => navigate('/')} className="login-button secondary">
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
