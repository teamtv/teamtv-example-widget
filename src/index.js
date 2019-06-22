import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


const insertWidget = (endpointUrl) => {
  const currentScript = document.scripts[document.scripts.length - 1];

  const div = document.createElement('div');
  currentScript.parentElement.insertBefore(div, currentScript);
  ReactDOM.render(<App endpointUrl={endpointUrl} />, div);
};

export {insertWidget};