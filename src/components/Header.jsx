import Cookies from "js-cookie";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Header = () => {
  const username = Cookies.get("username");
  const image = Cookies.get("image");
  const [date, setDate] = useState(moment().format("llll"));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate(moment().format("llll"));
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const userData = useSelector((state) => state?.user?.user_info);
// console.log(userData)
  return (
    <div className="flex justify-between items-center text-white py-3 px-5">
      <div>
        <p>{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <h1>{userData?.data?.username}</h1>
        <div className="w-12 h-12 overflow-hidden rounded-full">
          <img src={image} alt="" className="h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export default Header;
