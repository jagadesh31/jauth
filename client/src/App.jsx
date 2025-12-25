import {createBrowserRouter,RouterProvider} from 'react-router-dom';

import './App.css'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Base from './pages/base/base';
import Home from './pages/home/home';
import ProtectedRoute from './Routes/protectedRoute';
import PublicRoute from './Routes/publicRoute';
import NotFound from './pages/notFound';
import RedirectPage from './pages/oauth/redirectpage';
import Docs from './pages/docs';
import About from './pages/about';

function App() {
  let router = createBrowserRouter([
    {
      element: <PublicRoute />,
      children: [
        { path: '/', element: <Base /> },
        { path: '/about', element: <About /> },
        { path: '/docs', element: <Docs /> },
      ],
    },
    { path: '/redirect', element: <RedirectPage /> },
    {
      element: <ProtectedRoute />,
      children: [
        { path: '/home', element: <Home /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
