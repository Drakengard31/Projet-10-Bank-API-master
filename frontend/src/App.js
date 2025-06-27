import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './App.css'

// Redux actions
import { loginUser, logoutUser, checkAuthStatus, clearError } from './slices/authSlice'
import { fetchUserProfile, updateUserProfile, setEditingMode, clearUserError, clearUserProfile } from './slices/userSlice'

// Components
const Header = ({ user, onLogout, isAuthenticated }) => (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <h1>ArgentBank</h1>
        </div>
        <nav className="main-nav">
          {isAuthenticated && user ? (
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
)

const HomePage = ({ onSignIn }) => (
    <main className="main">
      <div className="hero">
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
          <img src="/img/icon-chat.png" alt="Chat Icon" className="feature-icon" />
          <h3 className="feature-item-title">You are our #1 priority</h3>
          <p>
            Need to talk to a representative? You can get in touch through our
            24/7 chat or through a phone call in less than 5 minutes.
          </p>
        </div>
        <div className="feature-item">
          <img src="/img/icon-money.png" alt="Money Icon" className="feature-icon" />
          <h3 className="feature-item-title">More savings means higher rates</h3>
          <p>
            The more you save with us, the higher your interest rate will be!
          </p>
        </div>
        <div className="feature-item">
          <img src="/img/icon-security.png" alt="Security Icon" className="feature-icon" />
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
)

const SignInPage = ({ onSignIn, loading, error, onClearError }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    rememberMe: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignIn({
      email: formData.email,
      password: formData.password
    })
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  React.useEffect(() => {
    return () => {
      if (error) {
        onClearError()
      }
    }
  }, [error, onClearError])

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
  )
}

const UserProfile = ({
                       user,
                       onUpdateProfile,
                       isEditing,
                       setIsEditing,
                       loading,
                       error,
                       onClearError
                     }) => {
  const [profileData, setProfileData] = React.useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  })

  React.useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      })
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onUpdateProfile(profileData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!user && loading) return <div className="main bg-dark">Chargement...</div>
  if (!user) return <div className="main bg-dark">Erreur: Utilisateur introuvable</div>

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
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleChange}
                        placeholder="Nom"
                        required
                    />
                  </div>
                  {error && <div className="error-message">{error}</div>}
                  <div className="edit-buttons">
                    <button type="submit" className="save-button" disabled={loading}>
                      {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                    </button>
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={() => {
                          setIsEditing(false)
                          if (error) onClearError()
                        }}
                    >
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
  )
}

const Footer = () => (
    <footer className="footer">
      <p className="footer-text">Copyright 2020 Argent Bank</p>
    </footer>
)

function App() {
  const dispatch = useDispatch()

  // Redux state
  const { token, isAuthenticated, isLoading: authLoading, error: authError } = useSelector(state => state.auth)
  const { profile, isLoading: userLoading, error: userError, isEditing } = useSelector(state => state.user)

  // Local state pour la navigation
  const [currentPage, setCurrentPage] = React.useState('home')

  // Vérifier l'authentification au chargement
  useEffect(() => {
    if (token) {
      dispatch(checkAuthStatus())
    }
  }, [dispatch, token])

  // Récupérer le profil utilisateur après connexion réussie
  useEffect(() => {
    if (isAuthenticated && token && !profile) {
      dispatch(fetchUserProfile())
    }
  }, [dispatch, isAuthenticated, token, profile])

  // Rediriger vers le profil après connexion réussie
  useEffect(() => {
    if (isAuthenticated && profile) {
      setCurrentPage('profile')
    }
  }, [isAuthenticated, profile])

  // Gestion de la navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'signin' && !isAuthenticated) {
        setCurrentPage('signin')
      } else if (hash === 'profile' && isAuthenticated) {
        setCurrentPage('profile')
      } else if (hash === 'home' || hash === '') {
        setCurrentPage('home')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [isAuthenticated])

  // Handlers
  const handleSignIn = (credentials) => {
    dispatch(loginUser(credentials))
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    dispatch(clearUserProfile())
    setCurrentPage('home')
    window.location.hash = ''
  }

  const handleUpdateProfile = (profileData) => {
    dispatch(updateUserProfile(profileData))
  }

  const handleSetEditingMode = (editing) => {
    dispatch(setEditingMode(editing))
  }

  const handleClearAuthError = () => {
    dispatch(clearError())
  }

  const handleClearUserError = () => {
    dispatch(clearUserError())
  }

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'signin':
        return (
            <SignInPage
                onSignIn={handleSignIn}
                loading={authLoading}
                error={authError}
                onClearError={handleClearAuthError}
            />
        )
      case 'profile':
        return (
            <UserProfile
                user={profile}
                onUpdateProfile={handleUpdateProfile}
                isEditing={isEditing}
                setIsEditing={handleSetEditingMode}
                loading={userLoading}
                error={userError}
                onClearError={handleClearUserError}
            />
        )
      default:
        return <HomePage onSignIn={() => setCurrentPage('signin')} />
    }
  }

  return (
      <div className="App">
        <Header
            user={profile}
            onLogout={handleLogout}
            isAuthenticated={isAuthenticated}
        />
        {renderCurrentPage()}
        <Footer />
      </div>
  )
}

export default App