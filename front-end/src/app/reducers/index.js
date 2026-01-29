import { combineReducers } from 'redux';

import user from './user';
import insurancePolicy from './insurancePolicy';
import client from './client';

export default combineReducers({
  user,
  insurancePolicy,
  client,
});
