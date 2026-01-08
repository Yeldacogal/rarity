import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { subcategoryApi, categoryApi } from '../../lib/api';
import { Tag, Subcategory, Category } from '../../types';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiFolder, FiTag } from 'react-icons/fi';

type TabType = 'subcategories' | 'tags';

export default function AdminTagsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('subcategories');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCategory, setNewSubcategoryCategory] = useState<string>('');
  const [editingSubcategoryId, setEditingSubcategoryId] = useState<number | null>(null);
  const [editingSubcategoryName, setEditingSubcategoryName] = useState('');
  const [editingSubcategoryCategory, setEditingSubcategoryCategory] = useState<string>('');
  
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [newTagCategory, setNewTagCategory] = useState<string>('');
  const [newTagSubcategoryId, setNewTagSubcategoryId] = useState<number | undefined>(undefined);
  const [editingTagId, setEditingTagId] = useState<number | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const [editingTagCategory, setEditingTagCategory] = useState<string>('');
  const [editingTagSubcategoryId, setEditingTagSubcategoryId] = useState<number | undefined>(undefined);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catResponse, subcatResponse, tagsResponse] = await Promise.all([
        categoryApi.getAll(),
        subcategoryApi.getAll(),
        api.get<Tag[]>('/tags')
      ]);
      setCategories(catResponse.data);
      setSubcategories(subcatResponse.data);
      setTags(tagsResponse.data);
      
      if (catResponse.data.length > 0 && !newSubcategoryCategory) {
        setNewSubcategoryCategory(catResponse.data[0].slug);
        setNewTagCategory(catResponse.data[0].slug);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!newSubcategoryName.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      await subcategoryApi.create({ 
        name: newSubcategoryName.trim(), 
        category: newSubcategoryCategory 
      });
      setNewSubcategoryName('');
      if (categories.length > 0) {
        setNewSubcategoryCategory(categories[0].slug);
      }
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Alt kategori olusturulamadi');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateSubcategory = async (id: number) => {
    if (!editingSubcategoryName.trim()) return;

    try {
      await subcategoryApi.update(id, { 
        name: editingSubcategoryName.trim(), 
        category: editingSubcategoryCategory 
      });
      setEditingSubcategoryId(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Alt kategori guncellenemedi');
    }
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (!confirm('Bu alt kategoriyi silmek istediginizden emin misiniz? Bagli etiketler kategorisiz kalacak.')) return;

    try {
      await subcategoryApi.delete(id);
      fetchData();
    } catch (error) {
      console.error('Failed to delete subcategory:', error);
    }
  };

  const startEditingSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategoryId(subcategory.id);
    setEditingSubcategoryName(subcategory.name);
    setEditingSubcategoryCategory(subcategory.category);
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    setIsCreating(true);
    setError('');

    try {
      await api.post('/tags', { 
        name: newTagName.trim(), 
        category: newTagCategory,
        subcategoryId: newTagSubcategoryId || null
      });
      setNewTagName('');
      setNewTagSubcategoryId(undefined);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Etiket olusturulamadi');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateTag = async (id: number) => {
    if (!editingTagName.trim()) return;

    try {
      await api.patch(`/tags/${id}`, { 
        name: editingTagName.trim(), 
        category: editingTagCategory,
        subcategoryId: editingTagSubcategoryId || null
      });
      setEditingTagId(null);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Etiket guncellenemedi');
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Bu etiketi silmek istediginizden emin misiniz?')) return;

    try {
      await api.delete(`/tags/${id}`);
      fetchData();
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const startEditingTag = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditingTagName(tag.name);
    setEditingTagCategory(tag.category);
    setEditingTagSubcategoryId(tag.subcategoryId);
  };

  const filteredSubcategoriesForTag = subcategories.filter(
    sc => sc.category?.toUpperCase() === newTagCategory?.toUpperCase()
  );
  
  const filteredSubcategoriesForEditTag = subcategories.filter(
    sc => sc.category?.toUpperCase() === editingTagCategory?.toUpperCase()
  );

  const getSubcategoryName = (subcategoryId?: number) => {
    if (!subcategoryId) return null;
    const subcat = subcategories.find(sc => sc.id === subcategoryId);
    return subcat?.name;
  };

  const renderTagRow = (tag: Tag) => {
    return (
      <div key={tag.id} className="flex items-center justify-between p-4">
        {editingTagId === tag.id ? (
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            <input
              type="text"
              value={editingTagName}
              onChange={(e) => setEditingTagName(e.target.value)}
              className="flex-1 min-w-[150px] p-2 border-2 border-rose-300 rounded-lg focus:border-rose-400 focus:outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTag(tag.id);
                if (e.key === 'Escape') setEditingTagId(null);
              }}
            />
            <select
              value={editingTagCategory}
              onChange={(e) => {
                setEditingTagCategory(e.target.value);
              }}
              className="p-2 border-2 border-rose-300 rounded-lg focus:border-rose-400 focus:outline-none bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>{cat.name}</option>
              ))}
            </select>
            <button
              onClick={() => handleUpdateTag(tag.id)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <FiCheck />
            </button>
            <button
              onClick={() => setEditingTagId(null)}
              className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <FiX />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-800">{tag.name}</span>
              {tag.subcategoryId && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                  {getSubcategoryName(tag.subcategoryId)}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => startEditingTag(tag)}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FiEdit2 />
              </button>
              <button
                onClick={() => handleDeleteTag(tag.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6"
      >
        <FiArrowLeft />
        Admin Paneli
      </Link>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Etiket ve Alt Kategori Yonetimi</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('subcategories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'subcategories'
              ? 'bg-rose-500 text-white'
              : 'bg-white border-2 border-rose-200 text-gray-700 hover:bg-rose-50'
          }`}
        >
          <FiFolder />
          Alt Kategoriler
        </button>
        <button
          onClick={() => setActiveTab('tags')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'tags'
              ? 'bg-rose-500 text-white'
              : 'bg-white border-2 border-rose-200 text-gray-700 hover:bg-rose-50'
          }`}
        >
          <FiTag />
          Etiketler
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : activeTab === 'subcategories' ? (
        <>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Yeni Alt Kategori Ekle</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newSubcategoryName}
                onChange={(e) => setNewSubcategoryName(e.target.value)}
                placeholder="Alt kategori adi..."
                className="flex-1 p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateSubcategory()}
              />
              <select
                value={newSubcategoryCategory}
                onChange={(e) => setNewSubcategoryCategory(e.target.value)}
                className="p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.name}</option>
                ))}
              </select>
              <button
                onClick={handleCreateSubcategory}
                disabled={isCreating || !newSubcategoryName.trim()}
                className="btn-primary rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <FiPlus />
                Ekle
              </button>
            </div>
          </div>

          {categories.map(category => {
            const categorySubcategories = subcategories.filter(sc => sc.category?.toUpperCase() === category.slug?.toUpperCase());
            if (categorySubcategories.length === 0) return null;
            
            return (
              <div key={category.id} className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-rose-700">
                  <FiFolder />
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </h3>
                <div className="bg-white border-2 border-rose-200 rounded-lg divide-y divide-rose-100">
                  {categorySubcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-4">
                      {editingSubcategoryId === subcategory.id ? (
                        <div className="flex items-center gap-2 flex-1 flex-wrap">
                          <input
                            type="text"
                            value={editingSubcategoryName}
                            onChange={(e) => setEditingSubcategoryName(e.target.value)}
                            className="flex-1 min-w-[150px] p-2 border-2 border-rose-300 rounded-lg focus:border-rose-400 focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleUpdateSubcategory(subcategory.id);
                              if (e.key === 'Escape') setEditingSubcategoryId(null);
                            }}
                          />
                          <select
                            value={editingSubcategoryCategory}
                            onChange={(e) => setEditingSubcategoryCategory(e.target.value)}
                            className="p-2 border-2 border-rose-300 rounded-lg focus:border-rose-400 focus:outline-none bg-white"
                          >
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleUpdateSubcategory(subcategory.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <FiCheck />
                          </button>
                          <button
                            onClick={() => setEditingSubcategoryId(null)}
                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <FiX />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-gray-800">{subcategory.name}</span>
                            <span className="text-xs text-gray-400">
                              ({subcategory.tags?.length || 0} etiket)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditingSubcategory(subcategory)}
                              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteSubcategory(subcategory.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {subcategories.length === 0 && (
            <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
              <p className="text-gray-500">Henuz alt kategori yok.</p>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="bg-white border-2 border-rose-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Yeni Etiket Ekle</h3>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Etiket adi..."
                  className="flex-1 p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                />
                <select
                  value={newTagCategory}
                  onChange={(e) => {
                    setNewTagCategory(e.target.value);
                    setNewTagSubcategoryId(undefined);
                  }}
                  className="p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newTagSubcategoryId || ''}
                  onChange={(e) => setNewTagSubcategoryId(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="flex-1 p-3 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none bg-white"
                >
                  <option value="">Alt Kategori Sec (opsiyonel)</option>
                  {filteredSubcategoriesForTag.map(sc => (
                    <option key={sc.id} value={sc.id}>{sc.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleCreateTag}
                  disabled={isCreating || !newTagName.trim()}
                  className="btn-primary rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  <FiPlus />
                  Ekle
                </button>
              </div>
            </div>
          </div>

          {categories.map(category => {
            const categoryTags = tags.filter(t => t.category?.toUpperCase() === category.slug?.toUpperCase());
            if (categoryTags.length === 0) return null;
            
            const categorySubcats = subcategories.filter(sc => sc.category?.toUpperCase() === category.slug?.toUpperCase());
            const unassignedTags = categoryTags.filter(t => !t.subcategoryId);
            
            return (
              <div key={category.id} className="mb-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2 text-rose-700">
                  <FiTag />
                  {category.icon && <span>{category.icon}</span>}
                  {category.name}
                </h3>
                
                {categorySubcats.map(subcat => {
                  const subcatTags = categoryTags.filter(t => t.subcategoryId === subcat.id);
                  if (subcatTags.length === 0) return null;
                  
                  return (
                    <div key={subcat.id} className="mb-4">
                      <h4 className="text-sm font-medium text-gray-600 mb-2 ml-2 flex items-center gap-1">
                        <FiFolder className="text-gray-400" />
                        {subcat.name}
                      </h4>
                      <div className="bg-white border-2 border-rose-200 rounded-lg divide-y divide-rose-100">
                        {subcatTags.map(tag => renderTagRow(tag))}
                      </div>
                    </div>
                  );
                })}
                
                {unassignedTags.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2 ml-2">
                      Alt kategorisiz
                    </h4>
                    <div className="bg-white border-2 border-rose-200 rounded-lg divide-y divide-rose-100">
                      {unassignedTags.map(tag => renderTagRow(tag))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {tags.length === 0 && (
            <div className="text-center py-12 bg-white border-2 border-rose-200 rounded-lg">
              <p className="text-gray-500">Henuz etiket yok.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
