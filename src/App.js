import React, {useState, useEffect} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import axios from 'axios';

import Loading from './shared-components/Loading';
import Navbar from './shared-components/Navbar';
import Home from './shared-components/Home';
import AdminHome from './view-admin/AdminHome';
import StudentHome from './view-student/StudentHome';

import DataContext from './contexts/DataContext';
import AuthContext from './auth/AuthContext';

import Login from './auth/Login';
import Signup from './auth/Signup';
import Verify from './auth/Verify';
import ForgotPassword from './auth/ForgotPassword';
import ResetPassword from './auth/ResetPassword';
import Settings from './auth/Settings';

import './App.css';


const App = () => {
  const [auth, setAuth] = useState({isAuth: false, loading: true, fetched: false})
  const [dataContext, setDataContext] = useState({passes: []})


  useEffect(() => {
    if (!dataContext) {
      getData()
    }
  }, [])
  useEffect(() => {
    if (dataContext.passes.length == 0 && auth.isAuth) {
      getData()
    }
  }, [auth])
  

  const getData = async() => {
    try {
      const passRes = await axios.get(`${process.env.REACT_APP_PASS_API}/`);
      console.log(passRes.data)
      setDataContext({passes: passRes.data.passes});
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!auth.user && !auth.fetched){
      console.log('test token')
      testToken()
    }
    if (auth.toFetch){
      testToken()
      console.log("hi there")
    }
    console.log(auth)
  }, [auth])

  const testToken = async () => {
    const token = localStorage.getItem('token')

    if(!token){
      setAuth({isAuth: false, loading: false, fetched: true})

    } else {
      axios.defaults.headers.common['Authorization'] =`Bearer ${token}`

      try{
        const res = await axios.get(`${process.env.REACT_APP_AUTH_API}/user/?timestamp=${new Date().getTime()}`)
        console.log(res.data)

        if (!res.data.errors){
          setAuth({isAuth: true, user: res.data, loading: false, fetched: true})

        } else {
          console.log("set to false")
          localStorage.removeItem("token")
          setAuth({isAuth: false, loading: false, fetched: true})
        }
      } catch (err) {
        localStorage.removeItem("token")
        console.log("set to false")
        setAuth({isAuth: false, loading: false, fetched: true})
      }
    }
  } 


  return (
    <AuthContext.Provider value={{auth, setAuth}}>
    <DataContext.Provider value={{dataContext, setDataContext}}>

      <BrowserRouter>
        <Switch>

          <Route exact path="/verify/:token" component={Verify}/>
          <Route exact path="/forgot-password" component={ForgotPassword}/>
          <Route exact path="/reset-password/:token" component={ResetPassword}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/signup" component={Signup}/>
          <Route exact path="/settings" component={Settings}/>

          <div className="App">
            <Navbar/>
            {auth.user?.role === "teacher"?
              <> {/* student routes */}
                <Route exact path="/" component={AdminHome}/>
              </>
            :auth.user?.role === "student"?
              <> {/* student routes */}
                <Route exact path="/" component={StudentHome}/>
              </>
            :
              <> {/* other routes */}
                <Route exact path="/" component={Home}/>
              </>
            }
          </div>
          
        </Switch>
      </BrowserRouter>

    </DataContext.Provider>
    </AuthContext.Provider>
  )
}
export default App;
