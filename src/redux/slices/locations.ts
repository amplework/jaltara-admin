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
  villageList: [],
  districtLoactionList: [],
  talukLocationList: [],
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
    // GET village list
    getVillageLocations(state, action) {
      state.isLoading = false;
      state.villageList = action.payload;
    },
    //get user Details
    getLocationDetailsFind(state, action) {
      state.isLoading = false;
      state.isDetailsLoading = false;
      state.locationData = action.payload;
    },
    // GET district list
    getDistrictLocations(state, action) {
      state.isLoading = false;
      state.districtLoactionList = action.payload;
    },
    // get taluk list
    getTalukLocations(state, action) {
      state.isLoading = false;
      state.talukLocationList = action.payload;
    },
    // get taluk list
    getVillageLocationsListing(state, action) {
      state.isLoading = false;
      state.villageList = action.payload;
    },
    // empty location details
    setEmptyLocationData(state, action) {
      state.locationData = {
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
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  startLoading,
  getLocations,
  getLocationDetailsFind,
  getDistrictLocations,
  getTalukLocations,
  setEmptyLocationData
} = slice.actions;

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

export function addLocationsDetails(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.post(`/geographic-entities`, payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function editLocationsDetails(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    console.log('111111111111111');

    try {
      console.log('2222222222222222', payload);

      return await axios.patch(`/geographic-entities/${id}`, payload).then((res) => {
        console.log('res', res);

        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        console.log('33333333333');

        console.log('error', error);

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

//village locations list
export function getVillageLocationList(crop?: string, status?: string, entityType?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(crop?.length && { crop: crop }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get(`/locations?entityType=${entityType}`, { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        if (entityType === 'state') {
          dispatch(slice.actions.getVillageLocations(response?.data?.data));
        } else if (entityType === 'district') {
          dispatch(slice.actions.getDistrictLocations(response?.data?.data));
        } else if (entityType === 'taluk') {
          dispatch(slice.actions.getTalukLocations(response?.data?.data));
        } else if (entityType === 'village') {
          dispatch(slice.actions.getLocations(response?.data?.data));
        }
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getVillageListing(crop?: string, status?: string, entityType?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(crop?.length && { crop: crop }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get(`/state`, { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getVillageLocationsListing(response?.data?.data));

        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
