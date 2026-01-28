import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// 載入 bootstrap 的 css 與 js
//import './assets/all.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Week3 from './Week3.jsx'
//import Daily from './practise/Daily.jsx'
import Week4 from './Week4.jsx'


createRoot(document.getElementById('root')).render(
  //嚴謹模式<StrictMode>
  <Week4 />

)
