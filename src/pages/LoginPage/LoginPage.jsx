import { useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import hidden from '../../images/hidden.png';
import eye from '../../images/eye.png';

import './LoginPage.css';

import { LogIn } from '../../ApiServices/AuthService';

const LoginPage = () => {
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

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
                    className='login-username-input' 
                    placeholder='Username' />

            <div className="login-password-input-wrapper">
                <input      
                    onChange={(event) => handlePasswordChange(event)} 
                    className='login-password-input'
                    placeholder='Password'
                    type={passwordVisible ? 'text' : 'password'} />
                    <button type="button" className="login-toggle-password-visibility" onClick={() => setPasswordVisible(!passwordVisible)}>
                        <img src={passwordVisible ? eye : hidden} alt="Toggle Password Visibility" />
                    </button>
                </div>    


                <button className='login-button' onClick={() => handleLoginClick()}> Login </button>
                    
                <Link className='register-link' to='/register'> Don't have an account? Sign Up </Link>
            </div>
        </div>
    )
}


export default LoginPage;