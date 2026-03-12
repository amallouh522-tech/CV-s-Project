import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) navigate("/home");
  }, [token, navigate]);

  return (
    <div className='MainDevLogin'>
      <div className='Login-container'>
        {
          /*
          <div className="logo-header">
              <img src="/img/github-logo.png" alt="logo" width="48" />
          </div>
      */
        }


        <h2 className="login-title">Sign Up to Worky community</h2>

        <div className="login-card">
          <div className="inpbox">
            <label>Username</label>
            <div className="input-wrapper">
              <img src="/img/username.png" className="field-icon" alt="" />
              <input name='username' type="text" className="inp" />
            </div>
          </div>

          <div className="inpbox">
            <label>Email Address</label>
            <div className="input-wrapper">
              <img src="/img/email.png" className="field-icon" alt="" />
              <input name='username' type="text" className="inp" />
            </div>
          </div>

          <div className="inpbox">
            <div className="label-flex">
              <label>Password</label>
              <a href="#" className="forgot-pass">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <img src="/img/password.png" className="field-icon" alt="" />
              <input name='password' type="password" className="inp" />
            </div>
          </div>

          <button className='submit-btn'>Sign in</button>
        </div>

        <div className="social-auth">
          <button className="auth-btn github">
            <img src="/img/github.png" alt="" />
            <span>Sign in with GitHub</span>
          </button>
          <button className="auth-btn facebook">
            <img src="/img/facebook.png" alt="" />
            <span>Sign in with Facebook</span>
          </button>
        </div>

        <p className="create-account">
          already have account? <a href="/login">Login</a>.
        </p>
      </div>
    </div>
  );
}