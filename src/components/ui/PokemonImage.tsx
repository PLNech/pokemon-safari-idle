'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PokemonImageProps {
  pokemonName: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  fallbackEmoji?: string;
}

export function PokemonImage({ 
  pokemonName, 
  size = 'medium', 
  className = '',
  fallbackEmoji = '❓'
}: PokemonImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Convert Pokemon name to filename format (lowercase, replace spaces with hyphens, handle special characters)
  const filename = pokemonName.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/♀/g, '♀')  // Keep female symbol as-is
    .replace(/♂/g, '♂')  // Keep male symbol as-is  
    .replace(/'/g, '')   // Remove apostrophes
    .replace(/\./g, ''); // Remove periods
  const imagePath = `/pokemon/${filename}.png`;
  
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12', 
    large: 'w-24 h-24'
  };
  
  const sizeDimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 96, height: 96 }
  };

  if (imageError) {
    // Fallback to emoji if image fails to load
    return (
      <div 
        className={`
          ${sizeClasses[size]} ${className}
          flex items-center justify-center bg-gray-100 rounded-lg
          text-sm border border-gray-200
        `}
        title={pokemonName}
      >
        {fallbackEmoji}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <Image
        src={imagePath}
        alt={pokemonName}
        width={sizeDimensions[size].width}
        height={sizeDimensions[size].height}
        className="object-contain rounded-lg"
        onError={() => setImageError(true)}
        title={pokemonName}
        priority={size === 'large'} // Prioritize larger images
      />
    </div>
  );
}