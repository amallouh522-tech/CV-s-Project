import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GithubCallback() {

  const navigate = useNavigate();

  useEffect(() => {

    const code = new URLSearchParams(window.location.search).get("code");

    if (!code) return;

    fetch("/api/auth/github/callback",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({code})
    })
    .then(res => res.json())
    .then(data => {

      if(data.succ){
        localStorage.setItem("token", data.token);
        navigate("/home");
      }

    });

  },[]);

  return <h2>Signing in with GitHub...</h2>;
}
