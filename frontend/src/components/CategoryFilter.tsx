import { useEffect, useState } from 'react';
import { categoryAPI } from '../services/api';
import type { Category } from '../types';

interface CategoryFilterProps {
  selectedCategory?: number;
  onSelectCategory: (categoryId?: number) => void;
  selectedSeason?: string;
  onSelectSeason: (season?: string) => void;
}

const CategoryFilter = ({
  selectedCategory,
  onSelectCategory,
  selectedSeason,
  onSelectSeason,
}: CategoryFilterProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const seasons = [
    { value: 'summer', label: 'Літнє' },
    { value: 'winter', label: 'Зимове' },
    { value: 'spring', label: 'Весняне' },
    { value: 'autumn', label: 'Осіннє' },
    { value: 'all-season', label: 'Всесезонне' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Фільтри</h3>

      {/* Season Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Сезон</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="season"
              checked={!selectedSeason}
              onChange={() => onSelectSeason(undefined)}
              className="mr-2"
            />
            <span className="text-sm">Всі</span>
          </label>
          {seasons.map((season) => (
            <label key={season.value} className="flex items-center">
              <input
                type="radio"
                name="season"
                checked={selectedSeason === season.value}
                onChange={() => onSelectSeason(season.value)}
                className="mr-2"
              />
              <span className="text-sm">{season.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Категорія</h4>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="category"
              checked={!selectedCategory}
              onChange={() => onSelectCategory(undefined)}
              className="mr-2"
            />
            <span className="text-sm">Всі категорії</span>
          </label>
          {categories.map((category) => (
            <label key={category.id} className="flex items-center">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.id}
                onChange={() => onSelectCategory(category.id)}
                className="mr-2"
              />
              <span className="text-sm">{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      {(selectedCategory || selectedSeason) && (
        <button
          onClick={() => {
            onSelectCategory(undefined);
            onSelectSeason(undefined);
          }}
          className="mt-6 w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Скинути фільтри
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
