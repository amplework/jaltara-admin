import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { CildEntitiesType, UserList } from 'src/@types/user';

// ----------------------------------------------------------------------

const initialState: UserList = {
  isLoading: false,
  error: null,
  userListData: [],
  statesList: [],
  districtList: {
    mainEntity: {
      id: '',
      name: '',
      entityType: '',
    },
    childEntities: [],
  },
  talukList: {
    mainEntity: {
      id: '',
      name: '',
      entityType: '',
      parentId: '',
    },
    childEntities: [],
  },
  villageList: {
    mainEntity: {
      id: '',
      name: '',
      entityType: '',
      parentId: '',
    },
    childEntities: [],
  },
  usersDetails: {
    id: '',
    name: '',
    phone: '',
    status: '',
    language: '',
    location: {
      lat: 0,
      lng: 0,
    },
    created: '',
    modified: '',
    villageId: '',
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
    //set states
    setStatesList(state, action) {
      state.isLoading = false;
      state.statesList = action.payload;
    },
    //set district
    setDistrictList(state, action) {
      state.isLoading = false;
      console.log('action.payload', action.payload);

      const { childEntities, mainEntity } = action.payload;
      state.districtList.mainEntity = mainEntity;
      state.districtList.childEntities = childEntities;
    },
    //set taluk
    setTalukList(state, action) {
      state.isLoading = false;
      const { childEntities, mainEntity } = action.payload;
      state.talukList.mainEntity = mainEntity;
      state.talukList.childEntities = childEntities;
    },
    //set village
    setVillageList(state, action) {
      state.isLoading = false;
      const { childEntities, mainEntity } = action.payload;
      state.villageList.mainEntity = mainEntity;
      state.villageList.childEntities = childEntities;
    },
    //get user Details
    getUserDetails(state, action) {
      state.isLoading = false;
      state.usersDetails = action.payload;
    },
    //empty village list
    emptyVillageList(state, action) {
      state.isLoading = false;
      state.villageList.mainEntity = {} as CildEntitiesType;
      state.villageList.childEntities = [];
    },
    // empty user details
    emptyUserDetails(state, action) {
      state.isLoading = false;
      state.usersDetails = {
        id: '',
        name: '',
        phone: '',
        status: '',
        language: '',
        location: {
          lat: 0,
          lng: 0,
        },
        created: '',
        modified: '',
        villageId: '',
        checkUpperGeo: {
          id: '',
          name: '',
          entityType: '',
          parentId: '',
          parents: [],
        },
      };
    },
    emptyStatesDetails(state, action) {
      state.isLoading = false;
      state.statesList = [];
      state.districtList = {
        mainEntity: {
          id: '',
          name: '',
          entityType: '',
        },
        childEntities: [],
      };
      state.talukList = {
        mainEntity: {
          id: '',
          name: '',
          entityType: '',
          parentId: '',
        },
        childEntities: [],
      };
      state.villageList = {
        mainEntity: {
          id: '',
          name: '',
          entityType: '',
          parentId: '',
        },
        childEntities: [],
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getUsers,
  setStatesList,
  setDistrictList,
  setTalukList,
  setVillageList,
  getUserDetails,
  emptyUserDetails,
  emptyVillageList,
  emptyStatesDetails,
} = slice.actions;

// ----------------------------------------------------------------------

export function getUsersList(name?: string, village?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(village?.length && { villageName: village }),
    ...(name?.length && { name: name }),
  };
  try {
    axios.get('/sevak-list', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getUsers(response?.data?.data));
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getStatesList() {
  dispatch(slice.actions.startLoading());
  try {
    axios.get('/state').then((response) => {
      if (response?.status === 200) {
        dispatch(slice.actions.setStatesList(response?.data?.data));
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getDistrictList(id?: any) {
  dispatch(slice.actions.startLoading());
  try {
    axios.get(`/geographic-entities/${id}`).then((response) => {
      if (response?.status === 200) {
        dispatch(slice.actions.setDistrictList(response?.data?.data));
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}
export function getTalukList(id?: any) {
  dispatch(slice.actions.startLoading());
  try {
    axios.get(`/geographic-entities/${id}`).then((response) => {
      if (response?.status === 200) {
        dispatch(slice.actions.setTalukList(response?.data?.data));
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getVillageList(id?: any) {
  dispatch(slice.actions.startLoading());
  try {
    axios.get(`/geographic-entities/${id}`).then((response) => {
      console.log('response', response);

      if (response?.status === 200) {
        dispatch(slice.actions.setVillageList(response?.data?.data));
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function addEditUsers(payload?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.post(`/users`, payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
export function editUsersDetails(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.patch(`/sevak-update/${id}`, payload).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

export function getUsersDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/sevak-details/${id}`).then((res) => {
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
