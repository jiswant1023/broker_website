import React from "react";
import "./Profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../../redux/user/userSlice";
import {Link} from 'react-router-dom'

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const res = await fetch(`/broker/user/delete/${currentUser.rest._id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOutButton= async () => {
    try {
      dispatch(signOutUserStart());
      const res= await fetch('/broker/auth/signout');
      const data=await res.json();
      
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      console.log(data);
      dispatch(signOutUserSuccess(data));

      
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <>
      <div className="profile_container">
        <h1>Profile</h1>
        <img src={currentUser.rest.avatar} alt="profile.jpg" />
        <p>User name: {currentUser.rest.username}</p>
        <p>Email: {currentUser.rest.email}</p>
        <button>Update profile</button>
        <Link to='/listing'>
        <button>Add your listing</button>
        </Link>
        
      </div>
      <div className="profile_container_delete">
        <button onClick={handleDeleteUser}>Delete Account</button>
        <button onClick={handleSignOutButton}>Sign out</button>
      </div>
    </>
  );
}
