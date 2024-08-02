import React from "react";
import './googleAuth.css'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {app} from '../../firebase.js';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";




export default function GoogleAuth() {
   const navigate=useNavigate();
    const dispatch=useDispatch();

    const handleGoogleClick=async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth=getAuth(app);

            const result=await signInWithPopup(auth,provider);
            //console.log(result);

            const res=await fetch('/broker/auth/google', {
                method:'POST',
                headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            })

            const data= await res.json();
            dispatch(signInSuccess(data));
            navigate('/');

        } catch (error) {
            console.log('could not sign in with google',error);
        }
    }


    return (
        <button onClick={handleGoogleClick} className="googleButton">Sing in with Google!</button>
    )
}

