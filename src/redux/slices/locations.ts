import { createSlice } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { LocationList } from 'src/@types/location';

// ----------------------------------------------------------------------

const initialState: LocationList = {
  isLoading: false,
  isDetailsLoading: false,
  error: null,
  locationList: [],
  locationData: {
    id: '',
    name: '',
    entityType: '',
    parentId: '',
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
  name: 'location',
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
    getLocations(state, action) {
      state.isLoading = false;
      state.locationList = action.payload;
    },
    //get user Details
    getLocationDetailsFind(state, action) {
      state.isLoading = false;
      state.isDetailsLoading = false;
      state.locationData = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { startLoading, getLocations, getLocationDetailsFind } = slice.actions;

// ----------------------------------------------------------------------

export function getLocationList(crop?: string, status?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(crop?.length && { crop: crop }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get('/locations', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getLocations(response?.data?.data));
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getLocationDetails(id?: string) {
  dispatch(slice.actions.startLoading());
  try {
    axios.get(`/locations/${id}`).then((response) => {
      if (response?.status === 200) {
        dispatch(slice.actions.getLocationDetailsFind(response?.data));
        return response.data;
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function addLocationsDetails(payload?:any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.post(`/geographic-entities`,payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function editLocationsDetails(payload?:any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.patch(`/geographic-entities/${id}`,payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// delete delete Village
export function deleteVillage(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/geographic-entities/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}