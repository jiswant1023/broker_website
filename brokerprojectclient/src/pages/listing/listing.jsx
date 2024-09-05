import React, { useRef, useState } from "react";
import "./listing.css";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "../../firebase.js";
import { useSelector } from "react-redux";

const Listing = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [files, setImgFiles] = useState([]);
  const [uploadImage, setUploadImage]= useState(false);
  const [message, setMessage] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 0,
    bathrooms: 0,
    prices: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError]= useState(false);
  const [loading, setLoading] =useState(false);
  const [uploadMessage, setUploadMessage] = useState(false);
  
 // console.log(currentUser.rest._id);
  

  const uploadImageFiles = (e) => {

    setUploadImage(true);
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }

      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          //console.log(urls);
          setUploadImage(false);
        })
        .catch((error) => {
          // Handle any errors that occurred during the promises
          console.error("Error fetching URLs:", error);
          setUploadImage(false);
        });
        
    } else {
      setMessage("Max 6 file can be selected!");
      setUploadImage(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setMessage("Upload details: " + Math.round(progress) + "%");
          if (progress == 100) {
            setMessage("Image uploaded successfully");
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          //console.error('Upload failed:', error);
          reject(error);
          setMessage("Fail to upload");
          setUploadImage(false);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            // console.log("downloadurl");
            resolve(downloadURL);
            //console.log("downloadUrls",downloadURL);
          });
        }
      );
    });
  };

  const handleImageDelete = async (index) => {
    console.log(index);

    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleSubmit= async (e) => {
  e.preventDefault();

  try {

    if (+formData.prices<+formData.discountPrice) {
      return setError("Discount price should not be greater than actual price");
    }

    setLoading(true);
    setError(false);

    const res= await fetch('/broker/listing/create',{
      method: 'POST',
      headers: {
        'content-type' : 'application/json',
      },
      body: JSON.stringify({...formData,
       "userRef": currentUser.rest._id,
      }),
    });

    const data= await res.json();
    //console.log(data);

    
    
    if (data.success===false) {
      setError(data.message);
      setUploadMessage(false);
      setLoading(false);
      return;
    }
    setLoading(false);
    setError(false);
    setUploadMessage("Added Successfully!");
    
  } catch (error) {
    setError(error.message);
    setUploadMessage(false);
    setLoading(false);
  }

  }

  const handleChange = (e) => {
    const { id, value, checked,type } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData({
        ...formData,
        type: id,
      });
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setFormData({
        ...formData,
        [id]: checked,
      });
    }

    if (type==='number' || type==='text' || type==='textarea') {
      setFormData({
      ...formData,
      [id]: value,
      })
    }
  };

  return (
    <div className="listing_container">
      <h1>Create details of your house!</h1>
      <form onSubmit={handleSubmit}>
        <div className="sub-container">
          <div className="details-container">
            <input
              type="text"
              placeholder="name"
              id="name"
              onChange={handleChange}
              value={formData.name}
              required
            />
            <textarea
              type="text"
              placeholder="description"
              id="description"
              onChange={handleChange}
              value={formData.description}
              required
            />
            <textarea
              type="text"
              placeholder="Address"
              id="address"
              onChange={handleChange}
              value={formData.address}
              required
            />

            

            <div className="checkbox-container">
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="sale"
                  onChange={handleChange}
                  checked={formData.type === "sale"}
                />
                <span>Sale</span>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="rent"
                  onChange={handleChange}
                  checked={formData.type === "rent"}
                />{" "}
                <span>Rent</span>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="parking"
                  onChange={handleChange}
                  value={formData.parking}
                />
                <span>Parking-spot</span>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="furnished"
                  onChange={handleChange}
                  value={formData.furnished}
                />{" "}
                <span>Furnished</span>
              </div>
              <div className="checkbox">
                <input
                  type="checkbox"
                  id="offer"
                  onChange={handleChange}
                  value={formData.offer}
                />{" "}
                <span>Offer</span>
              </div>
            </div>

            <div className="input-container">
              <div className="input">
                <input
                  type="number"
                  id="bedrooms"
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <span>Bads</span>
              </div>
              <div className="input">
                <input
                  type="number"
                  id="bathrooms"
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <span>Baths</span>
              </div>
              <div className="input price">
                <input
                  type="number"
                  id="prices"
                  onChange={handleChange}
                  value={formData.prices}
                />
                <span>Regular Price {formData.type==='rent' ? "/month" :""}</span>
              </div>
              <div className="input price">
                <input
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                  disabled={!formData.offer}
                />
                <span>Discount Price {formData.type==='rent' ? "/month" :""}</span>
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
              required
            />
            <button disabled={uploadImage} type="button" onClick={uploadImageFiles}
          >
              
              {uploadImage ? "wait...":"Upload"}
            </button>
            <p>{message}</p>
            <p>Images: The first image will be the cover (max 6)</p>

            <div className="image-container">
              {formData.imageUrls.map((url, index) => (
                <div key={url} className="each-container">
                  <img
                    key={index} // Use a unique key if possible
                    className="uploaded-images"
                    src={url}
                    alt={`img-${index}`} // Provide meaningful alt text
                  />
                  <button
                    onClick={() => handleImageDelete(index)}
                    type="button"
                  >
                    delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="create_listing_button" disabled={loading || uploadImage}
          
        >
          {loading ? "Creating....." : "Create Listing"}
        </button>

        
        {error && <p style={{color: 'red'}}> {error}</p>}
         {uploadMessage && <p style={{color: 'green'}}> {uploadMessage}</p>} 
      </form>
    </div>
  );
};

export default Listing;
