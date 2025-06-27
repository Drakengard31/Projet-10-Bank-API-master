import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchUserProfile = createAsyncThunk(
    'user/fetchUserProfile',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState()
            const token = auth.token

            if (!token) {
                return rejectWithValue('Token manquant')
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
                return rejectWithValue(data.message || 'Erreur lors de la récupération du profil')
            }

            return {
                firstName: data.body.firstName,
                lastName: data.body.lastName,
                username: data.body.username // Ajout du username
            }
        } catch (error) {
            return rejectWithValue('Erreur de connexion au serveur')
        }
    }
)

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (username, { getState, rejectWithValue }) => { // Ne reçoit que le username maintenant
        try {
            const { auth } = getState()
            const token = auth.token

            if (!token) {
                return rejectWithValue('Token manquant')
            }

            const response = await fetch('http://localhost:3001/api/v1/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ username }) // Envoi uniquement du username
            })

            const data = await response.json()

            if (!response.ok) {
                return rejectWithValue(data.message || 'Erreur lors de la mise à jour du profil')
            }

            return { username: data.body.username } // Retourne seulement le username mis à jour
        } catch (error) {
            return rejectWithValue('Erreur de connexion au serveur')
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        profile: null,
        isLoading: false,
        error: null,
        isEditing: false,
    },
    reducers: {
        clearUserError: (state) => {
            state.error = null
        },
        setEditingMode: (state, action) => {
            state.isEditing = action.payload
        },
        clearUserProfile: (state) => {
            state.profile = null
            state.error = null
            state.isEditing = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.profile = {
                    ...state.profile,
                    ...action.payload
                }
                state.error = null
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.profile = {
                    ...state.profile,
                    username: action.payload.username
                }
                state.error = null
                state.isEditing = false
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
    }
})

export const { clearUserError, setEditingMode, clearUserProfile } = userSlice.actions
export default userSlice.reducer