import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import DashboardGrid from "../../components/DashboardGrid";
import RecentStock from "../../components/RecentStock";

//make a request from server
import axios from 'axios';


function Dashboard2 () {
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


  return (
    <Layout>    
        <div className="flex flex-col gap-5">
           <DashboardGrid product={data[0]}  />   
           <RecentStock product={data[0]} />   
          <div className="flex flex-row gap-4 w-full">                    
          </div>
        </div>  
    </Layout>
  );
};

export default Dashboard2;
