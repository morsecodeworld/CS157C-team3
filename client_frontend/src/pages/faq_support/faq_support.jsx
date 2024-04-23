import React from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { images } from "../../constants";

const FAQ_support = () => {
  return (
    <Layout>
      <section className="container mx-auto px-5 text-lg">
        <div className="container my-24 mx-auto md:px-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="mb-6 md:mb-0">
              <h2 className="mb-6 text-3xl font-bold text-gray-800">
                Frequently asked questions
              </h2>

              <p className="text-neutral-500 dark:text-neutral-300 ">
                Didn't find your answer in the FAQ?
                <Link
                  to="/contact"
                  className="text-primary ml-3 transition duration-300 hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                >
                  Contact our sales team
                </Link>
                .
              </p>
              <img
                className="w-full"
                src={images.AboutImage}
                alt="Inventory Management"
              />
            </div>

            <div className="mt-20 mb-6 md:mb-0 items-center">

              <p className="mb-4 font-medium"> 
                Getting Started Guides
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-semibold">
                 FAQs (Frequently Asked Questions)
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-semibold">
                Troubleshooting Tips                         
                </p>
              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                Product Updates and Release Notes               
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                 User Community and Forum
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                 Security and Privacy Information
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                Technical Support
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                Feedback and Suggestions
              </p>

              <p className="mb-5 text-neutral-500 dark:text-neutral-300"> </p>

              <p className="mb-4 font-medium">
                Report a Problem     
              </p>

            </div>
          </div>
        </div>
      
      </section>
    </Layout>
  );
};

export default FAQ_support;
