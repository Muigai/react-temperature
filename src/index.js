import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Calculator from './App';
import registerServiceWorker from './registerServiceWorker';

const {App, store} = Calculator;
const render = () => ReactDOM.render(<App />, document.getElementById('root'));
render();
store.subscribe(render);
registerServiceWorker();
