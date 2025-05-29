import React from 'react';
import { Search } from 'lucide-react';

const categories = [
  { name: 'Transformação Digital', count: 5 },
  { name: 'Gestão', count: 7 },
  { name: 'Inovação', count: 3 },
  { name: 'Liderança', count: 2 },
];

const Sidebar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="w-full md:w-1/4 bg-white p-6 rounded-xl shadow-lg">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Pesquisar</h3>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Pesquisar postagens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute top-3 right-3 text-gray-500" />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Categorias</h3>
        <ul>
          {categories.map((category, index) => (
            <li key={index} className="mb-3">
              <a href="#" className="text-blue-600 hover:text-blue-800">
                {category.name} ({category.count})
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Mais Recentes</h3>
        <ul>
          {/* Aqui você pode pegar posts reais */}
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:text-blue-800">Post 1</a>
          </li>
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:text-blue-800">Post 2</a>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Mais Vistos</h3>
        <ul>
          {/* Aqui você pode pegar posts mais populares */}
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:text-blue-800">Post Popular 1</a>
          </li>
          <li className="mb-3">
            <a href="#" className="text-blue-600 hover:text-blue-800">Post Popular 2</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
