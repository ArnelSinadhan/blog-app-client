import React, { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      fetchUserData(); // Fetch user data if token exists
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    fetchUserData(); // Fetch user data after login
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
  };

  const fetchUserData = () => {
    fetch(`${import.meta.env.VITE_API_URL}/users/getProfile`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error === "User not found") {
          Swal.fire({
            title: "Error",
            icon: "error",
            text: "User Not Found",
          });
        } else {
          setUser(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        Swal.fire({
          title: "Error",
          icon: "error",
          text: "An error occurred while fetching user data.",
        });
      });
  };

  return (
    <UserContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </UserContext.Provider>
  );
};
