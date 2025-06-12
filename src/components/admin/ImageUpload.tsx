import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast'; // Importe o toast para mensagens

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      // O nome do arquivo precisa ser único. Combinar timestamp com um random é uma boa prática.
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;

      // --- INÍCIO DA CORREÇÃO DO NOME DO BUCKET ---
      const { error: uploadError, data } = await supabase.storage
        .from('media') // <-- CORRIGIDO: Usar o bucket 'media'
        .upload(filePath, file);
      // --- FIM DA CORREÇÃO DO NOME DO BUCKET ---

      if (uploadError) throw uploadError;

      // --- INÍCIO DA CORREÇÃO DO NOME DO BUCKET ---
      const { data: { publicUrl } } = supabase.storage
        .from('media') // <-- CORRIGIDO: Usar o bucket 'media'
        .getPublicUrl(filePath);
      // --- FIM DA CORREÇÃO DO NOME DO BUCKET ---

      onChange(publicUrl);
      toast.success('Imagem enviada com sucesso!'); // Feedback de sucesso
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Erro ao fazer upload da imagem: ${error.message || 'Verifique o console.'}`); // Feedback de erro
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="w-full">
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {isDragActive
              ? 'Solte a imagem aqui' // Traduzido
              : 'Arraste e solte uma imagem aqui, ou clique para selecionar'} {/* Traduzido */}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;