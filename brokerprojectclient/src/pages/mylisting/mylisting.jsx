import { useSelector } from 'react-redux'
import React, { useState, useEffect } from 'react';
import './mylisting.css'
import {Link} from 'react-router-dom'



const Mylisting = () => {
const [showListingError, setShowListingError]= useState(false);

const {currentUser}= useSelector((state) => state.user);
const [userlistingData, setUsertListingData] = useState({});


  
useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch(`/broker/user/getlisting/${currentUser.rest._id}`);
      const data = await res.json();
      
      if (data.success === false) {
        setShowListingError(data.message);
        return;
      }
      
      setShowListingError(false);
      setUsertListingData(data);
    
    } catch (error) {
      setShowListingError(error.message+"kjgjkgg");
    }
  };

   
     fetchData();
   
}); 



  return (
    <div  className='userList_Container'>
       {showListingError && <p>{showListingError}</p>}

       {userlistingData && userlistingData.length>0 && 
       userlistingData.map((list)=>(
        <div key={list._id} className='listing_container'>
          <Link to={`/mylisting/${list._id}`}>
          <img src={list.imageUrls[0]} alt="image" />
          </Link>
          <p>{list.description}</p>
          <button>Delete</button>
        </div>
       ))}
    </div>
  )
}

export default Mylisting
