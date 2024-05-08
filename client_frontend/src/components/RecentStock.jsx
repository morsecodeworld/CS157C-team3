import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';


//make a request from server
import axios from 'axios';

const RecentStock = () => {
  
     // use React useState hook to managee state within functional component
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
     
      //To arrange the columns of a table. Each object in the array shows one column 
      //in the grid displayed. 
  const columns = [
    { field: 'id', headerName: 'No', width: 10 },
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
  ];

  return (    
      <section className="container mx-auto px-5 mt-25 mb-20">
        <div className="flex justify-center items-center">

          <div className="mt-10 md:mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Recent Stock</h2>
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
              />            
            </p>
          </div>
        </div>       
      </section>  
  );
};

export default RecentStock;
