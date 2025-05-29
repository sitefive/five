import { useEffect } from 'react';

export function useImagePreload(imageSrc?: string) {
  useEffect(() => {
    if (!imageSrc) return;

    const img = new Image();
    img.src = imageSrc;
  }, [imageSrc]);
}