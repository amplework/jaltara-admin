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
  totalCrop: 0,
  cropListData: [],
  cropsDetails: {
    id: '',
    name: '',
    status: '',
    created: '',
    modified: '',
  },
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
      const { totalCrop, data } = action.payload;
      state.isLoading = false;
      state.totalCrop = totalCrop;
      state.cropListData = data;
    },
    // GET Details
    getCropsInfo(state, action) {
      state.isLoading = false;
      state.cropsDetails = action.payload;
    },
    // empty details
    emptyCropsDetails(state, action) {
      state.isLoading = false;
      state.cropsDetails = {
        id: '',
        name: '',
        status: '',
        created: '',
        modified: '',
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getCrops, emptyCropsDetails, getCropsInfo } = slice.actions;

// ----------------------------------------------------------------------

export function getCropsList(crop?: string, status?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(crop?.length && { crop: crop }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get('/crops', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getCrops(response?.data));
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getCropsDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/crops/${id}`).then((res) => {
        dispatch(slice.actions.getCropsInfo(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function addEditCrops(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = id ? `/crops/${id}` : `/crops`;
      const method = id ? 'patch' : 'post';
      const response = await axios({ method, url, data: payload });
      return response;
    } catch (error) {
      if (error?.response?.status === 403) {
        return error;
      }
    }
  };
}

// delete Crops 
export function deleteCrops(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/crops/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
