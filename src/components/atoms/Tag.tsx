import React from 'react';
import { motion } from 'framer-motion';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean; // A prop 'active' é mantida caso você a use em outro lugar
}

const Tag: React.FC<TagProps> = ({ label, onClick }) => {
  // O componente agora é um 'span' simples, pois não é mais clicável.
  // A classe 'sr-only' o torna visualmente invisível, mas acessível para SEO.
  return (
    <span
      onClick={onClick}
      className="sr-only" 
    >
      {label}
    </span>
  );
};

export default Tag;