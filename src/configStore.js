import {createStore, combineReducers, applyMiddleware} from 'redux';
import {persistStore, persistReducer} from 'redux-persist';
import {AsyncStorage} from 'react-native';
import thunk from 'redux-thunk';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

//Types
export const types = {
  CREATE_BUDGET: 'CREATE_BUDGET',
  ADD_ENTRY: 'ADD_ENTRY',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_ENTRY: 'DELETE_ENTRY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
};

//Actions
export const createBudget = data => {
  return dispatch => {
    dispatch({
      type: types.CREATE_BUDGET,
      payload: {
        amount: data.amount,
        fromDate: data.fromDate,
        endDate: data.endDate,
      },
    });
  };
};
export const addEntry = data => {
  return dispatch => {
    dispatch({
      type: types.ADD_ENTRY,
      payload: {
        amount: data.amount,
        description: data.description,
        category: data.category,
        createdAt: data.createdAt,
      },
    });
  };
};
export const deleteEntry = data => {
  return dispatch => {
    dispatch({
      type: types.DELETE_ENTRY,
      payload: {
        id: data.id,
      },
    });
  };
};
export const addCategory = data => {
  return dispatch => {
    dispatch({
      type: types.ADD_CATEGORY,
      payload: {
        category: data.category,
      },
    });
  };
};
export const deleteCategory = data => {
  return dispatch => {
    dispatch({
      type: types.DELETE_CATEGORY,
      payload: {
        category: data.category,
      },
    });
  };
};

//Reducers
const budget = (
  state = {
    amount: null,
    fromDate: null,
    endDate: null,
  },
  action,
) => {
  switch (action.type) {
    case types.CREATE_BUDGET:
      return {
        amount: action.payload.amount,
        fromDate: action.payload.fromDate,
        endDate: action.payload.endDate,
      };
    default:
      return state;
  }
};

const entry = (state = {}, action) => {
  switch (action.type) {
    case types.ADD_ENTRY:
      console.log(action);
      return {...state, [action.payload.createdAt]: action.payload};
    case types.DELETE_ENTRY:
      let entries = {...state};
      delete entries[action.payload.id];
      return entries;
    default:
      return state;
  }
};

const initialCategory = {
  food: {
    value: 'FOOD',
  },
  travel: {
    value: 'TRAVEL',
  },
  other: {
    value: 'OTHER',
  },
};
const category = (state = initialCategory, action) => {
  switch (action.type) {
    case types.ADD_CATEGORY:
      return {
        ...state,
        [action.payload.category]: {value: action.payload.category},
      };
    case types.DELETE_CATEGORY:
      let categories = {...state};
      delete categories[action.payload.category];
      return categories;
    default:
      return state;
  }
};

//Initialization
export let rootReducer = combineReducers({
  budget,
  entry,
  category,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export let store = createStore(persistedReducer, applyMiddleware(thunk));
export let persistor = persistStore(store);
