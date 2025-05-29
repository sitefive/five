import React from 'react';
import { motion } from 'framer-motion';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const Tag: React.FC<TagProps> = ({ label, onClick, active = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        transition-colors duration-200
        ${active
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {label}
    </motion.button>
  );
};

export default Tag;