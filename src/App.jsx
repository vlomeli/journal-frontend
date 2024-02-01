import './App.css'

import {
  BrowserRouter, 
  Routes,
  Route,
} from 'react-router-dom';

import RegisterPage from './pages/RegisterPage/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path='/home' element={<HomePage />}></Route>
         <Route path='/login' element={<LoginPage />}></Route>
         <Route path='/' element={<RegisterPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
