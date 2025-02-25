import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import backVideo from './assests/background.mp4'

function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [picture, setPicture] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);
        formData.append('picture', picture);
        formData.append('verification_code', verificationCode);

        try {
            const response = await axios.post('https://csc-backend-production.up.railway.app/api/register/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/login');
        } catch (error) {
            alert('Registration failed!');
        }
    };

    return (
        <div className="register-container">
            {/* Video background */}
            <video autoPlay loop muted className="video-background">
                <source src={backVideo} type="video/mp4" />
            </video>
            {/* Form container */}
            <div className="register-form">
                <h2 className="register-heading">Register</h2>
                <div className="register-input-group">
                <h4>Select A Beautiful Picture of You!</h4>
                <input
                    type="file"
                    onChange={(e) => setPicture(e.target.files[0])}
                    className="register-input"
                />
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="register-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="register-input"
                    />
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="register-input"
                    />
                    <button onClick={handleRegister} className="register-button">
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Register;