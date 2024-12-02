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
  farmersDetails: {
    name: '',
    id: '',
    phone: '',
    land: '',
    familyMemberNumber: '',
    farmAvailableDate: '',
    isParticipate: false,
    language: '',
    created: '',
    modified: '',
    villageId: '',
    status: '',
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
    getFarmerUserDetails(state, action) {
      state.isLoading = false;
      state.farmersDetails = action.payload;
    },
    emptyFarmerDetails(state, action) {
      state.isLoading = false;
      state.farmersDetails = {
        name: '',
        id: '',
        phone: '',
        land: '',
        familyMemberNumber: '',
        farmAvailableDate: '',
        isParticipate: false,
        language: '',
        created: '',
        modified: '',
        villageId: '',
        status: '',
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
export const { farmerListData, getFarmerUserDetails, emptyFarmerDetails,startLoading } = slice.actions;

// ----------------------------------------------------------------------

export function getFarmerList(name?: string, village?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && { villageName: village }),
    ...(name?.length && { name: name }),
  };
  try {
    axios.get('/farmers', { params: payload }).then((response) => {
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
      return await axios.patch(`/farmers/${id}`, payload).then((res) => {
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
        dispatch(slice.actions.getFarmerUserDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// delete farmer delete 
export function deleteFarmer  (id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/farmers/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
