import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import TasksScreen from './screens/TasksScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import HomeScreen from './screens/HomeScreen.jsx'

const App = () => {
  return (
    
      <Routes>
        <Route path='/' element={<HomeScreen/>}/>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        
        <Route element={<PrivateRoute/>}>
          <Route path="/tasks" element={<TasksScreen/>}/>
        </Route>
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
  );
}

export default App
