import { createSlice } from '@reduxjs/toolkit';
import { EventInput } from '@fullcalendar/common';
// utils
import axios from '../../utils/axios';
//
import { dispatch } from '../store';
import { EquipmentList } from 'src/@types/equipment';

// ----------------------------------------------------------------------

const initialState: EquipmentList = {
  isLoading: false,
  error: null,
  equipmentListData: [],
  equipmentDetails: {
    id: '',
    name: '',
    equipment: '',
    created: '',
    modified: '',
    status: '',
  },
};

const slice = createSlice({
  name: 'equipments',
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
    getEquipments(state, action) {
      const { data } = action.payload;
      state.isLoading = false;
      state.equipmentListData = data;
    },
    // details
    equipmentsDetails(state, action) {
      state.isLoading = false;
      state.equipmentDetails = action.payload;
    },
    // empty details
    emptyEquipmentsDetails(state, action) {
      state.isLoading = false;
      state.equipmentDetails = {
        id: '',
        name: '',
        equipment: '',
        created: '',
        modified: '',
        status: '',
      };
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const { getEquipments, equipmentsDetails,emptyEquipmentsDetails } = slice.actions;

// ----------------------------------------------------------------------

export function getEquipmentsList(name?: string, equipment?: string) {
  dispatch(slice.actions.startLoading());
  let payload = {
    ...(name?.length && { name: name }),
    ...(equipment?.length && { equipment: equipment }),
  };
  try {
    axios.get('/equipment', { params: payload }).then((response) => {
      if (response?.status === 200 && response?.data?.statusCode === 200) {
        dispatch(slice.actions.getEquipments(response?.data));
        return response.data;
      } else {
      }
    });
  } catch (error) {
    dispatch(slice.actions.hasError(error));
  }
}

export function getEquipmentsDetails(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.get(`/equipment/${id}`).then((res) => {

        dispatch(slice.actions.equipmentsDetails(res?.data?.data));
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}
export function addEditEquipment(payload?: any, id?: string) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      const url = id ? `/equipment/${id}` : `/equipment`;
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


// delete element
export function deleteEquipment(id?: any) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      return await axios.delete(`/equipment/${id}`).then((res) => {
        return res;
      });
    } catch (error) {
      if (error?.statusCode === 403) {
        return error;
      }
    }
  };
}

