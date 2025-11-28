import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, X, ChevronLeft, ChevronRight, Star, Mail, Phone, Facebook, ArrowUp } from 'lucide-react';

// Hook for scroll animations - use RAF batching and avoid layout reads to prevent jank
const useScrollAnimation = () => {
  useEffect(() => {
    // Lower threshold for landing section to avoid stuck scroll
    const REMOVE_DELAY = 900;
    const removeTimers = new WeakMap<Element, number>();
    const lastAnimated = new WeakMap<Element, number>();

    const addVisible = (target: HTMLElement) => {
      if (target.classList.contains('visible')) return;
      requestAnimationFrame(() => {
        target.classList.add('visible');
        lastAnimated.set(target, performance.now());
      });
    };

    const scheduleRemoval = (target: HTMLElement) => {
      const prev = removeTimers.get(target);
      if (prev) clearTimeout(prev);
      const id = window.setTimeout(() => {
        target.classList.remove('visible');
        removeTimers.delete(target);
      }, REMOVE_DELAY);
      removeTimers.set(target, id);
    };

    let rafScheduled = false;
    const queue: IntersectionObserverEntry[] = [];

    const process = () => {
      rafScheduled = false;
      const items = queue.splice(0, queue.length);
      items.forEach((entry) => {
        const target = entry.target as HTMLElement;
        // If landing section, use lower threshold for animation
        if (target.id === 'home') {
          addVisible(target);
          const prev = removeTimers.get(target);
          if (prev) { clearTimeout(prev); removeTimers.delete(target); }
          return;
        }
        if (entry.isIntersecting) {
          addVisible(target);
          const prev = removeTimers.get(target);
          if (prev) { clearTimeout(prev); removeTimers.delete(target); }
        } else {
          scheduleRemoval(target);
        }
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => queue.push(e));
      if (!rafScheduled) {
        rafScheduled = true;
        requestAnimationFrame(process);
      }
    }, { threshold: 0.2 });

    const elements = Array.from(document.querySelectorAll('[data-animate-scroll]'));
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
      elements.forEach((el) => {
        const t = removeTimers.get(el);
        if (t) clearTimeout(t);
      });
    };
  }, []);
};

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlayActive, setIsAutoPlayActive] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  useScrollAnimation();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    // use passive listener to avoid blocking the main thread during scroll
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openLightbox = (images, index) => {
    setLightboxImage(images);
    setCurrentImageIndex(index);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % lightboxImage.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + lightboxImage.length) % lightboxImage.length);
  };

  const projects = [
    {
      id: 1,
      title: "Brand Identity Logo Design",
      category: "01",
      image: "/images/logo-design.jpg",
      description: "Complete brand identity system with modern typography and color schemes",
      details: "Developed comprehensive brand identity systems focusing on typography, color theory, and visual hierarchy to create memorable brand experiences across all touchpoints."
    },
    {
      id: 2,
      title: "Marketing Materials",
      category: "02", 
      image: "/images/construction-brochure.jpg",
      description: "Professional marketing collateral with clean, minimal design approach",
      details: "Created cohesive marketing materials including brochures, flyers, and business cards with emphasis on clean layouts, professional typography, and strategic use of white space."
    },
    {
      id: 3,
      title: "Social Media Posts",
      category: "03",
      image: "/images/social-media-design.jpeg",
      description: "Engaging social media graphics with consistent brand messaging",
      details: "Designed compelling social media content that maintains brand consistency while maximizing engagement through strategic use of color, typography, and visual hierarchy.",
      gallery: [
        "/images/forever-cream.jpg",
        "/images/fashion-post.jpg",
        "/images/headphones-offer.jpg"
      ]
    }
  ];

  const services = [
    { 
      title: "Brand Logos", 
      description: "Complete brand systems including logos, color palettes, and guidelines",
      number: "01",
      icon: "🎨"
    },
    { 
      title: "Logo Design", 
      description: "Memorable and scalable logos that represent your brand",
      number: "02",
      icon: "✏���"
    },
    { 
      title: "Social Media Posts", 
      description: "Engaging social templates and campaign designs",
      number: "03",
      icon: "📱"
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Tech Startup",
      rating: 5,
      image: "/images/logo-design.jpg",
      text: "NAFI delivered exceptional branding that perfectly captured our vision. Professional, creative, and reliable!"
    },
    {
      name: "Michael Chen",
      role: "E-commerce Brand",
      rating: 5,
      image: "/images/social-media-design.jpeg",
      text: "The social media designs increased our engagement by 200%. Outstanding work and great communication throughout."
    },
    {
      name: "Emily Rodriguez",
      role: "Local Business",
      rating: 5,
      image: "/images/construction-brochure.jpg",
      text: "Amazing attention to detail that helped us stand out in a competitive market. Highly recommended!"
    },
    {
      name: "Alex Thompson",
      role: "Fashion Brand",
      rating: 5,
      image: "/images/forever-cream.jpg",
      text: "The creativity and attention to detail in every design is unmatched. Boosted our brand presence significantly!"
    },
    {
      name: "Jessica Lee",
      role: "Digital Agency",
      rating: 5,
      image: "/images/fashion-post.jpg",
      text: "Working with NAFI was a game-changer. Every project exceeded our expectations. Highly recommend!"
    }
  ];

  // Auto-advance testimonials on mount
  useEffect(() => {
    if (!isAutoPlayActive) return;
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 3000); // 3s auto-advance
    return () => clearInterval(interval);
  }, [isAutoPlayActive, testimonials.length]);

  const stats = [
    { number: "150+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  const sliderItems = [
    { id: 1, title: "Brand Design", desc: "Complete brand identity", image: "/images/logo-design.jpg" },
    { id: 2, title: "Social Media", desc: "Engaging graphics", image: "/images/social-media-design.jpeg" },
    { id: 3, title: "Marketing", desc: "Professional materials", image: "/images/construction-brochure.jpg" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderItems.length) % sliderItems.length);
  };

  // Testimonials manual controls
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Autoplay pause/resume handling: pause temporarily on user interaction then resume
  const pauseTimeoutRef = useRef<number | null>(null);

  const clearPauseTimeout = () => {
    if (pauseTimeoutRef.current) {
      clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }
  };

  const pauseAutoplayFor = (ms = 8000) => {
    setIsAutoPlayActive(false);
    clearPauseTimeout();
    pauseTimeoutRef.current = window.setTimeout(() => {
      setIsAutoPlayActive(true);
      pauseTimeoutRef.current = null;
    }, ms);
  };

  // Swipe / drag state + refs
  const desktopWrapperRef = useRef<HTMLDivElement | null>(null);
  const mobileContainerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const deltaXRef = useRef(0);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const SWIPE_THRESHOLD = 50; // px

  const applyDesktopTranslate = (delta = 0) => {
    if (!desktopWrapperRef.current) return;
    const base = -currentTestimonial * desktopWrapperRef.current.clientWidth;
    // use transform in px to combine percent base is in px; easier: compute percent transform adjusted by delta
    desktopWrapperRef.current.style.transform = `translateX(calc(-${currentTestimonial * 100}% + ${delta}px))`;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pauseAutoplayFor();
    isDraggingRef.current = true;
    setIsDraggingState(true);
    startXRef.current = e.clientX;
    deltaXRef.current = 0;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const x = e.clientX;
    const delta = x - startXRef.current;
    deltaXRef.current = delta;
    // apply visual dragging only on desktop wrapper
    applyDesktopTranslate(delta);
  };

  const finishDrag = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDraggingState(false);
    const delta = deltaXRef.current;
    deltaXRef.current = 0;
    // reset transform
    if (desktopWrapperRef.current) {
      desktopWrapperRef.current.style.transform = '';
    }
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta < 0) {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      } else {
        setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    finishDrag();
    try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {}
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    finishDrag();
    try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {}
  };

  // ensure timeout cleared on unmount
  useEffect(() => {
    return () => {
      clearPauseTimeout();
    };
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white text-black font-['Inter'] overflow-x-hidden">
      <style>{`
        @keyframes slideUpIn {
          from {
            opacity: 0;
            transform: translateY(160px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(80px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* larger upward movement for stronger effect */
        [data-animate-scroll] {
          opacity: 0;
          transform: translateY(160px);
        }

        [data-animate-scroll].visible {
          animation: slideUpIn 1.1s cubic-bezier(.22,.9,.36,1) forwards;
        }
        
        [data-animate-scroll] .card-item {
          opacity: 0;
          transform: scale(0.9);
        }
        
        [data-animate-scroll].visible .card-item {
          animation: scaleIn 0.8s ease-out forwards;
        }
        
        [data-animate-scroll].visible .card-item:nth-child(1) {
          animation-delay: 0.1s;
        }
        
        [data-animate-scroll].visible .card-item:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        [data-animate-scroll].visible .card-item:nth-child(3) {
          animation-delay: 0.3s;
        }
        
        [data-animate-scroll].visible .card-item:nth-child(4) {
          animation-delay: 0.4s;
        }
        
        /* Slider styles */
        .slider-container {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .slider-wrapper {
          display: flex;
          transition: transform 0.5s ease-out;
        }
        
        .slider-item {
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .slider-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ccc;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slider-dot.active {
          background-color: #FFC107;
          width: 30px;
          border-radius: 5px;
        }
        
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(255, 255, 255, 0.8);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .slider-btn:hover {
          background-color: #FFC107;
          transform: translateY(-50%) scale(1.1);
        }
        
        .slider-btn.prev {
          left: 15px;
        }
        
        .slider-btn.next {
          right: 15px;
        }

        /* Floating animation for hero CTA */
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }

        .hero-cta {
          will-change: transform;
          animation: floatY 3.6s ease-in-out infinite;
        }

        .hero-cta:hover {
          animation-play-state: paused;
        }

        /* Testimonials carousel animations */
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideOutToLeft {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-100px);
          }
        }

        @keyframes scaleRotate {
          0% { transform: scale(0.95) rotateY(-10deg); opacity: 0; }
          50% { transform: scale(1.02) rotateY(2deg); }
          100% { transform: scale(1) rotateY(0); opacity: 1; }
        }

        .testimonial-card {
          animation: slideInFromRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .testimonial-card.exit {
          animation: slideOutToLeft 0.6s ease-in forwards;
        }

        .testimonial-avatar {
          animation: scaleRotate 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Positioning for testimonial nav buttons so they don't overlap avatar */
        .testimonial-nav-btn {
          position: absolute;
          top: 8%;
          background-color: rgba(255,255,255,0.95);
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 30;
          box-shadow: 0 8px 20px rgba(0,0,0,0.08);
          transition: transform 0.18s ease, background-color 0.18s ease;
        }

        .testimonial-nav-btn:hover { transform: scale(1.06); background-color: #FFC107; }

        .testimonial-nav-btn.prev { left: 12px; }
        .testimonial-nav-btn.next { right: 12px; }

        /* Cursor feedback for dragging */
        .testimonial-carousel-wrapper {
          cursor: grab;
          user-select: none;
        }

        .testimonial-carousel-wrapper.dragging {
          cursor: grabbing;
        }

        .testimonial-carousel-wrapper.dragging .flex {
          transition: none;
        }

        /* Scroll to top button styles */
        .scroll-to-top-btn {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 48px;
          height: 48px;
          background-color: #FFC107;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 50;
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.4);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(20px) scale(0.8);
          pointer-events: none;
        }

        .scroll-to-top-btn.visible {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }

        .scroll-to-top-btn:hover {
          background-color: #FFB300;
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.6);
          transform: translateY(-2px) scale(1.05);
        }

        .scroll-to-top-btn:active {
          transform: translateY(2px) scale(0.95);
        }
      `}</style>
      {/* Navigation */}
  <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-sm bg-white/95 border-b border-gray-100' : 'bg-transparent border-b-0'} ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <div className="relative h-12 w-12">
                    <img
                      src="/images/nafi-logo-white.png"
                      alt="Nafeel Logo"
                      className={`absolute inset-0 h-12 w-12 object-contain transition-opacity duration-300 ease-in-out ${scrolled ? 'opacity-0' : 'opacity-100'}`}
                      aria-hidden={scrolled}
                    />
                    <img
                      src="/images/nafi-logo-new.jpg"
                      alt="Nafeel Logo"
                      className={`absolute inset-0 h-12 w-12 object-contain transition-opacity duration-300 ease-in-out ${scrolled ? 'opacity-100' : 'opacity-0'}`}
                      aria-hidden={!scrolled}
                    />
                  </div>
                  <h1 className={`${scrolled ? 'text-xl font-bold text-black' : 'text-xl font-bold text-white'} tracking-tight`}>
                    NAFI CREATIONS
                  </h1>
                </div>
              </div>
            </div>
            <div className="hidden md:flex space-x-12">
              {['HOME', 'ABOUT', 'PORTFOLIO', 'SERVICES', 'CONTACT'].map((item, index) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`${scrolled ? 'text-sm font-medium text-gray-600 hover:text-black' : 'text-sm font-medium text-white hover:text-white/90'} transition-colors duration-200 tracking-wide uppercase transform hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {item}
                </button>
              ))}
            </div>
            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-md focus:outline-none ${scrolled ? 'text-gray-800' : 'text-white'}`}
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-white/95 backdrop-blur-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-10">
                  <img src="/images/nafi-logo-white.png" alt="Nafi" className={`absolute inset-0 h-10 w-10 object-contain transition-opacity duration-300 ease-in-out ${scrolled ? 'opacity-0' : 'opacity-100'}`} />
                  <img src="/images/nafi-logo-new.jpg" alt="Nafi" className={`absolute inset-0 h-10 w-10 object-contain transition-opacity duration-300 ease-in-out ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
                </div>
                <div className="text-lg font-bold">NAFI CREATIONS</div>
              </div>
              <button aria-label="Close menu" onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {['HOME', 'ABOUT', 'PORTFOLIO', 'SERVICES', 'CONTACT'].map((item) => (
                <button key={item} onClick={() => { setMobileMenuOpen(false); scrollToSection(item.toLowerCase()); }} className="text-lg font-medium text-gray-800 text-left">
                  {item}
                </button>
              ))}
            </nav>
          </div>
        )}
      </nav>

      {/* Hero Section - New Design */}
  <section id="home" className="min-h-screen pt-32 pb-24 flex items-center justify-center relative bg-white overflow-hidden">
    {/* Responsive background images: desktop and mobile */}
    <div className="absolute inset-0 hidden lg:block" style={{ backgroundImage: "url('/images/landing%20page%20bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div className="absolute inset-0 block lg:hidden" style={{ backgroundImage: "url('/images/mob%20view.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    {/* Yellow accent elements with animations */}
    <div className={`absolute top-20 left-8 w-1 h-32 bg-[#FFC107] transition-all duration-1000 delay-500 ${isLoaded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}></div>
        <div className={`absolute bottom-20 right-8 w-32 h-1 bg-[#FFC107] transition-all duration-1000 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
          <div className="mb-16">
            {/* Main heading with staggered animation */}
            <div className="mb-8">
              <h1 className={`text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                NAFI
              </h1>
              <h1 className={`text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                CREATIONS
              </h1>
            </div>
            
            {/* Yellow accent bars with animation */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              <div className={`w-16 h-1 bg-[#FFC107] transition-all duration-800 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
              <div className={`w-16 h-1 bg-[#FFC107] transition-all duration-800 delay-800 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
            </div>
            
            {/* Subtitle with fade-in */}
            <p className={`text-xl font-light tracking-wide text-white mb-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Design beyond limits
            </p>
            
            {/* Description with fade-in */}
            <p className={`text-base text-white max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Creating impactful visual experiences through minimal design, bold typography, and strategic use of color that resonate with audiences and drive results.
            </p>
          </div>
          
          {/* CTA Button with hover animations */}
          <div className={`transition-all duration-1000 delay-1100 mb-8 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Button 
              onClick={() => scrollToSection('portfolio')}
              size="lg" 
              className="hero-cta bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-6 py-3 text-base rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 uppercase tracking-wide transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              VIEW MY WORK
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" data-animate-scroll className="py-32 bg-white relative">
        {/* Yellow accent */}
        <div className="absolute top-20 right-8 w-2 h-32 bg-[#FFC107]"></div>
        
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Text Content - Left Side */}
            <div className="space-y-8">
              <div>
                <h2 className="text-6xl font-black mb-8 text-black tracking-tight">ABOUT ME</h2>
                <div className="w-16 h-1 bg-[#FFC107] mb-12"></div>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Passionate graphic designer with expertise in creating compelling visual narratives that resonate with audiences and drive results.
                </p>
                <p className="text-base text-gray-500 leading-relaxed mb-12">
                  I'm a passionate graphic designer with over 5 years of experience creating minimal, impactful designs that tell stories and build brands. My approach focuses on clean aesthetics, bold typography, and strategic use of color to create memorable visual experiences.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-12">
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none">Adobe Creative Suite</Badge>
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none">Brand Identity</Badge>
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none">Typography</Badge>
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none">Print Design</Badge>
                </div>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-black text-black hover:bg-black hover:text-white font-semibold px-8 py-4 rounded-none transition-all duration-300 uppercase tracking-wide"
                >
                  Download CV
                </Button>
              </div>
            </div>

            {/* Professional Photo - Right Side */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Yellow accent elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 border-4 border-[#FFC107]"></div>
                <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-[#FFC107]"></div>
                
                {/* Main Photo */}
                <div className="relative w-100 h-96 overflow-hidden border-8 border-white shadow-2xl rounded-full">
                  <img 
                    src="/images/nafi-profile.png"
                    alt="Nafi - Graphic Designer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Experience Badge */}
                <div className="absolute -bottom-6 -right-6 bg-white p-6 shadow-xl border-l-4 border-[#FFC107]">
                  <div className="text-3xl font-black text-black mb-1">5+</div>
                  <div className="text-sm text-gray-600 font-medium uppercase tracking-wide">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" data-animate-scroll className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-black tracking-tight">
              Selected Works
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A curated collection of my best design work across various categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={project.id}
                className="group cursor-pointer border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden"
                onClick={() => setSelectedProject(project)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-[#FFC107] text-black font-bold text-sm px-3 py-1 rounded-full">
                      {project.category}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>
                <CardContent className="p-6 bg-white">
                  <h3 className="text-lg font-bold mb-3 text-black tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {project.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Slider Section */}
      <section data-animate-scroll className="py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-6 text-white tracking-tight">
              Featured Projects
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mx-auto"></div>
          </div>

          <div className="slider-container relative bg-white rounded-xl overflow-hidden shadow-2xl">
            <div className="slider-wrapper" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {sliderItems.map((item) => (
                <div key={item.id} className="slider-item">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              ))}
            </div>

            <button className="slider-btn prev" onClick={prevSlide}>
              ❮
            </button>
            <button className="slider-btn next" onClick={nextSlide}>
              ❯
            </button>

            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
              {sliderItems.map((_, index) => (
                <div
                  key={index}
                  className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-2xl font-bold text-black mb-2">
              {sliderItems[currentSlide].title}
            </h3>
            <p className="text-gray-600">
              {sliderItems[currentSlide].desc}
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" data-animate-scroll className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-black tracking-tight">
              Services
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive design solutions tailored to your brand needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="group p-6 bg-white hover:bg-gray-50 transition-all duration-300 text-center shadow-sm hover:shadow-md"
              >
                <div className="text-3xl mb-4">{service.icon}</div>
                <div className="text-2xl font-black text-[#FFC107] mb-4">
                  {service.number}
                </div>
                <h3 className="text-lg font-bold mb-3 text-black tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section data-animate-scroll className="py-24 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-6 text-black tracking-tight">
              Client Testimonials
            </h2>
            <div className="w-12 h-1 bg-[#FFC107] mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What my clients say about working with me
            </p>
          </div>

          {/* Desktop: Continuous Carousel */}
          <div className="hidden lg:block">
            <div
              className={`relative overflow-hidden rounded-xl testimonial-carousel-wrapper ${isDraggingState ? 'dragging' : ''}`}
              onMouseEnter={() => { clearPauseTimeout(); setIsAutoPlayActive(false); }}
              onMouseLeave={() => { clearPauseTimeout(); setIsAutoPlayActive(true); }}
              onTouchStart={() => { clearPauseTimeout(); setIsAutoPlayActive(false); }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerCancel}
            >
              <div
                ref={desktopWrapperRef}
                className="flex transition-all duration-500 ease-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full flex-shrink-0 px-6">
                    <div className="testimonial-card bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-shadow">
                      <div className="flex items-start gap-6">
                        <div className="testimonial-avatar flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-[#FFC107] shadow-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex gap-1 mb-3">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-[#FFC107] text-[#FFC107]" />
                            ))}
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed italic text-lg">
                            "{testimonial.text}"
                          </p>
                          <div>
                            <div className="font-bold text-black text-base">{testimonial.name}</div>
                            <div className="text-gray-500 text-sm">{testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Prev/Next controls for desktop testimonials (placed higher to avoid avatar overlap) */}
              <button
                aria-label="Previous testimonial"
                className="slider-btn prev testimonial-nav-btn"
                onClick={() => { prevTestimonial(); pauseAutoplayFor(); }}
              >
                ❮
              </button>
              <button
                aria-label="Next testimonial"
                className="slider-btn next testimonial-nav-btn"
                onClick={() => { nextTestimonial(); pauseAutoplayFor(); }}
              >
                ❯
              </button>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentTestimonial(index); pauseAutoplayFor(); }}
                  onMouseEnter={() => { clearPauseTimeout(); setIsAutoPlayActive(false); }}
                  onMouseLeave={() => { clearPauseTimeout(); setIsAutoPlayActive(true); }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-[#FFC107] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Mobile: One per screen with animation */}
          <div
            className={`lg:hidden testimonial-carousel-wrapper ${isDraggingState ? 'dragging' : ''}`}
            ref={mobileContainerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <div className="overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`testimonial-card transition-all duration-500 ${
                    currentTestimonial === index ? 'block' : 'hidden'
                  }`}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <div className="flex flex-col items-center text-center">
                      <div className="testimonial-avatar mb-4">
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-[#FFC107] shadow-md"
                        />
                      </div>
                      <div className="flex gap-1 mb-4 justify-center">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-[#FFC107] text-[#FFC107]" />
                        ))}
                      </div>
                      <p className="text-gray-700 mb-4 leading-relaxed italic text-base">
                        "{testimonial.text}"
                      </p>
                      <div>
                        <div className="font-bold text-black text-base">{testimonial.name}</div>
                        <div className="text-gray-500 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => { setCurrentTestimonial(index); pauseAutoplayFor(); }}
                  onTouchStart={() => { clearPauseTimeout(); setIsAutoPlayActive(false); }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentTestimonial === index ? 'bg-[#FFC107] w-8' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-animate-scroll className="py-20 bg-[#FFC107]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl font-black text-black mb-2">
                  {stat.number}
                </div>
                <p className="text-sm font-semibold text-black tracking-wide uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" data-animate-scroll className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-black mb-6 text-black tracking-tight">
            Let's Work Together
          </h2>
          <div className="w-12 h-1 bg-[#FFC107] mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 mb-12">
            Ready to bring your vision to life? Let's discuss your next project
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center">
              <Mail className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">Email</h3>
              <p className="text-gray-600 text-sm">nafix2103@gmail.com</p>
            </div>
            <div className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center">
              <Phone className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">Phone</h3>
              <p className="text-gray-600 text-sm">03266438203</p>
            </div>
            <div className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center">
              <Facebook className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">Social</h3>
              <p className="text-gray-600 text-sm">Nafi Rj</p>
            </div>
          </div>

          <Button 
            size="lg"
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-8 py-3 text-base rounded-full transition-all duration-300 hover:shadow-lg"
          >
            Start a Project
          </Button>
        </div>
      </section>

      {/* Lightbox Dialog */}
      {lightboxImage && (
        <Dialog open={!!lightboxImage} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-0">
            <div className="relative">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {lightboxImage.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              <div className="flex items-center justify-center min-h-[60vh] max-h-[80vh]">
                <img
                  src={lightboxImage[currentImageIndex]}
                  alt={`Gallery image ${currentImageIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>

              {lightboxImage.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 px-4 py-2 rounded-full">
                  <span className="text-white text-sm font-medium">
                    {currentImageIndex + 1} / {lightboxImage.length}
                  </span>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Project Details Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          {selectedProject && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{selectedProject.title}</h3>
                  <Badge className="bg-[#FFC107] text-black font-semibold">
                    {selectedProject.category}
                  </Badge>
                </div>
              </div>
              
              {selectedProject.gallery ? (
                <div className="space-y-6">
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.details}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedProject.gallery.map((image, index) => (
                      <div 
                        key={index} 
                        className="relative overflow-hidden rounded-lg group cursor-pointer"
                        onClick={() => openLightbox(selectedProject.gallery, index)}
                      >
                        <img 
                          src={image} 
                          alt={`${selectedProject.title} ${index + 1}`}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-400"></div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                          <div className="bg-white/90 p-2 rounded-full transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <ExternalLink className="w-5 h-5 text-gray-800" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative overflow-hidden rounded-lg">
                    <img 
                      src={selectedProject.image} 
                      alt={selectedProject.title}
                      className="w-full h-96 object-cover"
                    />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProject.details}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`scroll-to-top-btn ${showScrollToTop ? 'visible' : ''}`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6 text-black" />
      </button>
    </div>
  );
}