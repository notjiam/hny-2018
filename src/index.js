import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import reducers from './reducers';
import ReduxPromise from 'redux-promise';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);

ReactDOM.render(
	<Provider store={createStoreWithMiddleware(reducers)}>
	  <App />
	</Provider>
	, document.getElementById('root'));
registerServiceWorker();
