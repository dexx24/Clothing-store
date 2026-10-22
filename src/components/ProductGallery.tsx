'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [index, setIndex] = useState(0);
  if (images.length === 0) return <div className="aspect-[4/5] bg-neutral-100" />;

  return (
    <div>
      <div className="relative aspect-[4/5] bg-neutral-100">
        <Image
          src={images[index]}
          alt={`${name}, view ${index + 1}`}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-3">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show view ${i + 1}`}
                aria-current={i === index}
                className={`relative block aspect-[4/5] w-full bg-neutral-100 ${
                  i === index ? 'ring-1 ring-neutral-900' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <Image src={src} alt="" fill sizes="10vw" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
