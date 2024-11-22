import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { CildEntitiesType, UserList } from 'src/@types/user';
import { FarmerList } from 'src/@types/farmer';

// ----------------------------------------------------------------------

const initialState: FarmerList = {
  isLoading: false,
  error: null,
  farmerListData: [],
  // farmersDetails:{
  //   id: '',
  //   name: '',
  //   phone: '',
  //   status: '',
  //   language: '',
  //   created: '',
  //   modified: '',
  //   villageId: '',
  //   checkUpperGeo: {
  //     id: '',
  //     name: '',
  //     entityType: '',
  //     parentId: '',
  //     parents: [],
  //   },
  // }
};

const slice = createSlice({
  name: 'farmer',
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

    // farmers list
    farmerListData(state, action) {
      state.isLoading = false;
      state.farmerListData = action.payload;
    },
    // farmer Details
    getUserDetails(state, action) {
      state.isLoading = false;
      // state.usersDetails = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { farmerListData } = slice.actions;

// ----------------------------------------------------------------------

export function getFarmerList(name?: string, village?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && { villageName: village }),
    ...(name?.length && { name: name }),
  };
  try {
    axios.get('/farmers', { params: payload }).then((response) => {
      console.log('response', response);

      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.farmerListData(response?.data?.data));
        return response.data;
      } 
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function addNewFarmer(payload?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.post(`/farmers`, payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function editNewFarmer(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.patch(`/farmers-update/${id}`, payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function getFarmerDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/farmers/${id}`).then((res) => {
        dispatch(slice.actions.getUserDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
