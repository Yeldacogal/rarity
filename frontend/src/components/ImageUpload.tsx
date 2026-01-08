import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import api from '../lib/api';

interface ImageUploadProps {
  currentImage?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  currentImage,
  onImageUploaded,
  onImageRemoved,
  label = 'Görsel Yükle',
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      setError('Sadece resim dosyaları yüklenebilir (JPG, PNG, GIF, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setError(null);
    setIsUploading(true);

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post('/uploads/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { url } = response.data;
      setPreview(url);
      onImageUploaded(url);
      
      URL.revokeObjectURL(localPreview);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Görsel yüklenirken bir hata oluştu');
      setPreview(currentImage || null);
      URL.revokeObjectURL(localPreview);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemoved?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {preview ? (
        <div className="relative inline-block">
          <img
            src={preview}
            alt="Preview"
            className="max-w-full max-h-64 rounded-lg border border-gray-300 object-contain"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
          {!isUploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            >
              <FiX size={16} />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
            ${isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
            }
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
              <span className="text-gray-600">Yükleniyor...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-purple-100 rounded-full">
                <FiUpload className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <span className="text-purple-600 font-medium">Tıklayın</span>
                <span className="text-gray-600"> veya sürükleyip bırakın</span>
              </div>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF, WEBP (Max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <FiImage className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
