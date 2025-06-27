import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Actions asynchrones
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:3001/api/v1/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            })

            const data = await response.json()

            if (!response.ok) {
                return rejectWithValue(data.message || 'Erreur de connexion')
            }

            // Stocker le token
            localStorage.setItem('token', data.body.token)

            return data.body
        } catch (error) {
            return rejectWithValue('Erreur de connexion au serveur')
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { dispatch }) => {
        localStorage.removeItem('token')
        dispatch(clearUser())
        return null
    }
)

export const checkAuthStatus = createAsyncThunk(
    'auth/checkAuthStatus',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                return rejectWithValue('Aucun token trouvé')
            }

            const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })

            const data = await response.json()

            if (!response.ok) {
                localStorage.removeItem('token')
                return rejectWithValue('Token invalide')
            }

            return { token, user: data.body }
        } catch (error) {
            localStorage.removeItem('token')
            return rejectWithValue('Erreur de vérification du token')
        }
    }
)

// Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token'),
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
        clearUser: (state) => {
            state.token = null
            state.isAuthenticated = false
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.token = action.payload.token
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
                state.isAuthenticated = false
                state.token = null
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null
                state.isAuthenticated = false
                state.error = null
            })
            // Check auth status
            .addCase(checkAuthStatus.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                state.isLoading = false
                state.token = action.payload.token
                state.isAuthenticated = true
                state.error = null
            })
            .addCase(checkAuthStatus.rejected, (state) => {
                state.isLoading = false
                state.token = null
                state.isAuthenticated = false
            })
    },
})

export const { clearError, clearUser } = authSlice.actions
export default authSlice.reducer