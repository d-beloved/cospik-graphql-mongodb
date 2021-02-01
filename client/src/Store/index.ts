import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

let composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [thunk];

const composedEnhancers = composeEnhancers(
      applyMiddleware(...middleware),
    );

const store = createStore(rootReducer, composedEnhancers);

export default store;
