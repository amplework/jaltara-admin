import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { PitList } from 'src/@types/pits';

// ----------------------------------------------------------------------

const initialState: PitList = {
  isLoading: false,
  error: null,
  totalDugPit:0,
  totalCompletePit:0,
  pitListData: [],
};

const slice = createSlice({
  name: 'pits',
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
    getPits(state, action) {
      const {totalDugPit ,totalCompletePit,  data} = action.payload
      state.isLoading = false;
      state.totalDugPit = totalDugPit;
      state.totalCompletePit = totalCompletePit;
      state.pitListData = data;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getPits } = slice.actions;

// ----------------------------------------------------------------------

export function getPitsList(name?:string, village? : string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && {villageName: village}),
    ...(name?.length && {name:name}),
  }
  try {
    axios.get('/sevak-pits', {params : payload}).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getPits(response?.data));
        return response.data;
      }else{}
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
