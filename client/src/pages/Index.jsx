import React, { useEffect } from 'react'
import { Link } from "react-router-dom"
import { HashLink } from 'react-router-hash-link'; // يفضل تثبيتها لجعل التنقل أفضل
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const Navigate = useNavigate();
  const token = localStorage.getItem('token');
  useEffect(() => {
    if (token) {
      Navigate("/home");
    };
  } , []);
  return (
    <div className='IndexPage'>
      <header className="main-header">
        <nav className="navbar">
          <div className="nav-logo">
             <span>Worky community</span>
          </div>
          
          <ul className="nav-links">
            {/* استخدام HashLink للتنقل للـ ID */}
            <li><HashLink smooth to="#about">About</HashLink></li>
            <li><HashLink smooth to="#services">Services</HashLink></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Sign Up</Link></li>
          </ul>
        </nav>
      </header>

      {/* المحتوى الرئيسي للموقع */}
      <main>
        <section className="hero">
            <h1>Welcome to Worky community</h1>
            <p>Work World , many company's and freelancer's</p>
        </section>
        <section id="about" className="content-section">
            <h2>About Worky community</h2>
            <p>Worky wants to make a big community, And Make Find job or freelancer is easyer</p>
        </section>

        <section id="services" className="content-section">
            <h2>Our Services</h2>
            <p>Cv's System , Any one can make cv and upload photos , github account and Social Media accounts</p>
        </section>
      </main>
    </div>
  )
}