import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function AddNewCv() {
    const CvTitleRef = useRef();
    const CvcontentRef = useRef();
    const FileInputRef = useRef();
    const [msg, setmsg] = useState("");
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const AddCvFetch = async () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        setLoading(true);
        window.scrollTo(0, 0);

        const CvTitle = CvTitleRef.current.value;
        const Cvcontent = CvcontentRef.current.value;
        const files = FileInputRef.current.files;

        if (!CvTitle || !Cvcontent) {
            setmsg("Please fill all fields");
            setLoading(false);
            return;
        }

        // إنشاء الـ FormData
        const formData = new FormData();
        formData.append('CvTitle', CvTitle);
        formData.append('Cvcontent', Cvcontent);

        // إضافة الصور للمصفوفة بنفس الاسم المتوقع في السيرفر
        for (let i = 0; i < files.length; i++) {
            formData.append('cv_photos', files[i]);
        }

        try {
            const response = await fetch("http://localhost:5001/api/addcv", {
                method: "POST",
                headers: {
                    // نرسل التوكن فقط، المتصفح سيتعامل مع الـ Content-Type للـ FormData
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();

            if (result.succ) {
                setmsg("Success: CV and photos uploaded!");
                // تفريغ الحقول بعد النجاح
                CvTitleRef.current.value = "";
                CvcontentRef.current.value = "";
                FileInputRef.current.value = null;
            } else {
                setmsg(result.msg || "Something went wrong");
            }
        } catch (error) {
            console.error("Error:", error);
            setmsg("Network error, please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="MainDevLogin">
            <header className='main-header'>
                <nav className='navbar'>
                    <div className="nav-logo"><span>Worky community</span></div>
                    <ul className="nav-links">
                        <li><Link to={"/home"}>Home</Link></li>
                        <li><Link to={"/profile"}>Profile</Link></li>
                        <li><Link to={"/logout"}>Logout</Link></li>
                    </ul>
                </nav>
            </header>

            <div className='addcv'>
                <h2 style={{ textAlign: "center", color: msg.includes("Success") ? "green" : "red" }}>
                    {msg || <br />}
                </h2>

                <div className="inputs">
                    <div className="inpbox">
                        <label>Title For Cv</label>
                        <input ref={CvTitleRef} type="text" className="cvtitle" placeholder='Software Engineer...' />
                    </div>

                    <div className="inpbox">
                        <label>Content</label>
                        <textarea ref={CvcontentRef} className='textarea cvtitle' placeholder='Describe your experience...'></textarea>
                    </div>

                    <div className='AddPhotos'>
                        <label>Upload Photos (Images only)</label>
                        <input
                            ref={FileInputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ marginTop: "10px" }}
                        />
                    </div>

                    <button
                        onClick={AddCvFetch}
                        disabled={loading}
                        className="submit-btn"
                        style={{ margin: "20px auto" }}
                    >
                        {loading ? "Sending..." : "Add My CV"}
                    </button>
                </div>
            </div>
        </div>
    );
}