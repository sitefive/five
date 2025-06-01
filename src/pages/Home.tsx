import React from 'react';
import Hero from '../components/Hero';
import Solutions from '../components/Solutions';
import AboutSection from '../components/AboutSection';
import Cases from '../components/Cases';
import WhatsAppButton from '../components/WhatsAppButton';
import { useScrollToHash } from '../hooks/useScrollToHash';

const Home = () => {
  // Implementa o hook de scroll
  useScrollToHash();

  return (
    <main className="min-h-screen flex flex-col">
      <Hero />
      <section id="Solutions">
        <Solutions />
      </section>
      <section id="experts">
        <AboutSection />
      </section>
      <section id="cases">
        <Cases />
      </section>
      <WhatsAppButton />
    </main>
  );
};

export default Home;