import React, { useEffect, useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import {useNavigate } from "react-router-dom";

const Add = ({ url }) => {
  const navigate=useNavigate();
  const {token,admin} = useContext(StoreContext);

  useEffect(() => {
    console.log("Add page - admin:", admin, "token:", token);
    if (!admin || !token) {
      console.log("Redirecting to login - admin:", admin, "token:", !!token);
      navigate("/");
    }
  }, [admin, token, navigate]);

  //createing a state variable
  const [image, setImage] = useState(false);
  //createing a state variable to store data
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Salad",
  });

  // extracting the name and value from the input field 
  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  //whenever the data changes, this useEffect will run and log the data
  useEffect(() => {
    console.log(data);
  }, [data]);


  //to make the api call to add the food item
  const onSubmitHandler = async (event) => {
    //this will prevent the reload
    event.preventDefault();
    // creating a form data object to send the data in form
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("image", image);

    //making the api call to add the food item
    //using axios to post the data to the server
    //the url is the endpoint of the server where we want to send the data
    //the headers are the token that we will send to the server to authenticate the user
    const response = await axios.post(`${url}/api/food/add`, formData,{headers:{token}});
    if (response.data.success) {
      setData({
        name: "",
        description: "",
        price: "",
        category: "Salad",
      });
      setImage(false);
      // if the success is true, we will show the success message
      // and reset the form
      // toast.success is a function from react-toastify to show the success message
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
  };

  
  // useEffect(()=>{
  //   if(!admin && !token){
  //     toast.error("Please Login First");
  //      navigate("/");
  //   }
  // },[])

  return (
    <div className="add">
      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-upload flex-col">
          <p>Upload image</p>
          <label htmlFor="image">
            {/* to create the preview of image if we have image uploaded  */}
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          {/* e.target.files open  */}
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required/>
        </div>
        <div className="add-product-name flex-col">
          <p>Product name</p>
          {/*  onChangeHandler fuction to update the data*/}
          <input onChange={onChangeHandler} value={data.name} type="text" name="name"  placeholder="Type here" required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder="Write content here" required ></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product category </p>
            <select name="category" required onChange={onChangeHandler} value={data.category} >
              <option value="Salad">Salad</option>
              <option value="Rolls">Rolls</option>
              <option value="Deserts">Deserts</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pure Veg">Pure Veg</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product price</p>
            <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder="$20" required />
          </div>
        </div>
        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
