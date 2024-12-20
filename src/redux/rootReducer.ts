import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import userReducer from './slices/user';
import pitsReducer from './slices/pits';
import cropsReducer from './slices/crops';
import equipmentsReducer from './slices/equipment';


// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

const productPersistConfig = {
  key: 'product',
  storage,
  keyPrefix: 'redux-',
  whitelist: ['sortBy', 'checkout'],
};

const rootReducer = combineReducers({
  user: userReducer,
  pits: pitsReducer,
  crops: cropsReducer,
  equipments: equipmentsReducer,
  
});

export { rootPersistConfig, rootReducer };
