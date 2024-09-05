import React, { useState } from "react";
import "./SignUp.css";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "../../components/gAuth/googleAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const nevigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/broker/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      //console.log(data.message);

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(data.message);
      nevigate("/sign-in");
    } catch (error) {
      setLoading(false);
      setError("error::::" + error.message);
    }
  };

  return (
    <div className="sign-up_container">
      <h1>Sign Up</h1>

      <form onSubmit={handleSubmit} className="signup_form">
        <input
          type="text"
          placeholder="user name"
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
        />
        <button disabled={loading}>{loading ? "Loading.." : "Sign Up"}</button>

      </form>
      <GoogleAuth/>
      <div
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span> Sign in</span>
        </Link>
      </div>
      <p style={{ textAlign: "center" }}>{error}</p>
    </div>
  );
}
