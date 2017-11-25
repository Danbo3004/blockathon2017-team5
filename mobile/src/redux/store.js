import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware, compose } from 'redux';
import { REHYDRATE, PURGE, persistCombineReducers, persistStore } from 'redux-persist'
import thunk from 'redux-thunk';
import reducers from './index';

let middleware = [
  thunk,
];

const config = {
  key: 'primary',
  storage: AsyncStorage,
  blacklist: [],
};

let reducer = persistCombineReducers(config, reducers)

const store = createStore(
  reducer,
  undefined,
  compose(
    applyMiddleware(...middleware),
  )
)

/**
 * Re-hydrate the store with callback, ensure the data is restored before the app start
 * @param callback
 */
export function reHydrate(callback) {
  persistStore(store, null, callback);
}

export default store;
