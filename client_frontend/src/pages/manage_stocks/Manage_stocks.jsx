import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { DataGrid } from '@mui/x-data-grid';
import { Link } from "react-router-dom";
import axios from 'axios';

const Manage_stocks = () => {
      
  const [data, setData] = useState([])

  useEffect(() => {
    axios.
      get('/api/products')
      .then((response) => {
        setData(response.data.products);
      })
      .catch((error) =>  {
        console.error('Error fetching data:', error);
    });
  }, []);

      //pass the id to deleteFunciton and filter the prodcut Data with the specific id
      const deleteFunction = (id) => {
        setData(data.filter(productItem=>productItem.id !== id))
      };

      //To arrange the columns of a table. Each object in the array shows one column 
      //in the grid displayed. 
  const columns = [
    { field: 'id', headerName: 'No', width: 70 },
    { field: 'productname', headerName: 'Product Name', width: 450 },
    { field: 'brand', headerName: 'Brand', width: 150 },
    { field: 'category', headerName: 'Category', width: 130 },
    {
      field: 'price',
      headerName: 'Price',
      type: 'number',
      width: 120,
    },

    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 120,
    },

    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 120,
    },

    {
      field: 'action ',
      headerName: 'Action',     
      width: 90, 
      description: 'This column is not sortable.',
      sortable: false,
      renderCell: (params)=>{
          return(   
             <Link to={"/manage_stocks_edit_product/"+params.row.id}>         
              <button className="bg-blue-500 text-white font-light text-sm py-2 px-3 w-full rounded-lg 
              mb-6 disabled:opacity-20 disabled:cursor-not-allowed"> Edit   </button>    
              </Link>  
          )
      }      
    },

    {
      field: 'action2 ',
      headerName: 'Action',     
      width: 100, 
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      renderCell: (params)=>{
          return(             
              <button className="bg-rose-700 text-white font-light text-sm py-2 px-3 w-full rounded-lg 
              mb-6 disabled:opacity-20 disabled:cursor-not-allowed" onClick={()=>deleteFunction(params.row.id)}> Delete   </button>     
          )
      }      
    },
  ];

  return (
    <Layout>
      <section className="container mx-auto px-5 mt-25 mb-20">
        <div className="flex justify-center items-center">

          <div className="mt-10 md:mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Stock Management</h2>
            <p className="text-gray-600 text-lg">
     
            <DataGrid          
        rows={data.map(product => ({
          id: product._id,
          productname: product.product_name, 
          brand: product.brand,
          category: product.category,
          price: product.price,
          quantity: product.quantity,
          amount: product.amount
        }))}


        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
            
            </p>
          </div>
        </div>
       
      </section>
    </Layout>
  );
};

export default Manage_stocks;
