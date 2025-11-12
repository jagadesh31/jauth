import {createBrowserRouter,RouterProvider} from 'react-router-dom';

import './App.css'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Base from './pages/base'
import Home from './pages/home';

import ProtectedRoute  from './routes/protectedRoutes';

import NotFound from './pages/notFound';

import RedirectPage from './pages/redirectpage';


function App() {
  let router = createBrowserRouter([
    {path:'/',
    element:<Base/>
    },
    {   
    path:'/oauth/v2',
    element:<RedirectPage/>
    },
    {
      element:<ProtectedRoute/>,
      children:[
        {path:'/home',
         element:<Home/>
       },
      ]
    },
    {
      path:'*',
      element : <NotFound/>
    }
  ])

  return (
   <RouterProvider router={router}>
      <ToastContainer />
   </RouterProvider>
  )
}

export default App
