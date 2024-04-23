import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import "./App.css";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/register/RegisterPage";
import LoginPage from "./pages/login/LoginPage";
import ProfilePage from "./pages/profile/ProfilePage";
import AboutPage from "./pages/about/About";
import ContactPage from "./pages/contact/Contact";
import PricingPage from "./pages/pricing/Pricing";
import FAQPage from "./pages/faq/Faq";

import Dashboard2Page from "./pages/dashboard2/Dashboard2";
import FAQSupportPage from "./pages/faq_support/faq_support";
import ManageStocksPage from "./pages/manage_stocks/Manage_stocks";
import AddProductPage from "./pages/add_product/Add_product";
import Account from "./pages/account/Account";
import ManageStocksEditPage from "./pages/manage_stocks_edit_product/Manage_stocks_edit_product";


// admin
import Home from "./admin/pages/Home";

function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<HomePage />} />
        {/* admin routes */}
        <Route path="/dashboard" element={<Home />} />

        <Route path="/dashboard2" element={<Dashboard2Page /> } />
        <Route path="/faq_support" element={<FAQSupportPage />} />
        <Route path="/manage_stocks" element={<ManageStocksPage />} />
        <Route path="/manage_stocks_edit_product/:productID" element={<ManageStocksEditPage />} />
        <Route path="/add_product" element={<AddProductPage/>} />
        <Route path="/account" element={<Account/>} />

      </Routes>
      <Toaster />
    </div>
  );
}

export default App;