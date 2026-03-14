import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Home() {
    const Navigate = useNavigate();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            Navigate("/login");
        }
    }, []);
    return (
        <div className='home'>
            <header className='main-header'>
                <nav className='navbar'>
                    <div className="nav-logo">
                        <span>Worky community - Home</span>
                    </div>
                    <ul className="nav-links">
                        <li><Link to={"/addcv"}>Add Your own CV</Link></li>
                        <li><Link to={"/projects"}>Projects</Link></li>
                        <li><Link to={"/profile"}>Profile</Link></li>
                        <li><Link to={"/logout"}>Logout</Link></li>
                    </ul>
                </nav>
            </header>
        </div>
    )
}
