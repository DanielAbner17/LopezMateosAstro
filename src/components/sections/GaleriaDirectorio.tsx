import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import DirectorioItem from '@components/common/DirectorioItem';
import type { Store } from 'src/data/stores';
import ToggleButton from '@components/common/ToggleButton';
import Mapa from '@images/mapa.jpg';

const CATEGORY_COLORS = {
  'Bancos y Servicios Financieros': 'bg-[#34a936]',
  'Ropa y Accesorios': 'bg-[#2ebae1]',
  'Salud y Belleza': 'bg-[#78c5b3]',
  'Servicios y Tienda departamental': 'bg-[#594d9b]',
  'Restaurantes y Alimentos': 'bg-[#e07c0d]',
  Entretenimiento: 'bg-[#e4d403]',
  Calzado: 'bg-red-500',
  Otros: 'bg-gray-500',
};

interface StoreWithImage extends Store {
  image: any;
}

interface Props {
  className: string;
  stores: StoreWithImage[];
}

const GaleriaDirectorio: React.FC<Props> = ({ className, stores }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('tiendas');

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedCategory(event.target.value);
  };

  /*
    Handles the change event of the search input field.
    Updates the search query state with the lowercase value of the input.
   
    @param event - The change event object.
   */

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const fuseOptions = {
    includeScore: true,
    threshold: 0.4,
    // Ajusta las keys según las propiedades de tus objetos Store
    keys: ['title'],
  };

  const fuse = useMemo(() => new Fuse(stores, fuseOptions), [stores]);

  /*
   Returns the filtered stores based on the search query and selected category.
   If no search query is provided and the selected category is 'Todos', it returns all stores.
   Otherwise, it performs a search using Fuse.js library and filters the results based on the selected category.
   
   @param {string} searchQuery - The search query entered by the user.
   @param {string} selectedCategory - The selected category to filter the stores.
   @param {Array<Store>} stores - The array of all stores.
   @param {Fuse} fuse - The Fuse.js instance used for searching.
   @returns {Array<Store>} - The filtered stores based on the search query and selected category.
   */

  const filteredStores = useMemo(() => {
    if (!searchQuery && selectedCategory === 'Todos') {
      return stores;
    }

    /*
     Searches for stores based on the search query or returns all stores if no query is provided.
     @returns An array of search results, where each result contains an item property representing a store.
     */

    const searchResults = searchQuery
      ? fuse.search(searchQuery)
      : stores.map((store) => ({ item: store }));

    return searchResults
      .map((result) => result.item)
      .filter(
        (store) =>
          selectedCategory === 'Todos' || store.categoria === selectedCategory
      );
  }, [searchQuery, selectedCategory, stores, fuse]);

  const handleOnFunction = () => {
    setViewMode('tiendas');
    console.log('On');
  };

  const handleOffFunction = () => {
    setViewMode('mapa');
    console.log('Off');
  };

  return (
    <section className={className}>
      <div className='container mx-auto p-4'>
        <div className='flex flex-col justify-end sm:flex-row items-center mb-12 gap-4'>
          {/* TOGGLE */}
          <div className='relative flex-none md:order-1'>
            <ToggleButton
              labelOn='Mapa'
              labelOff='Tiendas'
              propOn='primary'
              propOff='secondary'
              onToggleOn={handleOnFunction}
              onToggleOff={handleOffFunction}
            />
          </div>
          {/* SEARCH */}
          {viewMode === 'tiendas' && (
            <div className='relative flex-none  '>
              <input
                type='text'
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder='Buscar tiendas'
                className='pl-10 p-2 border-b-2 border-gray-400 focus:outline-none w-full'
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 19.9 19.7'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                role='img'
                className='absolute left-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400'
              >
                <path strokeLinecap='square' d='M18.5 18.3l-5.4-5.4' />
                <circle cx='8' cy='8' r='7' />
              </svg>
            </div>
          )}
          {/* SELECT */}
          {viewMode === 'tiendas' && (
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className='p-2 border flex-none text-gray-400'
            >
              <option value='Todos'>Todos</option>
              {Object.keys(CATEGORY_COLORS).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          )}
        </div>
        {viewMode === 'tiendas' && (
          <div
            className='grid grid-cols-1 gap-px
                     sm:grid-cols-2
                     md:grid-cols-3
                     lg:grid-cols-4
                     xl:grid-cols-5'
          >
            {filteredStores.map((store) => (
              <DirectorioItem
                color={CATEGORY_COLORS[store.categoria] || 'bg-gray-500'}
                {...store}
                key={store.imageName || store.title}
              />
            ))}
          </div>
        )}
        {viewMode === 'mapa' && (
          <div className='flex items-center relative justify-center p-8'>
            <img
              className='w-[100%] max-w-7xl'
              src={Mapa.src}
              alt='Floating Element'
              decoding='async'
              loading='lazy'
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default GaleriaDirectorio;
