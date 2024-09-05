import {React,useState} from 'react'
import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {signInStart, signInSuccess, signInFailure} from '../../redux/user/userSlice';
import GoogleAuth from '../../components/gAuth/googleAuth';


export default function SignIn() {
  const [formData, setFormData] = useState({});
  // const [error, setError] = useState();
  // const [loading, setLoading] = useState(false);
  const {loading,error} = useSelector((state) => state.user);

  const nevigate = useNavigate();
  const dispatch=useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/broker/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSuccess(data));
      nevigate("/");
    }catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="signIn-container">
      <h1>Sign In</h1>

      <form onSubmit={handleSubmit} className="signin_form">
        
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
        <button disabled={loading}>{loading ? "Loading.." : "Login"}</button>

       
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
        <p>Don't have an account!</p>
        <Link to="/sign-up">
          <span> Sign up</span>
        </Link>
      </div>
      <p style={{ textAlign: "center" }}>{error}</p>
    </div>
  );
}

