import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const usernameRef = useRef();
    const passwordRef = useRef();

    const [msg, setmsg] = useState();

    useEffect(() => {
        if (token) navigate("/home");
    }, [token, navigate]);

    async function LoginFetch() {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        if (!username || !password) {
            setmsg("Please Enter A valid Data");
        } else {
            try {
                const response = await fetch("/api/login", {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ username: username, password: password })
                });
                const result = await response.json();
                if (result.succ) {
                    localStorage.setItem('token', result.token);
                    navigate("/home");
                } else {
                    setmsg("Invalid username or password");
                }
            } catch (error) {
                console.error("error num 1 in login : ", error);
            };
        };
    }

    const GITHUB_CLIENT_ID = "Ov23liQ5rtXeXmTamiOi";

    const loginWithGithub = () => {

        const redirectUri = encodeURIComponent("http://localhost:5173/github/callback");

        window.location.href =
            `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;

    };

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

                <div style={{ textAlign: "center" }} className="head">
                    <h2 className="login-title">Sign in to Worky community</h2>
                    <h2 color='red'>{msg ? msg : <br />}</h2>
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
                        <div className="label-flex">
                            <label>Password</label>
                            <a href="#" className="forgot-pass">Forgot password?</a>
                        </div>
                        <div className="input-wrapper">
                            <img src="/img/password.png" className="field-icon" alt="" />
                            <input ref={passwordRef} name='password' type="password" className="inp" />
                        </div>
                    </div>

                    <button onClick={LoginFetch} className='submit-btn'>Sign in</button>
                </div>

                <div className="social-auth">
                    <button onClick={loginWithGithub} className="auth-btn github">
                        <img src="/img/github.png" alt="" />
                        <span>Sign in with GitHub</span>
                    </button>
                </div>

                <p className="create-account">
                    New to Worky community? <a href="/register">Create an account</a>.
                </p>
            </div>
        </div>
    );
}