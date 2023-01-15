import React, { useState, createContext, useLayoutEffect} from 'react';
import {
BrowserRouter,
Routes,
Route  
} from "react-router-dom";
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthMiddleware from 'middlewares/auth';
import GuestMiddleware from 'middlewares/guest';
import { userFromToken } from 'constants/api/auth';
const Auth = React.lazy(()=> import('./pages/auth/auth'))
const Chat = React.lazy(()=> import('./pages/chat/chat'))

export const UserContext = createContext({});

function App() {
  const [user, setUser] = useState(null);

  useLayoutEffect(()=>{
    let token = localStorage.getItem('user-token');
    if(token && !user){
      userFromToken(token).then(data=>{
        if(data?.user){
          setUser(data.user);
        }
      })
    }
  }, []);

  return (
    <>
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
            <Route path='/chat' element={<AuthMiddleware> <Chat /> </AuthMiddleware>} />
            <Route path='*' element={ <GuestMiddleware><Auth /> </GuestMiddleware> } />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </UserContext.Provider>
    </>
  );
}

export default App;
