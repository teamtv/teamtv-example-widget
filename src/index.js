import React from 'react';
import ReactDOM from 'react-dom';
import { Widget } from './Widget';


const insertWidget = (props) => {
  const currentScript = document.scripts[document.scripts.length - 1];

  const div = document.createElement('div');
  currentScript.parentElement.insertBefore(div, currentScript);
  ReactDOM.render(<Widget {...props} />, div);
};

export {insertWidget};