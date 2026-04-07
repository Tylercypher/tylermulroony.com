'use client';

import { useState } from 'react';
import Image from 'next/image';
import Modal from '@/components/ui/Modal';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  images: string[];
  title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  const goNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className="relative aspect-video rounded-lg overflow-hidden border border-[var(--border-color)] hover:border-[var(--accent)] transition-colors"
          >
            <Image src={img} alt={`${title} screenshot ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      <Modal isOpen={selectedIndex !== null} onClose={() => setSelectedIndex(null)}>
        {selectedIndex !== null && (
          <div className="relative">
            <div className="relative aspect-video">
              <Image
                src={images[selectedIndex]}
                alt={`${title} screenshot ${selectedIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
            {images.length > 1 && (
              <div className="flex justify-between mt-4">
                <button
                  onClick={goPrev}
                  className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-sm text-[var(--text-muted)] self-center font-mono">
                  {selectedIndex + 1} / {images.length}
                </span>
                <button
                  onClick={goNext}
                  className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
