import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { EquipmentList } from 'src/@types/equipment';



// ----------------------------------------------------------------------

const initialState: EquipmentList = {
  isLoading: false,
  error: null,
  equipmentListData: [],
};

const slice = createSlice({
  name: 'equipments',
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
    getEquipments(state, action) {
      const {data} = action.payload
      state.isLoading = false;
      state.equipmentListData = data;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getEquipments } = slice.actions;

// ----------------------------------------------------------------------

export function getEquipmentsList(name?:string,equipment?:string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(name?.length && {name:name}),
    ...(equipment?.length && {equipment:equipment}),
  }
  try {
    axios.get('/equipment', {params : payload}).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getEquipments(response?.data));
        return response.data;
      }else{}
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
