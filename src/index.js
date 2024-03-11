import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import WebSocketComponent from './WebSocket';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


import { GoogleOAuthProvider } from '@react-oauth/google';
import Main from './pages/Main'
import Request from './pages/Request'

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "/main",
    element: <Main />,
  },
  {
    path: "/request",
    element: <Request />,
  },
]);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="326313607776-macv5cle3gs1ehtb53rcm95je9rd3tlh.apps.googleusercontent.com">
      <RouterProvider router={router} />
    </GoogleOAuthProvider>;
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
