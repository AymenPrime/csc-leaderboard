import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Leaderboard.css';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState('');
    const [pointsToAdd, setPointsToAdd] = useState(0);
    const [showInfo, setShowInfo] = useState(false); // State to control info pop-up visibility
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('username');
        if (!loggedInUser) {
            navigate('/login', { replace: true }); // Redirect to login if not authenticated
        } else {
            axios.get('https://csc-backend-production.up.railway.app/api/leaderboard/')
                .then(response => {
                    setUsers(response.data);
                })
                .catch(error => {
                    console.error('Error fetching leaderboard data:', error);
                });

            if (loggedInUser === 'cscadmin') {
                setIsAdmin(true);
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('username'); // Clear the username from localStorage
        navigate('/login', { replace: true }); // Redirect to the login page and replace history
        window.history.replaceState(null, '', '/login'); // Replace history entry
        window.location.reload(); // Force reload to clear cached data
    };

    const handleAddPoints = async () => {
        try {
            const response = await axios.post(`https://csc-backend-production.up.railway.app/api/update-points/${selectedUser}/`, {
                points: pointsToAdd,
            });
            if (response.status === 200) {
                const updatedResponse = await axios.get('https://csc-backend-production.up.railway.app/api/leaderboard/');
                setUsers(updatedResponse.data);
                setShowForm(false);
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            try {
                const response = await axios.delete(`https://csc-backend-production.up.railway.app/api/delete-user/${userId}/`);
                if (response.status === 200) {
                    const updatedResponse = await axios.get('https://csc-backend-production.up.railway.app/api/leaderboard/');
                    setUsers(updatedResponse.data);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    return (
        <div className="leaderboard-container">
            {/* Background animation */}
            <div className="background-animation"></div>

            {/* Logout button */}
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            {/* Dark overlay */}
            {showInfo && <div className="overlay" onClick={() => setShowInfo(false)}></div>}

            {/* Info pop-up */}
            {showInfo && (
                <div className="info-popup">
                    <h2>How to Earn Points</h2>
                    <ul>
                        <li>🎉 Attend events: <strong>+20 points</strong></li>
                        <div className="section-divider"></div>
                        <li>💡 Submit an idea: <strong>+50 points</strong></li>
                        <div className="section-divider"></div>
                        <li>🏆 Top 3 at the end of the year win prizes!</li>
                        <div className="section-divider"></div>
                        <li>🎓 Top 10 qualify for the annual conference.</li>
                    </ul>
                    <button className="close-button" onClick={() => setShowInfo(false)}>
                        Close
                    </button>
                </div>
            )}

            {/* Leaderboard content */}
            <div className="leaderboard-content">
                <div className="leaderboard-main">
                    {/* Title and info icon container */}
                    <div className="title-container">
                        <h1 className="leaderboard-title">Leaderboard</h1>
                        <div className="info-icon" onClick={() => setShowInfo(true)}>
                            ℹ️
                        </div>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="add-points-button"
                        >
                            Add Points
                        </button>
                    )}
                    {showForm && (
                        <div className="points-form">
                            <h3>Add Points</h3>
                            <select
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                                className="form-select"
                            >
                                <option value="">Select a user</option>
                                {users.map(user => (
                                    <option key={user.id} value={user.id}>{user.name}</option>
                                ))}
                            </select>
                            <br />
                            <input
                                type="number"
                                placeholder="Points to add"
                                value={pointsToAdd}
                                onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
                                className="form-input"
                            />
                            <br />
                            <button
                                onClick={handleAddPoints}
                                className="form-button"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setShowForm(false)}
                                className="form-button cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                    <div className="leaderboard-grid">
                        {users.map((user, index) => (
                            <div key={user.id} className="user-card">
                                {isAdmin && (
                                    <button
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="delete-button"
                                    >
                                        X
                                    </button>
                                )}
                                {/* Rank number for users below top 3 */}
                                {index >= 3 && (
                                    <div className="rank-number">
                                        #{index + 1}
                                    </div>
                                )}
                                {/* Crown for 1st place */}
                                {index === 0 && <div className="crown-icon">👑</div>}
                                {/* Medal for 2nd place */}
                                {index === 1 && <div className="medal-icon silver">🥈</div>}
                                {/* Medal for 3rd place */}
                                {index === 2 && <div className="medal-icon bronze">🥉</div>}
                                <img
                                    src={`https://csc-backend-production.up.railway.app${user.picture}`}
                                    alt={user.name}
                                    className="user-image"
                                />
                                <h3 className="user-name">{user.name}</h3>
                                <p className="user-points"><span className='points'>{user.points}</span> Points</p>
                                {index < 10 && (
                                    <p className="qualified-text">🏆 Qualified for the Conference</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info section for laptops and large screens */}
                <div className="info-section">
                    <h2>How to Earn Points</h2>
                    <ul>
                        <li>🎉 Attend events: <strong>+20 points</strong></li>
                        <div className="section-divider"></div>
                        <li>💡 Submit an idea: <strong>+50 points</strong></li>
                        <div className="section-divider"></div>
                        <li>🏆 Top 3 at the end of the year win prizes!</li>
                        <div className="section-divider"></div>
                        <li>🎓 Top 10 qualify for the annual conference.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;