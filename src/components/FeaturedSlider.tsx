import React, { useState, useEffect } from 'react';

export default function FeaturedSlider({ items }: { items: Array<{id:number,title:string,desc:string,image:string}> }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length);
  const next = () => setCurrent((c) => (c + 1) % items.length);
  const goTo = (i:number) => setCurrent(i);

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black mb-6 text-white tracking-tight">Featured Projects</h2>
          <div className="w-12 h-1 bg-[#FFC107] mx-auto"></div>
        </div>

        <div className="slider-container relative bg-white rounded-xl overflow-hidden shadow-2xl">
          <div className="slider-wrapper" style={{ transform: `translateX(-${current * 100}%)` }}>
            {items.map((item) => (
              <div key={item.id} className="slider-item">
                <img src={item.image} alt={item.title} loading="lazy" className="w-full h-96 object-cover" />
              </div>
            ))}
          </div>

          <button className="slider-btn prev" onClick={prev}>❮</button>
          <button className="slider-btn next" onClick={next}>❯</button>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
            {items.map((_, index) => (
              <div key={index} className={`slider-dot ${current === index ? 'active' : ''}`} onClick={() => goTo(index)} />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">{items[current].title}</h3>
          <p className="text-gray-400">{items[current].desc}</p>
        </div>
      </div>
    </section>
  );
}
