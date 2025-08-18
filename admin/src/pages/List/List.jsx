import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const List = ({ url }) => {
  const navigate = useNavigate();
  const { token, admin } = useContext(StoreContext);

  useEffect(() => {
    if (!admin || !token) {
      navigate("/");
    }
  }, [admin, token, navigate]);

  //declaration of state variables for managing the food list
  const [list, setList] = useState([]);

  // Fetching the list of food items from the server
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

  // useEffect to fetch the list when the component mounts
  useEffect(() => {
    fetchList();
  }, []);


  // async function to remove a food item from the list
  // It sends a POST request to the server with the food ID to be removed
  // After the request, it fetches the updated list and shows a success or error message
  const removeFood = async (foodId) => {
    // doing the api call to remove the food item
    const response = await axios.post(
      `${url}/api/food/remove`,
      { id: foodId },
      { headers: { token } }
    );
    // After the food item is removed, fetch the updated list
    await fetchList();
    if (response.data.success) {
      toast.success(response.data.message);
    } else {
      toast.error("Error");
    }
  };

  useEffect(() => {
    // if (!admin && !token) {
    //   toast.error("Please Login First");
    //   navigate("/");
    // }
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {/*map traverses and display the data */}
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              {/* to extract image using the url for preview */}
              <img src={`${url}/images/` + item.image} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
