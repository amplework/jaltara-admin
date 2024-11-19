import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { CropList } from 'src/@types/crops';



// ----------------------------------------------------------------------

const initialState: CropList = {
  isLoading: false,
  error: null,
  totalCrop:0,
  cropListData: [],
};

const slice = createSlice({
  name: 'crops',
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

    // GET EVENTS
    getCrops(state, action) {
      const {totalCrop ,  data} = action.payload
      state.isLoading = false;
      state.totalCrop = totalCrop;
      state.cropListData = data;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getCrops } = slice.actions;

// ----------------------------------------------------------------------

export function getCropsList(name?:string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(name?.length && {name:name}),
  }
  try {
    axios.get('/crops', {params : payload}).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getCrops(response?.data));
        return response.data;
      }else{}
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
