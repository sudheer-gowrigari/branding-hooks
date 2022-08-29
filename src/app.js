import '@lwc/synthetic-shadow';
import {createElement} from 'lwc';
import App from './app/app';

document
  .querySelector('#main')
  .appendChild(createElement('styling-hooks-app', {is: App}));
