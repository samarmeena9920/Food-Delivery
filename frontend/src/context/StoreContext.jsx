import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
export const StoreContext = createContext(null);

//creating a provider function to provide the context to the components
const StoreContextProvider = (props) => {
    // crating a state variable
    const [cartItems, setCartItems] = useState({});
    //
    const url = "https://susangat-food-del-backend.onrender.com"; // Updated URL for production

    // token for authentication, initially set to null or from localStorage 
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    //creating a function to fetch food list from the server rather than using a static file ( assets.js)
    const [food_list, setFoodList] = useState([]);


    const addToCart = async (itemId) => {
        //if the item is not in the cart, add it with quantity 1
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
        } else {
            //if the item is already in the cart, increase the quantity by 1
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
        }
        //if token is present, make a post request to add the item to the cart in the backend
        if (token) {
            const response = await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            if (response.data.success) {
                toast.success("item Added to Cart")
            } else {
                toast.error("Something went wrong")
            }
        }
    };


    const removeFromCart = async (itemId) => {
        //if the item is in the cart, decrease the quantity by 1
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

        //if the user login token is present, make a post request to remove the item from the cart in the backend
        if (token) {
            const response = await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            if (response.data.success) {
                toast.success("item Removed from Cart")
            } else {
                toast.error("Something went wrong")
            }
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                totalAmount += itemInfo.price * cartItems[item];
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        // Fetching the food list from the server
        const response = await axios.get(url + "/api/food/list");
        if (response.data.success) {
            setFoodList(response.data.data);
        } else {
            alert("Error! Products are not fetching..");
        }
    };

    // Function to load cart data from the server so that it can be displayed in the cart when reload also 
    const loadCardData = async (token) => {
        const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
        //storing the cart data in the state setCartItems 
        setCartItems(response.data.cartData);
    };

    // useEffect to check if the token is present in localStorage and set it in the state
    //to avoid the user being logged out on page refresh and let the token remain store in localstorage if refresh
    useEffect(() => {
        // load the food list from server and check for token on component mount
        async function loadData() {
            await fetchFoodList();
            // Check if token is present in localStorage
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                // If token is present in local storage, load cart data from the server even on page refresh
                await loadCardData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, []);



    // any value added in this obj is accessible in the components that consume this context
    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
