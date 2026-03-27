interface AdPlaceholderProps {
  size?: 'banner' | 'square' | 'vertical';
  className?: string;
}

export default function AdPlaceholder({ size = 'banner', className = '' }: AdPlaceholderProps) {
  const sizeClasses = {
    banner: 'h-24 md:h-32',
    square: 'h-64 w-full max-w-xs',
    vertical: 'h-96 w-full max-w-xs'
  };

  const sizeText = {
    banner: '728x90',
    square: '300x250',
    vertical: '300x600'
  };

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="text-center text-gray-500">
        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-medium">Ad Space</p>
        <p className="text-xs">{sizeText[size]}</p>
      </div>
    </div>
  );
}
