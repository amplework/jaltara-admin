import { createSlice } from '@reduxjs/toolkit';
// utils
import axios from '../../utils/axios';
import { dispatch } from '../store';
import { TutorialList } from 'src/@types/tutorial';

// ----------------------------------------------------------------------

const initialState: TutorialList = {
  isLoading: false,
  error: null,
  tutorialList: [],
  tutorialDetails: {
    id: '',
    subject: '',
    status: '',
    description: '',
    videos: [],
  },
};

const slice = createSlice({
  name: 'tutorial',
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

    // Set tutorial list
    setTutorialList(state, action) {
      state.isLoading = false;
      state.tutorialList = action.payload;
    },

    // Set tutorial details
    setTutorialDetails(state, action) {
      state.isLoading = false;
      state.tutorialDetails = action.payload;
    },

    // Empty tutorial details
    emptyTutorialDetails(state) {
      state.isLoading = false;
      state.tutorialDetails = {
        id: '',
        subject: '',
        status: '',
        description: '',
        videos: [],
      };
    },
  },
});

// Reducer
export default slice.reducer;
// Action
export const { startLoading, hasError, setTutorialList, setTutorialDetails, emptyTutorialDetails } =
  slice.actions;

export function getTutorialList(crop?: string, status?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(crop?.length && { crop: crop }),
    ...(status?.length && { status: status }),
  };
  try {
    axios.get('/tutorials', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.setTutorialList(response?.data?.data));
        return response?.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

// get tutorials details
export function getTutorialsDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/tutorials/${id}`).then((res) => {
        dispatch(slice.actions.setTutorialDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// get tutorials details
export function AddTutorials(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = id ? `/tutorials/${id}` : `/tutorials`;
      const method = id ? 'patch' : 'post';
      const response = await axios({ method, url, data: payload });
      return response;
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

// delete Tutorils 
export function deleteTutorial(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/tutorials/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}