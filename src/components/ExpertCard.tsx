import React from 'react';

interface ExpertCardProps {
  name: string;
  role: string;
  image: string;
  skills: string[];
  bio: string;
  linkedin: string;
  email: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ name, role, image, skills, bio, linkedin, email }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-gray-50">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-lg mb-4 transition-all duration-300 transform group-hover:scale-110"
      />
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-lg text-gray-600 mb-2">{role}</p>
      <p className="text-gray-600 mb-4">{bio}</p>
      <div className="mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Habilidades:</h4>
        <ul className="list-disc pl-5 text-gray-600">
          {skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
      <div className="flex space-x-4 mt-4">
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
        >
          LinkedIn
        </a>
        <a href={`mailto:${email}`} className="text-blue-500 hover:text-blue-700 transition-colors duration-300">
          Email
        </a>
      </div>
    </div>
  );
};

export default ExpertCard;
