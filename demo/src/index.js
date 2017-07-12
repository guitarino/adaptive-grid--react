import { renderApp } from './App';

import 'resize-sensor--react/build/resize-sensor.css';
import './App.css';

document.addEventListener('DOMContentLoaded', function() {
  renderApp(
    document.getElementById('react-root')
  );
})