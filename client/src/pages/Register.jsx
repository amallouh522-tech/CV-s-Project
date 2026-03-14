import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const usernameRef = useRef();
  const passwordRef = useRef();
  const EmailRef = useRef();

  const [msg, setmsg] = useState();

  useEffect(() => {
    if (token) navigate("/home");
  }, [token, navigate]);

  const GITHUB_CLIENT_ID = "Ov23liQ5rtXeXmTamiOi";

  const loginWithGithub = () => {

    const redirectUri = encodeURIComponent("http://localhost:5173/github/callback");

    window.location.href =
      `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;

  };



  async function RegisterFetch() {
    const username = usernameRef.current.value;
    const Email = EmailRef.current.value;
    const password = passwordRef.current.value;
    if (!username || !password || !Email) {
      setmsg("Please Enter valid Data");
    } else {
      try {
        const response = await fetch("http://localhost:5001/api/register", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          credentials: "include", // <--- ADD THIS LINE
          body: JSON.stringify({ username: username, password: password, email: Email })
        });
        const result = await response.json();
        if (result.succ) {
          setmsg("Check Your Email .. code was Sent")
          navigate("/verify")
        } else {
          setmsg("Invalid username or password");
        }
      } catch (error) {
        console.error("error num 1 in Register : ", error);
      };
    }
  }

  return (
    <div className='MainDevLogin'>
      <div className='Login-container'>
        <div style={{ textAlign: "center" }} className="head">
          <h2 className="login-title">Sign Up to Worky community</h2>
          <h2>{msg ? msg : <br />}</h2>
        </div>

        <div className="login-card">
          <div className="inpbox">
            <label>Username</label>
            <div className="input-wrapper">
              <img src="/img/username.png" className="field-icon" alt="" />
              <input ref={usernameRef} name='username' type="text" className="inp" />
            </div>
          </div>

          <div className="inpbox">
            <label>Email Address</label>
            <div className="input-wrapper">
              <img src="/img/email.png" className="field-icon" alt="" />
              <input ref={EmailRef} name='username' type="text" className="inp" />
            </div>
          </div>

          <div className="inpbox">
            <div className="label-flex">
              <label>Password</label>
              <a href="#" className="forgot-pass">Forgot password?</a>
            </div>
            <div className="input-wrapper">
              <img src="/img/password.png" className="field-icon" alt="" />
              <input ref={passwordRef} name='password' type="password" className="inp" />
            </div>
          </div>

          <button onClick={RegisterFetch} className='submit-btn'>Sign Up</button>
        </div>

        <div className="social-auth">
          <button onClick={loginWithGithub} className="auth-btn github">
            <img src="/img/github.png" alt="" />
            <span>Sign in with GitHub</span>
          </button>
        </div>

        <p className="create-account">
          already have account? <a href="/login">Login</a>.
        </p>
      </div>
    </div>
  );
}