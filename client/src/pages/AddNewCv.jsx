import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
export default function AddNewCv() {
    const CvTitleRef = useRef();
    const CvcontentRef = useRef();
    const [msg, setmsg] = useState();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, []);

    const AddCvFetch = async () => {
        const CvTitle = CvTitleRef.current.value;
        const Cvcontent = CvcontentRef.current.value;
        if (!CvTitle || !Cvcontent) {
            setmsg("Invalid Data");
            return;
        } else {
            try {
                const response = await fetch("/api/addcv", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    credentials: "include",
                    body: JSON.stringify({ CvTitle, Cvcontent })
                });
                const result = await response.json();
                if (result.succ) {
                    setmsg("Cv added succ");
                } else {
                    setmsg(result.msg);
                };
            } catch (error) {
                console.error("error In add cv : 1 :", error);
                setmsg("Error while Adding ... check your internet connection");
            };
        }
    }

    return (
        <div className="MainDevLogin">
            <header className='main-header'>
                <nav className='navbar'>
                    <div className="nav-logo">
                        <span>Worky community - Add Cv</span>
                    </div>
                    <ul className="nav-links">
                        <li><Link to={"/home"}>Home</Link></li>
                        <li><Link to={"/projects"}>Projects</Link></li>
                        <li><Link to={"/profile"}>Profile</Link></li>
                        <li><Link to={"/logout"}>Logout</Link></li>
                    </ul>
                </nav>
            </header>
            <div className='addcv'>
                <h2 style={{ textAlign: "center" }}>{msg ? msg : <br />}</h2>
                <div className="inputs">
                    <div className="inpbox">
                        <label htmlFor=".cvtitle">Title For Cv .</label>
                        <input ref={CvTitleRef} type="text" className="cvtitle" placeholder='Title' />
                    </div>
                    <div className="inpbox">
                        <label htmlFor=".textarea">Title For Cv .</label>
                        <textarea ref={CvcontentRef} className='textarea cvtitle' placeholder='Your Cv'></textarea>
                    </div>
                    <button onClick={AddCvFetch} style={{ margin: "10px auto" }} className="submit-btn">Send</button>
                </div>
            </div>
        </div>

    )
}
