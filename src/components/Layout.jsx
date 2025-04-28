import React, { useContext, useState } from 'react';
import { Container, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSignOutAlt, 
  faVolumeUp,
  faVolumeMute,
  faUser,
  faSearch,
  faBell
} from '@fortawesome/free-solid-svg-icons';
import './Layout.css';
import { AuthContext } from './AuthContext';
import NotificationDropdown from './NotificationDropdown';
import SoundConfigModal from './SoundConfigModal';
import { soundManager } from '../utils/SoundManager';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { username, logout } = useContext(AuthContext);
  
  // Sound configuration state
  const [showSoundConfig, setShowSoundConfig] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundManager.isSoundEnabled);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar className="custom-navbar">
        <Container fluid>
          <Navbar.Brand className="h3 text-white" onClick={() => navigate('/student-dash')}>
            ORCALEX EDUCATION
          </Navbar.Brand>
          
          {/* Search Bar */}
          <div className="search-container d-none d-md-flex mx-auto">
            <div className="search-input-wrapper">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search for lessons, quizzes..." 
                className="search-input"
              />
            </div>
          </div>
          
          {/* User Section */}
          <div className="user-actions d-flex align-items-center">
            <div className="notification-wrapper">
              <FontAwesomeIcon icon={faBell} className="text-white notification-bell" />
              <span className="notification-badge">3</span>
            </div>
            
            <div className="user-profile-section d-flex align-items-center ms-3">
              <div className="student-badge" onClick={() => navigate('/profile')}>
                <FontAwesomeIcon icon={faUser} className="user-icon" />
                <span className="ms-2 d-none d-md-inline">Student</span>
              </div>
            </div>
            
            <div 
              className="sound-toggle mx-3"
              onClick={() => setShowSoundConfig(true)}
            >
              <FontAwesomeIcon 
                icon={isSoundEnabled ? faVolumeUp : faVolumeMute} 
                className="text-white"
              />
            </div>
            
            <FontAwesomeIcon 
              icon={faSignOutAlt} 
              onClick={handleLogout}  
              className="logout-icon text-white" 
              style={{ cursor: 'pointer' }} 
            />
          </div>
        </Container>
      </Navbar>

      <main className="flex-fill">
        {children}
      </main>

      <footer className="footer text-center">
        <p>&copy; ORCALEX Technologies {new Date().getFullYear()}</p>
      </footer>

      {/* Sound Configuration Modal */}
      <SoundConfigModal 
        show={showSoundConfig} 
        onHide={() => setShowSoundConfig(false)} 
      />
    </div>
  );
};

export default Layout;