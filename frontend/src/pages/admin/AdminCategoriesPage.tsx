import { useState, useEffect } from 'react';
import api, { categoryApi } from '../../lib/api';
import { Category } from '../../types';
import { FiPlus, FiEdit2, FiTrash2, FiFolder, FiSave, FiX, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIcon, setNewIcon] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string, isNew: boolean) => {
    if (isNew) {
      setNewName(name);
      setNewSlug(generateSlug(name));
    } else {
      setEditName(name);
      setEditSlug(generateSlug(name));
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await categoryApi.create({
        name: newName,
        slug: newSlug,
        description: newDescription || undefined,
        icon: newIcon || undefined,
        order: categories.length,
      });
      setNewName('');
      setNewSlug('');
      setNewDescription('');
      setNewIcon('');
      setShowNewForm(false);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Kategori oluşturulamadı');
    }
  };

  const handleUpdateCategory = async (id: number) => {
    try {
      await categoryApi.update(id, {
        name: editName,
        slug: editSlug,
        description: editDescription || undefined,
        icon: editIcon || undefined,
      });
      setEditingId(null);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Kategori güncellenemedi');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? Bu işlem alt kategorilerin bağlantısını kaldıracak.')) {
      return;
    }
    try {
      await categoryApi.delete(id);
      fetchCategories();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Kategori silinemedi');
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditSlug(category.slug);
    setEditDescription(category.description || '');
    setEditIcon(category.icon || '');
  };

  const handleMoveCategory = async (id: number, direction: 'up' | 'down') => {
    const index = categories.findIndex(c => c.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === categories.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const otherCategory = categories[newIndex];

    try {
      await Promise.all([
        categoryApi.update(id, { order: newIndex }),
        categoryApi.update(otherCategory.id, { order: index }),
      ]);
      fetchCategories();
    } catch (error) {
      console.error('Failed to reorder categories:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FiFolder className="text-rose-500" />
          Kategori Yönetimi
        </h1>
        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="btn-primary rounded-lg flex items-center gap-2"
        >
          <FiPlus />
          Yeni Kategori
        </button>
      </div>

      {showNewForm && (
        <div className="bg-white border-2 border-rose-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Kategori Ekle</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => handleNameChange(e.target.value, true)}
                  className="w-full p-2 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                  placeholder="örn: Makyaj"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) *
                </label>
                <input
                  type="text"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  className="w-full p-2 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                  placeholder="örn: makyaj"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                placeholder="Kategori açıklaması"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                İkon (emoji veya ikon adı)
              </label>
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full p-2 border-2 border-rose-200 rounded-lg focus:border-rose-400 focus:outline-none"
                placeholder="örn: 💄 veya makeup"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary rounded-lg flex items-center gap-2">
                <FiPlus />
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="btn-secondary rounded-lg flex items-center gap-2"
              >
                <FiX />
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border-2 border-rose-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-rose-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sıra</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Slug</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Açıklama</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Alt Kategori</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rose-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Henüz kategori eklenmemiş
                </td>
              </tr>
            ) : (
              categories.map((category, index) => (
                <tr key={category.id} className="hover:bg-rose-50">
                  {editingId === category.id ? (
                    <>
                      <td className="px-4 py-3">
                        <span className="text-gray-500">{index + 1}</span>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => handleNameChange(e.target.value, false)}
                          className="w-full p-1 border border-rose-300 rounded focus:outline-none focus:border-rose-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full p-1 border border-rose-300 rounded focus:outline-none focus:border-rose-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full p-1 border border-rose-300 rounded focus:outline-none focus:border-rose-400"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-500">{category.subcategories?.length || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                            title="Kaydet"
                          >
                            <FiSave />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            title="İptal"
                          >
                            <FiX />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveCategory(category.id, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <FiArrowUp size={14} />
                          </button>
                          <button
                            onClick={() => handleMoveCategory(category.id, 'down')}
                            disabled={index === categories.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            <FiArrowDown size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {category.icon && <span>{category.icon}</span>}
                          <span className="font-medium text-gray-800">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{category.slug}</code>
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-sm">
                        {category.description || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded-full text-sm">
                          {category.subcategories?.length || 0} alt kategori
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Düzenle"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Sil"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-700 text-sm">
          <strong>Not:</strong> Kategorileri sildığinizde, bağlı alt kategoriler kategorisiz kalacaktır. 
          Alt kategorileri yeni bir kategoriye taşımayı unutmayın.
        </p>
      </div>
    </div>
  );
}
