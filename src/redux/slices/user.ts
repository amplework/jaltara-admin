import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { UserList } from 'src/@types/user';

// ----------------------------------------------------------------------

const initialState: UserList = {
  isLoading: false,
  error: null,
  userListData: [],
};

const slice = createSlice({
  name: 'user',
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
    getUsers(state, action) {
      state.isLoading = false;
      state.userListData = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getUsers } = slice.actions;

// ----------------------------------------------------------------------

export function getUsersList(name?:string, village? : string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && {villageName: village}),
    ...(name?.length && {name:name}),
  }
  try {
    axios.get('/sevak-list', {params : payload}).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getUsers(response?.data?.data));
        return response.data;
      }else{}
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
