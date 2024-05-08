import React, { useEffect } from 'react';
import Layout from "../../components/Layout";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from "react-hot-toast";

const baseUrl = 'http://localhost:5000/api/products'; 

const fetchProduct = async (id) => {
    const { data } = await axios.get(`${baseUrl}/${id}`);
    return data;
};

const updateProduct = async (productData) => {
    const response = await axios.put(`${baseUrl}/${productData.id}`, productData);
    return response.data;
};

const Manage_stocks_edit_product = () => {
    const { id } = useParams(); // Get the product ID from URL parameters
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm({
        mode: "onChange",
    });

    // Fetch product details and initialize the form
    const { data: product, isLoading: isProductLoading } = useQuery(['product', id], () => fetchProduct(id), {
        onSuccess: (data) => reset(data) // Reset form with fetched product data
    });

    // Mutation to update the product
    const { mutate, isLoading } = useMutation(updateProduct, {
        onSuccess: () => {
            toast.success("Product updated successfully!");
            navigate("/products"); // Redirect to products page
        },
        onError: (error) => {
            toast.error(`Failed to update product: ${error.response.data.message}`);
        }
    });

    const submitHandler = (data) => {
        mutate({ ...data, id });
    };

    if (isProductLoading) return <p>Loading...</p>;

    return (
        <Layout>
            <section className="container mx-auto px-5 py-10">
                <div className="w-full max-w-xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8">Edit Product</h1>
                    <form onSubmit={handleSubmit(submitHandler)}>
                        {/* Product Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                                Product Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                {...register("name", { required: "Product name is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        {/* Brand */}
                        <div className="mb-4">
                            <label htmlFor="brand" className="block text-gray-700 font-bold mb-2">
                                Brand
                            </label>
                            <input
                                type="text"
                                id="brand"
                                {...register("brand", { required: "Brand is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label htmlFor="category" className="block text-gray-700 font-bold mb-2">
                                Category
                            </label>
                            <input
                                type="text"
                                id="category"
                                {...register("category", { required: "Category is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                            <label htmlFor="price" className="block text-gray-700 font-bold mb-2">
                                Price
                            </label>
                            <input
                                type="number"
                                id="price"
                                {...register("price", { required: "Price is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                        </div>

                        {/* Stock */}
                        <div className="mb-4">
                            <label htmlFor="stock" className="block text-gray-700 font-bold mb-2">
                                Quantity
                            </label>
                            <input
                                type="number"
                                id="stock"
                                {...register("stock", { required: "Quantity is required" })}
                                className="input input-bordered w-full max-w-xs"
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValid || isLoading}
                            className="btn btn-primary mt-4"
                        >
                            Update Product
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
};

export default Manage_stocks_edit_product;
