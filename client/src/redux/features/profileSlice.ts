import { api } from '@/utils/api';
import type { RootState } from '@redux/store';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { AddressUpdateData, ProfileUpdateData, UserProfile } from '../../types/profile';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchProfile = createAsyncThunk('profile/fetchProfile', async () => {
  const response = await api.get('/users/profile');
  return response.data;
});

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: ProfileUpdateData) => {
    const response = await api.patch('/users/profile', data);
    return response.data;
  },
);

export const addAddress = createAsyncThunk(
  'profile/addAddress',
  async (data: AddressUpdateData) => {
    const response = await api.post('/users/addresses', data);
    return response.data;
  },
);

export const updateAddress = createAsyncThunk(
  'profile/updateAddress',
  async ({ id, data }: { id: string; data: AddressUpdateData }) => {
    const response = await api.patch(`/users/addresses/${id}`, data);
    return response.data;
  },
);

export const deleteAddress = createAsyncThunk('profile/deleteAddress', async (id: string) => {
  await api.delete(`/users/addresses/${id}`);
  return id;
});

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update profile';
      })
      // Add Address
      .addCase(addAddress.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.addresses = [...state.profile.addresses, action.payload];
        }
      })
      // Update Address
      .addCase(updateAddress.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.addresses = state.profile.addresses.map((address) =>
            address.id === action.payload.id ? action.payload : address,
          );
        }
      })
      // Delete Address
      .addCase(deleteAddress.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.addresses = state.profile.addresses.filter(
            (address) => address.id !== action.payload,
          );
        }
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.profile;
export const selectProfileLoading = (state: RootState) => state.profile.loading;
export const selectProfileError = (state: RootState) => state.profile.error;

export default profileSlice.reducer;
