import { useState} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import hidden from '../../images/hidden.png';
import eye from '../../images/eye.png';

import './RegisterPage.css';

import { register } from '../../ApiServices/AuthService';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const navigate = useNavigate();
    
    const handleEmailChange = (event) => {
       setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    const togglePasswordVisibility = () => { // Function to toggle password visibility
        setPasswordVisible(!passwordVisible);
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
                        className='register-email-input' 
                        placeholder='Email'
                        type="email" />

                    <div className="register-password-input-wrapper">
                        <input
                            onChange={(event) => handlePasswordChange(event)} 
                            className='register-password-input'
                            placeholder='Password'
                            type={passwordVisible ? 'text' : 'password'} />
                         <button type="button" className="register-toggle-password-visibility" onClick={togglePasswordVisibility}>
                            <img src={passwordVisible ? eye : hidden} alt="Toggle Password Visibility" />
                        </button>
                    </div>

                    <input
                        onChange={(event) => handleUsernameChange(event)}
                        className='register-username-input' 
                        placeholder='Username'
                        type="username" />

                    <button className='register-button' onClick={() => handleRegisterClick()}> register </button>

                    <Link className='login-link' to='/'>Already have an account? Log In</Link>
                    
            </div>
        </div>
    )
}

export default RegisterPage;