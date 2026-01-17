import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 載入 bootstrap 的 css 與 js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx'
import Week2 from './Week2.jsx'
import Week3 from './Week3.jsx'

createRoot(document.getElementById('root')).render(
  //嚴謹模式<StrictMode>
  <Week3 />


)
