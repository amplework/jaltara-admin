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
  pitListData: [],
  pitsDetails: {
    id: '',
    photo: '',
    gpsLocation: '',
    plotSize: '',
    stageName: '',
    level: '',
    created: '',
    modified: '',
    farmerId: '',
    villageId: '',
    farmer: {
      name: '',
      id: '',
      photo: '',
    },
    stages: [],
    village: {
      id: '',
      name: '',
      entityType: '',
      parentId: '',
    },
    checkUpperGeo: {
      id: '',
      name: '',
      entityType: '',
      parentId: '',
      parents: [],
    },
  },
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
    getPitsListing(state, action) {
      state.isLoading = false;
      state.pitListData = action.payload;
    },
    // pits Details
    getPitsUserDetails(state, action) {
      state.isLoading = false;
      state.pitsDetails = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getPitsListing,startLoading } = slice.actions;

// ----------------------------------------------------------------------

export function getPitsList(name?: string, village?: string, statgesSearch?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && { villageName: village }),
    ...(name?.length && { name: name }),
    ...(statgesSearch?.length && { stageName: statgesSearch }),
  };
  try {
    axios.get('/pits', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getPitsListing(response?.data?.data));
        return response.data;
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getPitDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/pits/${id}`).then((res) => {
        dispatch(slice.actions.getPitsUserDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// delete pits
export function deletePits(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/pits/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
