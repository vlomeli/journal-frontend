
import { useState} from 'react';

import './RegisterPage.css';

import { register } from '../../ApiServices/AuthService';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    const handleEmailChange = (event) => {
       setEmail(event.target.value);
    }

   const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

   const handleRegisterClick = async () => {
      const data = await register({email, username, password});
      
      console.log(data)
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
                        onChange={(event) => handleUsernameChange(event)}
                        className='username-input' 
                        placeholder='Username' />

                    <input
                        onChange={(event) =>  handlePasswordChange(event)} 
                        className='password-input'
                        placeholder='Password'
                        type='password' />

                    <button onClick={() => handleRegisterClick()}> Log In</button>
                    
            </div>
        </div>
    )
}

export default RegisterPage;