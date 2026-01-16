import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//sass 匯入練習
import './assets/exportJs.js'

//預設匯出練習
//import exportJS from './assets/exportJs.js';
//import MyApp from './MyApp.jsx';
import AppUseState from './AppUseState.jsx';
import AppUseEffect from './AppUseEffect.jsx';
import AppUseRef from './AppUseRef.jsx';


//exportJS();

//具名匯出練習

// import { myName, fnMyName } from './assets/exportJs.js'

// console.warn(myName);
// fnMyName();

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  //嚴謹模式<StrictMode>

  <AppUseRef />

)
