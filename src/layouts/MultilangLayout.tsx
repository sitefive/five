import React from "react";
import { Outlet, useParams } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import Header from "../components/Header";
import Footer from "../components/Footer";
import HreflangTags from "../components/seo/HreflangTags";

const MultilangLayout = () => {
  const { lang } = useParams();

  return (
    <>
      <Helmet>
        <html lang={lang} />
        <meta property="og:locale" content={lang} />
      </Helmet>
      <HreflangTags />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MultilangLayout;