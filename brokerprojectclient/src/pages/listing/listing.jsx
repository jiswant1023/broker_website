import React, { useState } from "react";
import "./listing.css";
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import { app } from "../../firebase.js";

const Listing = () => {
  const [files, setImgFiles] = useState([]);
  const [message, setMessage]= useState([]);
  

  const uploadImageFiles = (e) => {
    if (files.length > 0 && files.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
     
    }else{
        setMessage("Max 6 file can be selected!");
    }
  };

  const storeImage = async (file) => {
    console.log(file);
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      console.log(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
           // console.log(`Upload is ${progress}% done`);
            setMessage("Upload details: "+Math.round(progress)+"%");
            if(progress==100){
                setMessage("Image uploaded successfully"); 
            }
          },
        (error) => {
          // Handle unsuccessful uploads
          //console.error('Upload failed:', error);
          reject(error);
          setMessage("Fail to upload");
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
           // console.log("downloadurl");
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <div className="container">
      <h1>Create details of your house!</h1>
      <form>
        <div className="sub-container">
          <div className="details-container">
            <input type="text" placeholder="name" id="name" />
            <input type="text" placeholder="description" id="description" />
            <input type="text" placeholder="Adrress" id="address" />

            <div className="checkbox-container">
              <div className="checkbox">
                <input type="checkbox" id="sell" /> <span>Sell</span>
              </div>
              <div className="checkbox">
                <input type="checkbox" id="rent" /> <span>Rent</span>
              </div>
              <div className="checkbox">
                <input type="checkbox" id="parking-spot" />{" "}
                <span>Parking-spot</span>
              </div>
              <div className="checkbox">
                <input type="checkbox" id="furnished" /> <span>Furnished</span>
              </div>
              <div className="checkbox">
                <input type="checkbox" id="offer" /> <span>Offer</span>
              </div>
            </div>

            <div className="input-container">
              <div className="input">
                <input type="text" id="beds" />
                <span>Beds</span>
              </div>
              <div className="input">
                <input type="text" id="baths" />
                <span>Baths</span>
              </div>
              <div className="input">
                <input type="text" id="price" />
                <span>Regural Price</span>
              </div>
              <div className="input">
                <input type="text" id="discount-price" />
                <span>Discount Price</span>
              </div>
            </div>
          </div>
          <div className="img-container">
            <input
              onChange={(e) => setImgFiles(e.target.files)}
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button type="button" onClick={uploadImageFiles}>
              Upload
            </button>
            <p>{message}</p>
            <p>Images: The first image will be the cover (max 6)</p>
          </div>
        </div>
        <button
          style={{
            color: "white",
            width: "100%",
            height: "30px",
            backgroundColor: "rgb(08, 26, 26)",
            borderRadius: "10px",
          }}
        >
          CREATE LISTING
        </button>
      </form>
    </div>
  );
};

export default Listing;
