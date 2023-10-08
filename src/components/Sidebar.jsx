import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { BiHome } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { LuClipboardList } from "react-icons/lu";
import { FaRegAddressBook } from "react-icons/fa6";
const Sidebar = () => {
  const sideNav = [
    {
      id: 1,
      title: "Dashboard",
      path: "/",
      icon: <BiHome />,
    },
    {
      id: 2,
      title: "Category",
      path: "categories",
      icon: <MdOutlineMail />,
    },
    {
      id: 3,
      title: "Book List",
      path: "books",
      icon: <MdOutlineMail />,
    },
    {
      id: 4,
      title: "Sale Record",
      path: "sales",
      icon: <LuClipboardList />,
    },
    {
      id: 5,
      title: "Customer Record",
      path: "customers",
      icon: <FaRegAddressBook />,
    },

  ];
  const nav = useNavigate();

  const Handler = () => {
    Cookies.remove("token");
    nav("/login");
  };
  return (
    <div className="h-[100vh] w-[25%] xl:w-[20%] bg-primary overflow-hidden overflow-y-scroll scrollbar-none  rounded-lg ">
      <div className="h-full p-3 flex flex-col justify-between">
        {/* Top Part */}
        <div>
          {/* Logo */}
          <div className="flex  items-center justify-center text-white text-4xl">
            Book Store
          </div>
          <div className="flex  items-center justify-center text-white text-4xl">
            Management
          </div>

          {/* Link */}
          <div className="flex flex-col gap-3 my-5">
            {sideNav.map((el) => {
              return (
                <NavLink
                  key={el.id}
                  to={el.path}
                  className="flex text-xl hover:bg-gray-50 hover:text-secondary transition duration-100 rounded-2xl items-center pl-6 py-3 gap-3 text-slate-200"
                >
                  {el.icon}
                  <h1 className="text-lg">{el.title}</h1>
                </NavLink>
              );
            })}
          </div>
          
        </div>

        {/*  */}
        <div
          onClick={() => Handler()}
          className="flex cursor-pointer justify-center items-center py-2 my-5 gap-2 text-[#E93C3C] border border-transparent hover:border-[#E93C3C] rounded-xl text-xl"
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
