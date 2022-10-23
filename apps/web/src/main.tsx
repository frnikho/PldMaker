import { createRoot } from 'react-dom/client';
import React from "react";

import './index.scss';

import {App} from './app/app';
import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";

import {SocketContextProvider} from "./app/context/SocketContext";
import LanguageContextProvider from "./app/context/LanguageContext";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./app/page/ErrorPage";

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<BrowserRouter>
  <SocketContextProvider>
    <LanguageContextProvider>
      <ErrorBoundary onError={(error, info) => console.log('error', error, info)} FallbackComponent={ErrorPage}>
        <App />
        <ToastContainer position="bottom-left"
                        style={{width: '350px'}}
                        autoClose={5000}
                        hideProgressBar
                        newestOnTop
                        closeOnClick
                        rtl={false}/>
      </ErrorBoundary>
    </LanguageContextProvider>
  </SocketContextProvider>

</BrowserRouter>);
