import { renderApp } from './App.Builder';

import 'resize-sensor--react/build/resize-sensor.css';
import './App.Builder.css';

document.addEventListener('DOMContentLoaded', function() {
  renderApp(
    document.getElementById('react-root')
  );
})