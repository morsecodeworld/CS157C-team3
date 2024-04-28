
import { images } from "../../constants";
import React from 'react'
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";

const Account = () => {
const dispatch = useDispatch();
const { mutate, isLoading } = useMutation({
  mutationFn: ({ username, password, email, firstname, lastname, phonenumber, city }) => {
    return signup({ username, password, email, firstname, lastname, phonenumber, city });
  },
  onSuccess: (data) => {
    dispatch(userActions.setUserInfo(data));
    localStorage.setItem("account", JSON.stringify(data));
  },
  onError: (error) => {
    toast.error(error.message);
    console.log(error);
  },
});

const {
  register,
  handleSubmit,
  formState: { errors, isValid },

} = useForm({
  defaultValues: {
    username: "",
    password: "",
    email: "",
    firstname: "",
    lastname: "",   
    phonenumber: "",
    city: "",
  },
  mode: "onChange",
});

const submitHandler = (data) => {
  const { username, password, email, firstname, lastname, phonenumber, city } = data;
  mutate({ username, password, email, firstname, lastname, phonenumber, city });
};


  return (
    <Layout>       
    <section className="container mx-auto px-5 text-lg">
            <div className="container my-24 mx-auto md:px-6">
                
                <div className="grid gap-4 md:grid-cols-2 shadow-lg">
                <section className="container mx-auto px-5 py-10">
                    <div className="mb-6 md:mb-0 ">
                         <div className="w-full max-w-sm mx-auto">
                        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                            User Info
                        </h2>

                            <div className="w-full object-cover rounded-sm flex justify-center items-center">
                                        <img
                                        className=" object-cover rounded-full h-40 w-40 mb-10"
                                        src={images.UserMarioImage}
                                        alt="Inventory Management"
                                        />                        
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium ">User Name: </span>
                            <span className="text-left text-gray-800 text-2xl px-3 font-light">mario2024</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">Password: </span>
                            <span className="text-left text-2xl px-3 font-light">password</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">Email: </span>
                            <span className="text-left text-2xl px-3 font-light">mario2024@gmail.com</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">First Name: </span>
                            <span className="text-left text-2xl px-3 font-light">Mario</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">Last Name: </span>
                            <span className="text-left text-2xl px-3 font-light">Mario</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">Phone Number: </span>
                            <span className="text-left text-2xl px-3 font-light">+836 253 8732</span>
                            </div>

                            <div className="text-left font-semibold mb-6 md:mb-6">
                            <span className="text-[#5a7184] text-right text-2xl italic font-medium">City: </span>
                            <span className="text-left text-2xl px-3 font-light">San Jose</span>
                            </div>

                        </div>
                        </div>
                    </section>

                        <div className="mb-6 md:mb-0 shadow-lg">                    
                        
                        <section className="container mx-auto px-5 py-10">
                            <div className="w-full max-w-sm mx-auto">
                            <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
                                Edit user's info:
                            </h1>
                            <form onSubmit={handleSubmit(submitHandler)}>

                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="username"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    {...register("username", {
                                    required: {
                                        value: true,
                                        message: "User name is required",
                                    },
                                    })}
                                    placeholder="Enter the user name"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.username ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.username?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.username?.message}
                                    </p>
                                )}
                                </div>

                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="password"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    Password 
                                </label>
                                <input
                                    type="text"
                                    id="password"
                                    {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Password is required",
                                    },
                                    })}
                                    placeholder="Enter the password"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.password ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.password?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.password?.message}
                                    </p>
                                )}
                                </div>


                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="email"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    Email 
                                </label>
                                <input
                                    type="text"
                                    id="email"
                                    {...register("email", {
                                    required: {
                                        value: true,
                                        message: "email is required",
                                    },
                                    })}
                                    placeholder="Enter the email"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.email ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.email?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.email?.message}
                                    </p>
                                )}
                                </div>

                                
                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="firstname"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    First Name 
                                </label>
                                <input
                                    type="text"
                                    id="firstname"
                                    {...register("firstname", {
                                    required: {
                                        value: true,
                                        message: "First Name is required",
                                    },
                                    })}
                                    placeholder="Enter your first name"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.firstname ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.firstname?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.firstname?.message}
                                    </p>
                                )}
                                </div>


                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="lastname"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    Last Name 
                                </label>
                                <input
                                    type="text"
                                    id="lastname"
                                    {...register("lastname", {
                                    required: {
                                        value: true,
                                        message: "Last Name is required",
                                    },
                                    })}
                                    placeholder="Enter your last name"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.lastname ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.lastname?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.lastname?.message}
                                    </p>
                                )}
                                </div>

                                
                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="phonenumber"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    Phone Number 
                                </label>
                                <input
                                    type="number"
                                    id="phonenumber"
                                    {...register("phonenumber", {
                                    required: {
                                        value: true,
                                        message: "Quantity is required",
                                    },
                                    })}
                                    placeholder="Enter the phone number"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.phonenumber ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.phonenumber?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.phonenumber?.message}
                                    </p>
                                )}
                                </div>

                                <div className="flex flex-col text-left mb-3 w-full">
                                <label
                                    htmlFor="city"
                                    className="text-[#5a7184] font-semibold block"
                                >
                                    City 
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    {...register("city", {
                                    required: {
                                        value: true,
                                        message: "City is required",
                                    },
                                    })}
                                    placeholder="Enter the city you live"
                                    className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                                    errors.city ? "border-red-500" : "border-[#c3cad9]"
                                    }`}
                                />
                                {errors.city?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.city?.message}
                                    </p>
                                )}
                                </div>


                                <div className="flex flex-col text-left mb-10 w-full">
                                <label
                                    htmlFor="images"
                                    className="text-[#5a7184] font-semibold block ">
                                    Image 
                                </label>
                                <input
                                    type="Array"
                                    id="image"
                                    {...register("image", {
                                    required: {
                                        value: true,
                                        message: "Image is required",
                                    },
                                    })}       
                                
                                />
                                    <div className="text-[#5a7184] font-semibold block mb-0">
                                        <label htmlFor="file"></label>
                                        <input type="file" id="file" />
                                    </div>
                                    
                                {errors.image?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                    {errors.image?.message}
                                    </p>
                                )}
                                </div>
                            
                            

                                <button
                                type="save"
                                disabled={!isValid || isLoading}
                                className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                Update
                                </button>
                                <p className="text-sm font-semibold text-[#5a7184]">
                                Any questions?{" "}
                                <Link to="/login" className="text-primary">
                                    
                                </Link>
                                </p>
                            </form>
                            </div>
                        </section>
                            
                    

                    </div>
                </div>
            </div>
        
  </section>        
</Layout>
  );
};

export default Account;
