'use client';

import { useState, useEffect } from 'react';

export interface OptionData {
  id: string;
  name: string;
  description?: string;
}

export interface LocationData {
  id: string;
  name: string;
  type?: string;
}

export interface ItemData {
  id: string;
  name: string;
  category?: string;
}

interface QueryBuilderProps {
  onQueryBuilt: (query: { optionId: string | null; locationIds: string[]; itemIds: string[] }, messageContent: string) => void;
  onCancel: () => void;
}

const QueryBuilderTwo: React.FC<QueryBuilderProps> = ({ onQueryBuilt, onCancel }) => {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [items, setItems] = useState<ItemData[]>([]);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [locationTypeFilter, setLocationTypeFilter] = useState<string>('');
  const [itemCategoryFilter, setItemCategoryFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  
  // Getter des différents éléments
  /*
  const getLocationsByIds = (ids: string[]) => {
    return locations.filter(location => ids.includes(location.id));
  };

  const getOptionById = (id: string) => {
    return options.find(opt => opt.id === id);
  };

  const getItemsByIds = (ids: string[]) => {
    return items.filter(item => ids.includes(item.id));
  };
  */
 
  // On récupère les options à partir du call API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [optionsRes] = await Promise.all([
          fetch('/api/options'),
        ]);
        if (!optionsRes.ok) {
          throw new Error('Erreur lors de la récupération des données depuis la base de données');
        }
        const optionsData = await optionsRes.json() as OptionData[];
        setOptions(optionsData);
      } catch (error) {
        console.error('Erreur lors du chargement des données depuis la base de données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);


//   const _loadOptions = async () => {
//     if (selectedOption) {
//     const selectedOptionData = options.find(opt => opt.id === selectedOption);
//         if (selectedOptionData) {
//             const optionName = selectedOptionData.name;
//             const filterOptionName = optionName ? `?optionName=${optionName}` : '';
//             const optionsRes = await fetch(`/api/options${filterOptionName}`);
//             if (!optionsRes.ok) {
//                 throw new Error(`Erreur lors de la récupération des options: ${optionsRes.status}`);
//             }
//         }
//     }
// };

//   useEffect(() => {
//     _loadOptions()    
//   }, [selectedOption]);

  // On récupère les locations à partir du call API, à chaque fois qu'on modifie le filtre de lieux
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const filterParam = locationTypeFilter ? `?locationTypeFilter=${locationTypeFilter}` : '';
        const locationsRes = await fetch(`/api/locations${filterParam}`);
        if (!locationsRes.ok) {
          throw new Error(`Erreur lors de la récupération des lieux: ${locationsRes.status}`);
        }
        const locationsData = await locationsRes.json() as LocationData[];
        setLocations(locationsData);
      } catch (error) {
        console.error('Erreur lors du chargement des lieux:', error);
      }
    };    
    loadLocations();
  }, [locationTypeFilter]);

  // On récupère les items à partir du call API, à chaque fois qu'on modifie le filtre catégorie item
  useEffect(() => {
    const loadItems = async () => {
      try {
        const filterParam = itemCategoryFilter ? `?itemCategoryFilter=${itemCategoryFilter}` : '';
        const itemsRes = await fetch(`/api/items${filterParam}`);
        if (!itemsRes.ok) {
          throw new Error(`Erreur lors de la récupération des articles: ${itemsRes.status}`);
        }
        const itemsData = await itemsRes.json() as ItemData[];
        setItems(itemsData);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      }
    };
    console.log('cate ' + itemCategoryFilter);
    loadItems();
  }, [itemCategoryFilter]);
  
  // fournit une liste distincte de tous les types de lieux et items disponibles pour les listes déroulantes
  const uniqueLocationTypes = [...new Set(locations.map(loc => loc.type).filter(Boolean))];
  const uniqueItemCategories = [...new Set(items.map(item => item.category).filter(Boolean))];

  // construction de la requête à envoyer au composant parent Chatbot afin de l'envoyer en message (ou au backend)
  const handleBuildQuery = () => {
    const option = options.find(opt => opt.id === selectedOption)
    const locationNames = locations.filter(location => selectedLocations.includes(location.id)).map(loc => loc?.name).join(", ");
    const itemsNames = items.filter(item => selectedItems.includes(item.id)).map(item => item?.name).join(", ");
    let messageContent = `Requête structurée:\nOption: ${option?.name}, `;
      messageContent += `\nLieux: ${locationNames}, `;
      messageContent += `\nArticles: ${itemsNames.toString()}, `;
    onQueryBuilt({
      optionId: selectedOption,
      locationIds: selectedLocations,
      itemIds: selectedItems,
    }, messageContent
    );
  };

  // Ces deux fonctions gèrent l'evenment de changement sur les checkbox
  const handleLocationCheckboxChange = (locationId: string) => {
    setSelectedLocations((prev) =>
      prev.includes(locationId) ? prev.filter((id) => id !== locationId) : [...prev, locationId]
    );
  };

  const handleItemCheckboxChange = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };
 
  return (
    <div className="p-4 border-b border-gray-200 bg-white max-h-[60vh] overflow-y-auto">
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
          {options?.map((option) => (
            <option key={option.id} value={option.id}>{option.name}</option>
          ))}
        </select>
      </div>

      {selectedOption && (
        <>
          <div className="mb-4">
            <label htmlFor="locationTypeFilter" className="block text-gray-700 text-sm font-bold mb-2">Filtrez par type de lieu:</label>
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
              {locations.map((location) => (
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
              {locations.length === 0 && locationTypeFilter && <p className="text-gray-500 text-sm italic">Aucun lieu trouvé avec ce filtre.</p>}
              {locations.length === 0 && !locationTypeFilter && <p className="text-gray-500 text-sm italic">Chargement des lieux...</p>}
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
              {items.map((item) => (
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
              {items.length === 0 && itemCategoryFilter && <p className="text-gray-500 text-sm italic">Aucun article trouvé avec cette catégorie.</p>}
              {items.length === 0 && !itemCategoryFilter && <p className="text-gray-500 text-sm italic">Chargement des articles...</p>}
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

export default QueryBuilderTwo;