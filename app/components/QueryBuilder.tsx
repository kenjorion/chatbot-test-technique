'use client';

import { useState, useEffect } from 'react';

interface OptionData {
  id: string;
  name: string;
  description?: string;
}

interface LocationData {
  id: string;
  name: string;
  type?: string;
}

interface ItemData {
  id: string;
  name: string;
  category?: string;
}

interface QueryBuilderProps {
  onQueryBuilt: (query: { optionId: string | null; locationIds: string[]; itemIds: string[] }) => void;
  onCancel: () => void;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({ onQueryBuilt, onCancel }) => {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [optionsRes, locationsRes, itemsRes] = await Promise.all([
          fetch('/api/options'),
          fetch('/api/locations'),
          fetch('/api/items'),
        ]);

        if (!optionsRes.ok) {
          throw new Error('Erreur lors de la récupération des données depuis la base de données');
        }

        const optionsData = await optionsRes.json() as OptionData[];
        const locationsData = await locationsRes.json() as LocationData[];
        const itemsData = await itemsRes.json() as ItemData[];

        setOptions(optionsData);
        setLocations(locationsData);
        setItems(itemsData);

      } catch (error) {
        console.error('Erreur lors du chargement des données depuis la base de données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    console.log(' main ' + selectedLocations);
  
    loadData();
  }, []);

  const uniqueLocationTypes = [...new Set(locations.map(loc => loc.type).filter(Boolean))];
  const uniqueItemCategories = [...new Set(items.map(item => item.category).filter(Boolean))];

  const filteredLocations = locationTypeFilter !== ''
    ? locations.filter(loc => loc.type === locationTypeFilter)
    : locations;

  const filteredItems = itemCategoryFilter !== ''
    ? items.filter(item => item.category === itemCategoryFilter)
    : items;

  const handleBuildQuery = () => {
    onQueryBuilt({
      optionId: selectedOption,
      locationIds: selectedLocations,
      itemIds: selectedItems,
    });
  };

  const handleLocationCheckboxChange = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
    );
    console.log(' handle loc ' + selectedLocations);
  };

  const handleItemCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
    console.log(' handle item ' + selectedItems);
  };

  console.log(' main loca selected ' + selectedLocations + ' filter ' + locationTypeFilter);
  console.log(' main items selected ' + selectedItems + ' filter ' + itemCategoryFilter);

//   return (
//     <div className="p-4 border-b border-gray-200 bg-white max-h-[60vh] overflow-y-auto">
//       <h2 className="text-lg font-semibold mb-2">Construire votre requête</h2>

//       <div className="mb-4">
//         <label htmlFor="option" className="block text-gray-700 text-sm font-bold mb-2">Option de question:</label>
//         <select
//           id="option"
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           value={selectedOption || ''}
//           onChange={(e) => setSelectedOption(e.target.value)}
//         >
//           <option value="">-- Sélectionnez une option --</option>
//           {options.map((option) => (
//             <option key={option.id} value={option.id}>{option.name}</option>
//           ))}
//         </select>
//       </div>

//       {/* {selectedOption && options.find(opt => opt.id === selectedOption)?.requiresLocation && ( */}
//       {selectedOption && (
//         <>
//           <div className="mb-4">
//             <label htmlFor="locationTypeFilter" className="block text-gray-700 text-sm font-bold mb-2">Filtrer par type de lieu:</label>
//             <select
//               id="locationTypeFilter"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={locationTypeFilter || ''}
//               onChange={(e) => setLocationTypeFilter(e.target.value || '')}
//             >
//               <option value="">-- Tous les types --</option>
//               {uniqueLocationTypes.map(type => (
//                 <option key={type} value={type}>{type}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="locations" className="block text-gray-700 text-sm font-bold mb-2">Lieu(x):</label>
//             <select
//               id="locations"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               multiple
//               value={selectedLocations}
//               onChange={(e) => {
//                 const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
//                 setSelectedLocations(selectedOptions);
//               }}
//             >
//               {filteredLocations.map((location) => (
//                 <option key={location.id} value={location.id}>{location.name}</option>
//               ))}
//             </select>
//             {filteredLocations.length > 0 && (
//               <p className="text-gray-500 text-xs italic">Vous pouvez sélectionner plusieurs lieux.</p>
//             )}
//           </div>
//         </>
//       )}

//       {/* {selectedOption && options.find(opt => opt.id === selectedOption)?.requiresItem && ( */}
//       {selectedOption  && (
//         <>
//           <div className="mb-4">
//             <label htmlFor="itemCategoryFilter" className="block text-gray-700 text-sm font-bold mb-2">Filtrer par catégorie d'article:</label>
//             <select
//               id="itemCategoryFilter"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               value={itemCategoryFilter || ''}
//               onChange={(e) => setItemCategoryFilter(e.target.value || '')}
//             >
//               <option value="">-- Toutes les catégories --</option>
//               {uniqueItemCategories.map(category => (
//                 <option key={category} value={category}>{category}</option>
//               ))}
//             </select>
//           </div>
//           <div className="mb-4">
//             <label htmlFor="items" className="block text-gray-700 text-sm font-bold mb-2">Article(s):</label>
//             <select
//               id="items"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               multiple
//               value={selectedItems}
//               onChange={(e) => {
//                 const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
//                 setSelectedItems(selectedOptions);
//               }}
//             >
//               {filteredItems.map((item) => (
//                 <option key={item.id} value={item.id}>{item.name}</option>
//               ))}
//             </select>
//             {filteredItems.length > 0 && (
//               <p className="text-gray-500 text-xs italic">Vous pouvez sélectionner plusieurs articles.</p>
//             )}
//           </div>
//         </>
//       )}

//       {selectedOption && (
//         <div className="flex justify-end">
//           <button
//             onClick={onCancel}
//             className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
//           >
//             Annuler
//           </button>
//           <button
//             onClick={handleBuildQuery}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Construire la requête
//           </button>
//         </div>
//       )}
//     </div>
//   );

  return (
    <div className="p-4 border-b border-gray-200 bg-white max-h-[60vh] overflow-y-auto"> {/* Added scrollbar */}
      <h2 className="text-lg font-semibold mb-2">Construire votre requête</h2>

      <div className="mb-4">
        <label htmlFor="option" className="block text-gray-700 text-sm font-bold mb-2">Option de question:</label>
        <select
          id="option"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={selectedOption || ''}
          onChange={(e) => setSelectedOption(e.target.value)}
        >
          <option value="">-- Sélectionnez une option --</option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </div>

      {selectedOption && (
        <>
          <div className="mb-4">
            <label htmlFor="locationTypeFilter" className="block text-gray-700 text-sm font-bold mb-2">Filtrer par type de lieu:</label>
            <select
              id="locationTypeFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={locationTypeFilter || ''}
              onChange={(e) => setLocationTypeFilter(e.target.value || '')}
            >
              <option value="">-- Tous les types --</option>
              {uniqueLocationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Lieu(x):</label>
            <div className="space-y-2">
              {filteredLocations.map((location) => (
                <div key={location.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`location-${location.id}`}
                    value={location.id}
                    checked={selectedLocations.includes(location.id)}
                    onChange={() => handleLocationCheckboxChange(location.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`location-${location.id}`} className="text-gray-700 text-sm">{location.name}</label>
                </div>
              ))}
              {filteredLocations.length === 0 && <p className="text-gray-500 text-sm italic">Aucun lieu trouvé avec ce filtre.</p>}
            </div>
          </div>
        </>
      )}

      {selectedOption && (
        <>
          <div className="mb-4">
            <label htmlFor="itemCategoryFilter" className="block text-gray-700 text-sm font-bold mb-2">Filtrer par catégorie d'article:</label>
            <select
              id="itemCategoryFilter"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={itemCategoryFilter || ''}
              onChange={(e) => setItemCategoryFilter(e.target.value || '')}
            >
              <option value="">-- Toutes les catégories --</option>
              {uniqueItemCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Article(s):</label>
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`item-${item.id}`}
                    value={item.id}
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleItemCheckboxChange(item.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`item-${item.id}`} className="text-gray-700 text-sm">{item.name}</label>
                </div>
              ))}
              {filteredItems.length === 0 && <p className="text-gray-500 text-sm italic">Aucun article trouvé avec ce filtre.</p>}
            </div>
          </div>
        </>
      )}

      {selectedOption && (
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Annuler
          </button>
          <button
            onClick={handleBuildQuery}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Construire la requête
          </button>
        </div>
      )}
    </div>
  );
};

export default QueryBuilder;