import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './Widget';


const insertWidget = (endpointUrls) => {
  const currentScript = document.scripts[document.scripts.length - 1];

  const div = document.createElement('div');
  currentScript.parentElement.insertBefore(div, currentScript);
  ReactDOM.render(<Widget endpointUrls={endpointUrls} />, div);
};

export {insertWidget};