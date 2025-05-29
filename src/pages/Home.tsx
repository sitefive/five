import React from 'react';
import Hero from '../components/Hero';
import Solutions from '../components/Solutions';
import AboutSection from '../components/AboutSection';
import Cases from '../components/Cases';
import WhatsAppButton from '../components/WhatsAppButton';

const Home = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <Solutions />
      <AboutSection />
      <Cases />
      <WhatsAppButton />
    </main>
  );
};

export default Home;