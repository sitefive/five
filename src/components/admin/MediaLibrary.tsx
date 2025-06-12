import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, Trash2, Search, Grid, List } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import imageCompression from 'browser-image-compression';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

interface MediaFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
}

const MediaLibrary = () => {
  const { t } = useTranslation(); // Inicializar useTranslation
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data: files, error } = await supabase
        .storage
        .from('media') // Usando o bucket 'media'
        .list();

      if (error) {
        console.error('Error fetching files:', error);
        toast.error(t('media.error_loading_files', { message: error.message })); // Traduzido
        throw error;
      }

      const filesWithUrls = await Promise.all(
        files.map(async (file) => {
          const { data: { publicUrl } } = supabase
            .storage
            .from('media') // Usando o bucket 'media'
            .getPublicUrl(file.name);

          return {
            id: file.id,
            name: file.name,
            url: publicUrl,
            size: file.metadata.size,
            type: file.metadata.mimetype,
            created_at: file.created_at
          };
        })
      );

      setFiles(filesWithUrls);
    } catch (error: any) {
      console.error('Error fetching files:', error);
      toast.error(t('common.error_loading_data', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setLoading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        // Compress image if it's larger than 1MB
        let fileToUpload = file;
        if (file.size > 1024 * 1024) {
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
          };
          fileToUpload = await imageCompression(file, options);
        }

        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('media') // Usando o bucket 'media'
          .upload(fileName, fileToUpload);

        if (uploadError) throw uploadError;
      }

      toast.success(t('media.files_uploaded_success')); // Traduzido
      fetchFiles();
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast.error(t('media.error_uploading_files', { message: error.message || 'Verifique o console.' })); // Traduzido
    } finally {
      setUploading(false);
    }
  }, [t]); // Adicionado 't' como dependência do useCallback

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const handleDelete = async (fileName: string) => {
    if (!window.confirm(t('media.confirm_delete_file'))) return; // Traduzido

    try {
      const { error } = await supabase
        .storage
        .from('media') // Usando o bucket 'media'
        .remove([fileName]);

      if (error) throw error;

      setFiles(files.filter(file => file.name !== fileName));
      toast.success(t('media.file_deleted_success')); // Traduzido
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast.error(t('common.error_deleting', { message: error.message || 'Verifique o console.' })); // Traduzido
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('media.title')}</h1> {/* Traduzido */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('media.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div
        {...getRootProps()}
        className={`mb-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
        }`}
      >
        <input {...getInputProps()} />
        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          {uploading ? t('media.uploading_status') : isDragActive
            ? t('media.drag_drop_active')
            : t('media.drag_drop_inactive')}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {t('media.max_file_size', { size: '5MB' })} {t('media.supported_formats')}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-4">{t('common.loading')}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('media.file_column_header')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('media.size_column_header')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('media.date_column_header')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('common.actions_label')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {file.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(file.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(file.name)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;