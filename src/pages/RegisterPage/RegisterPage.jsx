
import { useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';

import './RegisterPage.css';

import { register } from '../../ApiServices/AuthService';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    
    const handleEmailChange = (event) => {
       setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

   const handleRegisterClick = async () => {
      const { jwt, success } = await register({email, password, username});

        if (success) { 
            localStorage.setItem('journal-app-jwt', jwt);
            navigate('/home');
        }else {
            alert('Error registering')
        }

    }

    return (
        <div className="register-page-container">
            <div className='register-form-container'> 
                
                <h1>Register</h1>

                    <input
                        onChange={(event) => handleEmailChange(event)} 
                        className='email-input' 
                        placeholder='Email' />

                    <input
                        onChange={(event) =>  handlePasswordChange(event)} 
                        className='password-input'
                        placeholder='Password'
                        type='password' />

                    <input
                        onChange={(event) => handleUsernameChange(event)}
                        className='username-input' 
                        placeholder='Username' />

                    <button className='register-button' onClick={() => handleRegisterClick()}> register </button>

                    <Link to='/'>Click here to log in</Link>
                    
            </div>
        </div>
    )
}

export default RegisterPage;