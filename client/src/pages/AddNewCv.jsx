import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function AddNewCv() {
    const CvTitleRef = useRef();
    const CvcontentRef = useRef();
    const FileInputRef = useRef(); // ريف جديد للصور
    const [msg, setmsg] = useState();
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, [token, navigate]);

    const AddCvFetch = async () => {
        const CvTitle = CvTitleRef.current.value;
        const Cvcontent = CvcontentRef.current.value;
        const files = FileInputRef.current.files; // الحصول على الملفات المختارة

        if (!CvTitle || !Cvcontent) {
            setmsg("Invalid Data");
            return;
        }

        // استخدام FormData بدلاً من JSON
        const formData = new FormData();
        formData.append('CvTitle', CvTitle);
        formData.append('Cvcontent', Cvcontent);

        // إضافة الصور الـ متعددة للفورم داتا
        for (let i = 0; i < files.length; i++) {
            formData.append('cv_photos', files[i]);
        }

        try {
            const response = await fetch("/api/addcv", {
                method: "POST",
                headers: {
                    // ملاحظة: لا تضع Content-Type هنا، المتصفح سيقوم بذلك تلقائياً
                    "Authorization": `Bearer ${token}`
                },
                // إرسال الـ formData مباشرة
                body: formData
            });

            const result = await response.json();
            if (result.succ) {
                setmsg("Cv added successfully");
            } else {
                setmsg(result.msg);
            }
        } catch (error) {
            console.error("error In add cv :", error);
            setmsg("Error while Adding ... check your internet connection");
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
                        <label>Title For Cv</label>
                        <input ref={CvTitleRef} type="text" className="cvtitle" placeholder='Title' />
                    </div>
                    <div className="inpbox">
                        <label>Content</label>
                        <textarea ref={CvcontentRef} className='textarea cvtitle' placeholder='Your Cv'></textarea>
                    </div>
                    <div className='AddPhotos'>
                        <label>Upload Photos (Multiple)</label>
                        <br />
                        {/* أضفنا الـ Ref هنا */}
                        <input 
                            ref={FileInputRef} 
                            type="file" 
                            name="cv_photos" 
                            multiple 
                            accept="image/*" 
                        />
                    </div>
                    <button onClick={AddCvFetch} style={{ margin: "10px auto" }} className="submit-btn">Send</button>
                </div>
            </div>
        </div>
    )
}