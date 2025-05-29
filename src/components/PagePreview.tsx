import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PagePreviewProps {
  title: string;
  description: string;
  image: string;
  link: string;
}

const PagePreview: React.FC<PagePreviewProps> = ({ title, description, image, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50">
      <div
        className="h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={link}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
          aria-label={`Saiba mais sobre ${title}`}
        >
          Saiba mais
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default PagePreview;
