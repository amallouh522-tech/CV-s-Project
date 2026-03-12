import React, { useRef, useState } from 'react'

export default function Verify() {
  const [msg, setmsg] = useState();
  const OTPRef = useRef();
  async function Verify_fetch() {
    const OTP = OTPRef.current.value;
    if (!OTP) {
      setmsg("Please Enter Valid Data");
    } else {
      try {
        const response = await fetch("http://localhost:5001/api/verify-token", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ OTP:OTP})
        });
        const result = await response.json();
        if (result.succ) {
          navigate("/login");
        } else {
          setmsg(result.msg);
        }
      } catch (error) {
        console.error("error num 1 in Register : ", error);
      };
    }
  }
  return (
    <div className='verify'>
      <h2 style={{ textAlign: "center" }}>{msg ? msg : <br />}</h2>
      <label htmlFor=".verifyinp">Your OTP code</label>
      <input ref={OTPRef} type="text" className="verifyinp" placeholder='XXXXXX' />
      <button onClick={Verify_fetch} style={{ margin: "10px auto" }} className="submit-btn">Send</button>
      <span>Please Don't Share this code</span>
    </div>
  )
}
