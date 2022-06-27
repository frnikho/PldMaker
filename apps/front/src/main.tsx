import ReactDOM from 'react-dom';
import React from "react";


import './index.scss';

import {App} from './app/app';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";

import {SocketContextProvider} from "./app/context/SocketContext";

ReactDOM.render(<BrowserRouter>
  <SocketContextProvider>
    <App />
    <ToastContainer position="bottom-left"
                    style={{width: '350px'}}
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}/>
  </SocketContextProvider>

</BrowserRouter>, document.getElementById('root') as HTMLElement);
/*
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <SocketContextProvider>
        <App />
        <ToastContainer position="bottom-left"
                        style={{width: '350px'}}
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}/>
      </SocketContextProvider>

    </BrowserRouter>
);*/
