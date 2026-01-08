import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api, { subcategoryApi, categoryApi } from '../lib/api';
import { Question, Tag, PaginatedResponse, Subcategory, Category } from '../types';
import QuestionCard from '../components/QuestionCard';
import { FiSearch, FiPlus, FiChevronLeft, FiChevronRight, FiFilter, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

export default function QuestionsPage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);

  const search = searchParams.get('search') || '';
  const selectedTags = searchParams.get('tags') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    fetchQuestions();
    fetchTags();
    fetchSubcategories();
    fetchCategories();
  }, [search, selectedTags, sortBy, page]);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (selectedTags) params.set('tags', selectedTags);
      if (sortBy) params.set('sortBy', sortBy);
      params.set('page', page.toString());
      params.set('limit', '10');

      const response = await api.get<PaginatedResponse<Question>>(`/questions?${params}`);
      setQuestions(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await api.get<Tag[]>('/tags');
      setTags(response.data);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await subcategoryApi.getAll();
      setSubcategories(response.data);
    } catch (error) {
      console.error('Failed to fetch subcategories:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = formData.get('search') as string;
    setSearchParams({ search: searchValue, tags: selectedTags, sortBy, page: '1' });
  };

  const toggleTag = (tagId: number) => {
    const currentTags = selectedTags ? selectedTags.split(',').map(Number) : [];
    let newTags: number[];

    if (currentTags.includes(tagId)) {
      newTags = currentTags.filter((id) => id !== tagId);
    } else {
      newTags = [...currentTags, tagId];
    }

    setSearchParams({
      search,
      tags: newTags.join(','),
      sortBy,
      page: '1',
    });
  };

  const handleSortChange = (newSortBy: string) => {
    setSearchParams({ search, tags: selectedTags, sortBy: newSortBy, page: '1' });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search, tags: selectedTags, sortBy, page: newPage.toString() });
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    setSelectedSubcategoryId(null);
    setSearchParams({ search, tags: '', sortBy, page: '1' });
  };

  const handleSubcategoryChange = (subcategoryId: number | null) => {
    setSelectedSubcategoryId(subcategoryId);
    setSearchParams({ search, tags: '', sortBy, page: '1' });
  };

  const selectedTagIds = selectedTags ? selectedTags.split(',').map(Number) : [];

  const filteredSubcategories = selectedCategory 
    ? subcategories.filter(sc => sc.category?.toUpperCase() === selectedCategory.toUpperCase())
    : [];

  const filteredTags = tags.filter(tag => {
    // Önce kategori kontrolü
    if (!selectedCategory) return false;
    
    const categoryMatches = tag.category?.toUpperCase() === selectedCategory.toUpperCase();
    if (!categoryMatches) return false;
    
    // Alt kategori seçilmemişse, kategorideki tüm tag'leri göster
    if (!selectedSubcategoryId) return true;
    
    // Alt kategori seçiliyse:
    // - Tag'in subcategoryId'si varsa ve eşleşiyorsa göster
    // - Tag'in subcategoryId'si yoksa da göster (kategoriye genel ait tag'ler)
    return !tag.subcategoryId || tag.subcategoryId === selectedSubcategoryId;
  });

  return (
    <div className="min-h-screen relative" style={{ backgroundImage: 'url(/bg-pattern.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
      <div className="absolute inset-0 bg-white/70"></div>
      <div className="relative max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Sorular</h1>
        {user && (
          <Link
            to="/questions/new"
            className="btn-primary rounded-lg flex items-center gap-2"
          >
            <FiPlus />
            Soru Sor
          </Link>
        )}
      </div>

      <div className="flex justify-center mb-6">
        <img 
          src="/nyanCat.gif" 
          alt="" 
          className="w-60 h-auto"
        />
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Soru ara..."
            className="w-full pl-12 pr-4 py-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Ara
          </button>
        </div>
      </form>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Kategori secin:</p>
        <div className="flex flex-wrap gap-3">
          {(categories.length > 0 ? categories : [
            { id: 1, name: 'Bakım', slug: 'BAKIM', icon: '🧴', order: 0, createdAt: '' },
            { id: 2, name: 'Makyaj', slug: 'MAKYAJ', icon: '💄', order: 1, createdAt: '' }
          ]).map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(selectedCategory === category.slug ? null : category.slug)}
              className={`px-5 py-2 rounded-lg border-2 transition-all font-medium ${
                selectedCategory === category.slug
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-rose-600 border-rose-300 hover:border-rose-400'
              }`}
            >
              {category.icon && <span className="mr-1">{category.icon}</span>}
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {selectedCategory && filteredSubcategories.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
            <FiChevronDown className="text-rose-500" />
            Alt kategori secin:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleSubcategoryChange(null)}
              className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                selectedSubcategoryId === null
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-rose-600 border-rose-200 hover:border-rose-300'
              }`}
            >
              Tumu
            </button>
            {filteredSubcategories.map((subcategory) => (
              <button
                key={subcategory.id}
                onClick={() => handleSubcategoryChange(subcategory.id)}
                className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                  selectedSubcategoryId === subcategory.id
                    ? 'bg-rose-400 text-white border-rose-400'
                    : 'bg-white text-rose-600 border-rose-200 hover:border-rose-300'
                }`}
              >
                {subcategory.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedCategory && (
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Etiketlere gore filtrele:</p>
          <div className="flex flex-wrap gap-2">
            {filteredTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${
                    selectedTagIds.includes(tag.id)
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white text-rose-600 border-rose-300 hover:border-rose-400'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            {filteredTags.length === 0 && (
              <p className="text-sm text-gray-400">
                {selectedSubcategoryId 
                  ? 'Bu alt kategoride etiket yok.' 
                  : 'Bu kategoride etiket yok.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mb-6 flex items-center gap-3">
        <FiFilter className="text-gray-500" />
        <span className="text-sm text-gray-600">Sırala:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'newest', label: 'En Yeni' },
            { value: 'oldest', label: 'En Eski' },
            { value: 'mostAnswers', label: 'En Çok Cevap' },
            { value: 'noAnswers', label: 'Cevaplanmamış' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleSortChange(option.value)}
              className={`px-3 py-1 rounded-lg border-2 transition-all text-sm ${
                sortBy === option.value
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'bg-white text-rose-600 border-rose-300 hover:border-rose-400'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border-2 border-rose-200 rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
          <p className="text-gray-500 mb-4">Henüz soru bulunamadı.</p>
          {user && (
            <Link
              to="/questions/new"
              className="btn-primary rounded-lg inline-flex items-center gap-2"
            >
              <FiPlus />
              İlk Soruyu Sor
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-rose-300 rounded-lg hover:border-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft />
            Önceki
          </button>
          <span className="text-gray-600">
            Sayfa {page} / {meta.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === meta.totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-white border-2 border-rose-300 rounded-lg hover:border-rose-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Sonraki
            <FiChevronRight />
          </button>
        </div>
      )}

      <p className="text-center text-gray-500 text-sm mt-4">
        Toplam {meta.total} soru bulundu
      </p>
      </div>
    </div>
  );
}
