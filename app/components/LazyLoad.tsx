'use client';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function LazyLoadedSection({ children }: { children: React.ReactNode }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <div ref={ref}>
      {isInView ? children : <div className="h-64 bg-amber-100/30 rounded-xl" />}
    </div>
  );
}