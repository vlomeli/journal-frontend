import { useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

import './LoginPage.css';

import { LogIn } from '../../ApiServices/AuthService';

const LoginPage = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

   
    const handleLoginClick = async () => {
        const { jwt, success } = await LogIn({  username, password});

        if (success) { 
            localStorage.setItem('journal-app-jwt', jwt);
            navigate('/home');
        }else {
            alert('Error logging in')
        }
    } 

    return (
        <div className="login-page-container">
            <div className='login-form-container'> 
                
                <h1>Log In</h1>

                <input
                    onChange={(event) => handleUsernameChange(event)}
                    className='username-input' 
                    placeholder='Username' />
                    
                <input      
                    onChange={(event) =>  handlePasswordChange(event)} 
                    className='password-input'
                    placeholder='Password'
                    type='password' />


                <button className='login-button' onClick={() => handleLoginClick()}> Login </button>
                    
                <Link to='/register'> Click here to register</Link>
            </div>
        </div>
    )
}


export default LoginPage;