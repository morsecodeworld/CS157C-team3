import React from "react";
import HeaderDashboard from "./Header_dashboard";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div>        
          <HeaderDashboard />
         
          {children}  
          <Footer />
    </div>
  );
};

export default Layout;
