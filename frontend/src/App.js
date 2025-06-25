import React, { useState, useEffect } from 'react';
import bankTree from './assets/img/bank-tree.jpeg';
import iconChat from './assets/img/icon-chat.png';
import iconMoney from './assets/img/icon-money.png';
import iconSecurity from './assets/img/icon-security.png';
import './App.css';

// Composants
const Header = ({ user, onLogout }) => (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>ArgentBank</h1>
        </div>
        <nav className="main-nav">
          {user ? (
              <div className="nav-user">
                <span className="user-name">Bonjour, {user.firstName}</span>
                <button className="logout-btn" onClick={onLogout}>
                  Déconnexion
                </button>
              </div>
          ) : (
              <div className="nav-links">
                <a href="#signin" className="main-nav-item">
                  <i className="fa fa-user-circle"></i>
                  Se connecter
                </a>
              </div>
          )}
        </nav>
      </div>
    </header>
);


const HomePage = ({ onSignIn }) => (
    <main className="main">
      <div className="hero" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `url(${bankTree}) center/cover`,
          opacity: 0.3,
          zIndex: 1
        }} />
        <section className="hero-content">
          <h2 className="sr-only">Promoted Content</h2>
          <p className="subtitle">No fees.</p>
          <p className="subtitle">No minimum deposit.</p>
          <p className="subtitle">High interest rates.</p>
          <p className="text">Open a savings account with Argent Bank today!</p>
        </section>
      </div>
      <section className="features">
        <h2 className="sr-only">Features</h2>
        <div className="feature-item">
          <img src={iconChat} alt="Chat Icon" className="feature-icon" />
          <h3 className="feature-item-title">You are our #1 priority</h3>
          <p>
            Need to talk to a representative? You can get in touch through our
            24/7 chat or through a phone call in less than 5 minutes.
          </p>
        </div>
        <div className="feature-item">
          <img src={iconMoney} alt="Money Icon" className="feature-icon" />
          <h3 className="feature-item-title">More savings means higher rates</h3>
          <p>
            The more you save with us, the higher your interest rate will be!
          </p>
        </div>
        <div className="feature-item">
          <img src={iconSecurity} alt="Security Icon" className="feature-icon" />
          <h3 className="feature-item-title">Security you can trust</h3>
          <p>
            We use top of the line encryption to make sure your data and money
            is always safe.
          </p>
        </div>
      </section>
      <div className="cta-section">
        <button className="cta-button" onClick={onSignIn}>
          Commencer maintenant
        </button>
      </div>
    </main>
);

const SignInPage = ({ onSignIn, loading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(formData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
      <main className="main bg-dark">
        <section className="sign-in-content">
          <i className="fa fa-user-circle sign-in-icon"></i>
          <h1>Se connecter</h1>
          <form onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">Nom d'utilisateur</label>
              <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Mot de passe</label>
              <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
              />
            </div>
            <div className="input-remember">
              <input
                  type="checkbox"
                  id="remember-me"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
              />
              <label htmlFor="remember-me">Se souvenir de moi</label>
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="sign-in-button" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </section>
      </main>
  );
};

const UserProfile = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile(profileData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) return <div>Chargement...</div>;

  return (
      <main className="main bg-dark">
        <div className="header">
          <h1>
            Bienvenue<br />
            {isEditing ? (
                <form onSubmit={handleSubmit} className="edit-form">
                  <div className="edit-inputs">
                    <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleChange}
                        placeholder="Prénom"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        placeholder="Nom"
                    />
                  </div>
                  <div className="edit-buttons">
                    <button type="submit" className="save-button">Sauvegarder</button>
                    <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
                      Annuler
                    </button>
                  </div>
                </form>
            ) : (
                <>
                  {user.firstName} {user.lastName}!
                  <button className="edit-button" onClick={() => setIsEditing(true)}>
                    Modifier le nom
                  </button>
                </>
            )}
          </h1>
        </div>

        <h2 className="sr-only">Comptes</h2>

        {/* Comptes bancaires */}
        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Checking (x8349)</h3>
            <p className="account-amount">$2,082.79</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Savings (x6712)</h3>
            <p className="account-amount">$10,928.42</p>
            <p className="account-amount-description">Available Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>

        <section className="account">
          <div className="account-content-wrapper">
            <h3 className="account-title">Argent Bank Credit Card (x8349)</h3>
            <p className="account-amount">$184.30</p>
            <p className="account-amount-description">Current Balance</p>
          </div>
          <div className="account-content-wrapper cta">
            <button className="transaction-button">View transactions</button>
          </div>
        </section>
      </main>
  );
};

const Footer = () => (
    <footer className="footer">
      <p className="footer-text">Copyright 2020 Argent Bank</p>
    </footer>
);

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Vérifier si l'utilisateur est connecté au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Récupérer les informations utilisateur
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.body);
        setCurrentPage('profile');
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      localStorage.removeItem('token');
    }
  };

  const handleSignIn = async (formData) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.body.token);
        await fetchUserProfile(data.body.token);
      } else {
        setError(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setCurrentPage('home');
  };

  const handleUpdateProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/v1/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.body);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'signin':
        return <SignInPage onSignIn={handleSignIn} loading={loading} error={error} />;
      case 'profile':
        return <UserProfile user={user} onUpdateProfile={handleUpdateProfile} />;
      default:
        return <HomePage onSignIn={() => setCurrentPage('signin')} />;
    }
  };

  // Navigation listener
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'signin' && !user) {
        setCurrentPage('signin');
      } else if (hash === 'profile' && user) {
        setCurrentPage('profile');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  return (
      <div className="App">
        <Header user={user} onLogout={handleLogout} />
        {renderCurrentPage()}
        <Footer />
      </div>
  );
}

export default App;