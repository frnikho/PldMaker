import * as ReactDOM from 'react-dom/client';
import './index.scss';

import {App} from './app/app';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import React from "react";
import {BrowserRouter} from "react-router-dom";

import {SocketContextProvider} from "./app/context/SocketContext";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <BrowserRouter>
      <SocketContextProvider>
        <App />
        <ToastContainer position="bottom-left"
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}/>
      </SocketContextProvider>

    </BrowserRouter>
);
