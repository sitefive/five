import React from 'react';

interface ParallaxHeaderProps {
  title: string;
  description?: string;
  image: string;
}

const ParallaxHeader: React.FC<ParallaxHeaderProps> = ({ title, description, image }) => {
  return (
    <div className="relative min-h-[400px] flex items-center">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${image})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'grayscale(100%)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 opacity-90" />
      </div>

      <div className="container mx-auto px-4 z-10 mt-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-blue-100 max-w-2xl">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParallaxHeader;