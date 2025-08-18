import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(false);


  useEffect(() => {
    async function loadData() {
      console.log("StoreContext loading data...");
      if (localStorage.getItem("token")) {
        const token = localStorage.getItem("token");
        console.log("Found token in localStorage:", !!token);
        setToken(token);
      }
      if (localStorage.getItem("admin")) {
        const adminStatus = localStorage.getItem("admin");
        const isAdmin = adminStatus === "true" || adminStatus === true;
        console.log("Found admin status in localStorage:", adminStatus, "-> converted to:", isAdmin);
        setAdmin(isAdmin);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    token,
    setToken,
    admin,
    setAdmin,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
