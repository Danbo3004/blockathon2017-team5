import { combineReducers } from 'redux';
import balance from './balance';
import contract from './contract';

const rootReducer = combineReducers({
  balance,
  contract
});

export default rootReducer;
