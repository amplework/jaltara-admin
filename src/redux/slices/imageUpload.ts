import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { CropList } from 'src/@types/crops';
import { ChallengesItemList } from 'src/@types/challanges';
import { imageData } from 'src/@types/image';

// ----------------------------------------------------------------------

const initialState: imageData = {
  isLoading: false,
  error: null,
};

const slice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {} = slice.actions;

// ----------------------------------------------------------------------
export function getImageUploadUrl(formData: any) {
  return async () => {
    dispatch(slice.actions.startLoading());

    try {
      const response = await axios.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response?.data;
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
