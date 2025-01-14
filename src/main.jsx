import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import LoginForm from './components/LoginForm.jsx';   
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterForm from './Components/Registerform.jsx';

const router = createBrowserRouter([
  {
    path: "/", 
    element: <App />,
  },
  {
    path: "/Loginform", 
    element: <LoginForm />, 
  },
  {
    path: "/Registerform", 
    element: <RegisterForm />, 
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
