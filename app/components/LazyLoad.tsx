'use client';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { motion } from 'framer-motion';

export function LazyLoadedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <div ref={ref}>
      {isInView ? children : <div className="h-64 bg-amber-100/30 rounded-xl" />}
    </div>
  );
}

interface LazyLoadImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
}

export function LazyLoadImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  fill = false,
}: LazyLoadImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
  }, [src]);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-amber-50/50 backdrop-blur-sm">
          <div className="flex space-x-2">
            {[0, 1, 2].map((dot) => (
              <motion.div
                key={dot}
                className="w-3 h-3 bg-amber-600 rounded-full"
                animate={{
                  y: ['0%', '-50%', '0%']
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: dot * 0.2
                }}
              />
            ))}
          </div>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}`}
        priority={priority}
        fill={fill}
        onLoadingComplete={() => setIsLoading(false)}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}