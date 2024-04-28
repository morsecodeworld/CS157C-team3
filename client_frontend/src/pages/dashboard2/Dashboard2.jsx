import React from "react";
import Layout from "../../components/Layout";
import DashboardGrid from "../../components/DashboardGrid";
import RecentStock from "../../components/RecentStock";

function Dashboard2 () {
  return (
    <Layout>    
        <div className="flex flex-col gap-5">
           <DashboardGrid/>   
           <RecentStock />   
          <div className="flex flex-row gap-4 w-full">                    
          </div>
        </div>  
    </Layout>
  );
};

export default Dashboard2;
