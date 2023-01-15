
import './auth.css';
import { register, login } from 'constants/api/auth';
import { useContext, useState } from 'react';
import { notifyError } from 'constants/functions';
import { UserContext } from 'App';
import { useNavigate } from 'react-router-dom';

export default function Auth(){
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();
    const [registerForm, setRegisterForm] = useState({});
    const [loginForm, setLoginForm] = useState({});


    const handleRegisterChange = (e) => setRegisterForm( prev=> ({...prev, [e.target.name]: e.target.value}) )
    const handleLoginChange = (e) => setLoginForm( prev=> ({...prev, [e.target.name]: e.target.value}) )
    const isValidEmail = (email) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)

    const handleRegister = async (e)=>{
        e.preventDefault();
        if( !registerForm?.name || !registerForm?.email || !registerForm?.password ){
            notifyError("All Fields are required")
            return;
        }
        if(! isValidEmail(registerForm.email)){
            return notifyError('Please Enter Valid Email')
        }
        register(registerForm).then(data=>{
            if(data?.user && data.user.token){
                localStorage.setItem('user-token', data.user.token);
                setUser(data.user)
                navigate('/chat')
                return
            }
        })
    }
    const handleLogin = async (e)=>{
        e.preventDefault();
        if( !loginForm?.email || !loginForm?.password ){
            notifyError("All Fields are required")
            return;
        }
        if(! isValidEmail(loginForm.email)){
            return notifyError('Please Enter Valid Email')
        }
        login(loginForm).then(data=>{
            if(data?.user && data.user.token){
                localStorage.setItem('user-token', data.user.token);
                setUser(data.user)
                navigate('/chat')
                return
            }
        })
    }

    
    return (
        <div className='auth-screen'>
            <div className="main">
                    <input type="checkbox" id="chk" aria-hidden="true" />

                    <div className="signup">
                        <form onSubmit={handleRegister}>
                            <label htmlFor="chk" aria-hidden="true">Sign up</label>
                            <input type="text" name="name" onChange={handleRegisterChange} placeholder="Name"/>
                            <input type="text" name="email" onChange={handleRegisterChange} placeholder="Email"/>
                            <input type="password" name="password" onChange={handleRegisterChange} placeholder="Password"/>
                            <button>Sign up</button>
                        </form>
                    </div>

                    <div className="login">
                        <form onSubmit={handleLogin}>
                            <label htmlFor="chk" aria-hidden="true">Login</label>
                            <input type="text" name="email" onChange={handleLoginChange} placeholder="Email" />
                            <input type="password" name="password" onChange={handleLoginChange} placeholder="Password" />
                            <button>Login</button>
                        </form>
                    </div>
            </div>
        </div>
    )
}