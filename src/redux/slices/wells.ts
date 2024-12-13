import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { dispatch } from '../store';
import { WellsData } from 'src/@types/wells';

// ----------------------------------------------------------------------

const initialState: WellsData = {
  isLoading: false,
  error: null,
  wellsListData: [],
  wellsDetails: {
    id: '',
    photo: '',
    gpsLocation: '',
    level: '',
    description: '',
    villageId: '',
    plotSize: '',
    village: {
      id: '',
      name: '',
    },
    checkUpperGeo: {
      id: '',
      name: '',
      entityType: '',
      parentId: '',
      parents: [],
    },
    stages: [
      {
        id: '',
        wellId: '',
        created: '',
        updatedBy: '',
        updatedbySevek: {
          id: '',
          name: '',
        },
      },
    ],
  },
};

const slice = createSlice({
  name: 'wells',
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
    getWellsListing(state, action) {
      state.isLoading = false;
      state.wellsListData = action.payload;
    },

    // wells Details
    getWellsUserDetails(state, action) {
      state.isLoading = false;
      state.wellsDetails = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getWellsUserDetails, startLoading } = slice.actions;

// ----------------------------------------------------------------------

export function getWillsList(name?: string, village?: string) {
  dispatch(slice.actions.startLoading());

  let payload = {
    ...(village?.length && { villageName: village }),
    ...(name?.length && { sevakName: name }),
  };
  try {
    axios.get('/wells', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getWellsListing(response?.data?.data));
        return response.data;
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getWellsDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/wells/${id}`).then((res) => {
        dispatch(slice.actions.getWellsUserDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// delete wells
export function deleteWells(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/wells/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
