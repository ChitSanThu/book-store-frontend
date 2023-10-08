import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../../global/api";

const LoginForm = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState(null); // State variable for error message

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      API.post("/login",formData).then(res=>{

        const token = res?.data?.token;
  
        if (token) {
          Cookies.set("token", token);
          nav("/");
        }
      }).catch(err=>console.log(err))

    } catch (error) {
      console.log(error);
      setErrorMessage("*Invalid email or password");
    }
  };

  return (
    <div className="p-10 bg-primary rounded-md min-w-[400px]">
      <h1 className="text-2xl text-white text-center mb-5">Blog Management</h1>
      {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-white font-semibold">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-3 py-3 rounded-md outline-none"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-white font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="pl-3 py-3 rounded-md outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-secondary text-white font-semibold text-center py-3 rounded-md hover:bg-secondary/60"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
