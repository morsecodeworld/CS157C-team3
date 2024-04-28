import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import Layout from "../../components/Layout";
import { signup } from "../../services/index/users";
import { userActions } from "../../store/reducers/userReducers";


const Add_product = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ name, brand, category, price, stock, image }) => {
      return signup({ name, brand, category, price, stock, image });
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

  useEffect(() => {
    if (userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
   // watch,
  } = useForm({
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      image: "",
    },
    mode: "onChange",
  });

  const submitHandler = (data) => {
    const { name, brand, category, price, stock, image } = data;
    mutate({ name, brand, category, price, stock, image  });
  };

  //const password = watch("password");

  return (
    <Layout>
      <section className="container mx-auto px-5 py-10">
        <div className="w-full max-w-sm mx-auto">
         <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            
            Add a product
          </h1>
          <form onSubmit={handleSubmit(submitHandler)}>


            <div className="flex flex-col text-left mb-6 w-full">
              <label
                htmlFor="name"
                className="text-[#5a7184] font-semibold block"
              >
                Product Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name", {
                  required: {
                    value: true,
                    message: "Product name is required",
                  },
                })}
                placeholder="Enter product name"
                className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                  errors.name ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col text-left mb-6 w-full">
              <label
                htmlFor="brand"
                className="text-[#5a7184] font-semibold block"
              >
                Brand 
              </label>
              <input
                type="text"
                id="brand"
                {...register("brand", {
                  required: {
                    value: true,
                    message: "Product brand is required",
                  },
                })}
                placeholder="Enter the brand"
                className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                  errors.name ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>


            <div className="flex flex-col text-left mb-6 w-full">
              <label
                htmlFor="category"
                className="text-[#5a7184] font-semibold block"
              >
                Category 
              </label>
              <input
                type="text"
                id="category"
                {...register("category", {
                  required: {
                    value: true,
                    message: "Category is required",
                  },
                })}
                placeholder="Enter the category"
                className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                  errors.name ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

              
            <div className="flex flex-col text-left mb-6 w-full">
              <label
                htmlFor="price"
                className="text-[#5a7184] font-semibold block"
              >
                Price 
              </label>
              <input
                type="number"
                id="price"
                {...register("price", {
                  required: {
                    value: true,
                    message: "Price is required",
                  },
                })}
                placeholder="Enter the price"
                className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                  errors.name ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>
            
            <div className="flex flex-col text-left mb-6 w-full">
              <label
                htmlFor="stock"
                className="text-[#5a7184] font-semibold block"
              >
                Quantity 
              </label>
              <input
                type="number"
                id="stock"
                {...register("stock", {
                  required: {
                    value: true,
                    message: "Quantity is required",
                  },
                })}
                placeholder="Enter the quantity"
                className={`placeholder:text-[#959ead] text-dark-hard mt-1 rounded-lg px-5 py-2 block outline-none border ${
                  errors.name ? "border-red-500" : "border-[#c3cad9]"
                }`}
              />
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>

            <div className="flex flex-col text-left mb-10 w-full">
              <label
                htmlFor="images"
                className="text-[#5a7184] font-semibold block">
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
                <div className="text-[#5a7184] font-semibold block">
                    <label htmlFor="file"></label>
                    <input type="file" id="file" />
                 </div>
                 
              {errors.name?.message && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name?.message}
                </p>
              )}
            </div>
          
           

            <button
              type="save"
              disabled={!isValid || isLoading}
              className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Save
            </button>
            <p className="text-sm font-semibold text-[#5a7184]">
              Any questions?{" "}
              <Link to="/login" className="text-primary">
                
              </Link>
            </p>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Add_product;
