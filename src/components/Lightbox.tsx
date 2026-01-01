import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const XIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 L6 18" />
    <path d="M6 6 L18 18" />
  </svg>
);

const ChevronLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 18 L9 12 L15 6" />
  </svg>
);

const ChevronRightIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18 L15 12 L9 6" />
  </svg>
);

export default function Lightbox({ images, index, onClose, onNext, onPrev }: { images: string[]; index: number; onClose: ()=>void; onNext: ()=>void; onPrev: ()=>void }){
  if(!images) return null;
  return (
    <Dialog open={!!images} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-0">
        <div className="relative">
          <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200">
            <XIcon className="w-6 h-6 text-white" />
          </button>

          {images.length > 1 && (
            <>
              <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200">
                <ChevronLeftIcon className="w-6 h-6 text-white" />
              </button>
              <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200">
                <ChevronRightIcon className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
            <img src={images[index]} alt={`Gallery image ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg" />
          </div>

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full">
              <span className="text-white text-sm font-medium">{index + 1} / {images.length}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
