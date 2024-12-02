import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { CropList } from 'src/@types/crops';
import { ChallengesItemList } from 'src/@types/challanges';

// ----------------------------------------------------------------------

const initialState: ChallengesItemList = {
  isLoading: false,
  error: null,
  totalCrop: 0,
  challengesListData: [],
  challengesDetails: {
    id: '',
    status: '',
    challenge: '',
  },
};

const slice = createSlice({
  name: 'challenges',
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
    getCropsChallenges(state, action) {
      const { totalCrop, data } = action.payload;
      state.isLoading = false;
      state.totalCrop = totalCrop;
      state.challengesListData = action.payload;
    },
    // GET Details
    getCropsChallengesInfo(state, action) {
      state.isLoading = false;
      state.challengesDetails = action.payload;
    },
    // empty details
    emptyCropsChallengesDetails(state, action) {
      state.isLoading = false;
      state.challengesDetails = {
        id: '',
        status: '',
        challenge: '',
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getCropsChallenges, getCropsChallengesInfo, emptyCropsChallengesDetails } =
  slice.actions;

// ----------------------------------------------------------------------

export function getCropsChallengesList(challenge?: string, status?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(challenge?.length && { challenge: challenge }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get('/farmers-challenges', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getCropsChallenges(response?.data?.data));
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getCropsChallangesDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/farmers-challenges/${id}`).then((res) => {
        dispatch(slice.actions.getCropsChallengesInfo(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function addEditCropsChallenges(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = id ? `/farmers-challenges/${id}` : `/farmers-challenges`;
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
export function deleteCropsChallanges(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/farmers-challenges/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
