import emailjs from "@emailjs/browser"; 
import { Button } from '@/components/ui/button';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// EmailJS will be loaded dynamically
// Use small inline SVGs to avoid pulling icon library into the initial bundle
const ExternalLinkIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
  </svg>
);

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

const MailIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const FacebookIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden>
    <path d="M22 12c0-5.522-4.478-10-10-10S2 6.478 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.99H7.898v-2.888h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.462h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.888h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
  </svg>
);

const ArrowUpIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V6" />
    <path d="M5 12l7-7 7 7" />
  </svg>
);
// Small inline Star SVG to avoid importing icon library for each star
const Star = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="#FFC107" aria-hidden>
    <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.563L19.335 24 12 20.201 4.665 24l1.635-8.687L.6 9.75l7.732-1.732L12 .587z" />
  </svg>
);
// (removed lazy import for the older `Testimonials` file to avoid duplicate-symbol build issues)
// Lazy-load ClientTestimonials (single-card carousel)
const ClientTestimonials = React.lazy(() => import('./ClientTestimonials'));
// Lazy-load FeaturedSlider to keep slider out of initial bundle
const FeaturedSlider = React.lazy(() => import('./FeaturedSlider'));

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
  const [isAndroidDevice, setIsAndroidDevice] = useState(false);

  useEffect(() => {
    try {
      const ua = navigator.userAgent || '';
      const isAndroidUA = /Android/i.test(ua);
      // navigator.userAgentData is newer and more privacy-preserving when available
      const navData = (navigator as any).userAgentData;
      const isAndroidUAData = navData && ((navData.platform || '').toLowerCase().includes('android') || navData.mobile === true);
      // Mark Android if either detection method says so. Avoid tying to width so Android tablets still get animations if intended.
      const isAndroid = Boolean(isAndroidUA || isAndroidUAData);
      setIsAndroidDevice(isAndroid);
      console.log('[Android Detection] UA:', ua.slice(0, 80), 'isAndroidUA:', isAndroidUA, 'isAndroidUAData:', isAndroidUAData, 'Final:', isAndroid);
    } catch (e) {
      setIsAndroidDevice(false);
      console.error('[Android Detection Error]', e);
    }
  }, []);

  // Log isAndroidDevice changes
  useEffect(() => {
    console.log('[Home.tsx] isAndroidDevice updated:', isAndroidDevice);
  }, [isAndroidDevice]);

  const MotionNav = motion.nav;
  const MotionSection = motion.section;
  const MotionDiv = motion.div;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.12, duration: 0.8 } }
  };
  const itemVariants = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
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
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [inquiryError, setInquiryError] = useState('');
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', description: '', budget: '', timeline: '' });
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
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

  // Prevent body scroll when mobile menu is open
  const scrollPositionRef = useRef(0);
  
  useEffect(() => {
    if (mobileMenuOpen) {
      // Save current scroll position before fixing
      scrollPositionRef.current = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.width = '100%';
    } else {
      // Restore scroll position after unfixing
      const savedScrollY = scrollPositionRef.current;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, savedScrollY);
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [mobileMenuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInquiryChange = (e) => {
    const { name, value } = e.target;
    setInquiryForm(prev => ({ ...prev, [name]: value }));
  };

const handleInquirySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Basic validation
  if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.description.trim()) {
    setInquiryError('Please fill in all required fields (Name, Email, and Description).');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(inquiryForm.email)) {
    setInquiryError('Please enter a valid email address.');
    return;
  }

  setInquiryLoading(true);
  setInquiryError('');

  try {
    // EmailJS template parameters
    const templateParams = {
      from_name: inquiryForm.name,
      from_email: inquiryForm.email,
      to_email: 'nafix2103@gmail.com',
      project_description: inquiryForm.description,
      budget: inquiryForm.budget || 'Not specified',
      timeline: inquiryForm.timeline || 'Not specified',
    };

    // Send email via EmailJS npm package
    await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );

    // Reset form & show success
    setInquiryForm({ name: '', email: '', description: '', budget: '', timeline: '' });
    setShowInquiryModal(false);
    setShowThankYouMessage(true);

    setTimeout(() => setShowThankYouMessage(false), 5000);

  } catch (error: unknown) {
    console.error('Full error:', error);
    console.error('Service ID:', import.meta.env.VITE_EMAILJS_SERVICE_ID ? 'Set' : 'NOT SET');
    console.error('Template ID:', import.meta.env.VITE_EMAILJS_TEMPLATE_ID ? 'Set' : 'NOT SET');
    console.error('Public Key:', import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 'Set' : 'NOT SET');

    let errorMessage = 'Failed to send inquiry. ';
    
    // Check if environment variables are missing
    if (!import.meta.env.VITE_EMAILJS_PUBLIC_KEY || !import.meta.env.VITE_EMAILJS_SERVICE_ID || !import.meta.env.VITE_EMAILJS_TEMPLATE_ID) {
      errorMessage = 'EmailJS is not properly configured. Please contact the site administrator.';
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage += (error as { message: string }).message;
    } else if (error instanceof Error) {
      errorMessage += error.message;
    } else {
      errorMessage += 'Please check your internet connection and try again.';
    }
    setInquiryError(errorMessage);

  } finally {
    setInquiryLoading(false);
  }
  };

  const scrollToSection = (sectionId) => {
    // Reset body styles first to allow scrolling
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    
    // Small delay to ensure styles are reset before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
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
      details: "Developed comprehensive brand identity systems focusing on typography, color theory, and visual hierarchy to create memorable brand experiences across all touchpoints.",
      gallery: [
        "/images/LOGO CMPLD  BLACK.jpg",
        "/images/office.jpg",
      ]
    },
    {
      id: 2,
      title: "Marketing Materials",
      category: "02", 
      image: "/images/construction-brochure.jpg",
      description: "Professional marketing collateral with clean, minimal design approach",
      details: "Created cohesive marketing materials including brochures, flyers, and business cards with emphasis on clean layouts, professional typography, and strategic use of white space.",
       gallery: [
         "/images/papad123.jpg",
      ]
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
        "/images/headphones-offer.jpg",
        "/images/BOAT WATCH BY NAFI.jpg",
        "/images/food menu 1 completed.jpg",
        "/images/food.jpg",
        "/images/LOGO CMPLD  BLACK.jpg",
        "/images/office.jpg",
        "/images/papad123.jpg",
      ]
    }
  ];

  const services = [
    { 
      title: "Brand Identity", 
      description: "Complete brand systems including logos, color palettes, and guidelines",
      number: "01",
      icon: "/images/branding-identity.gif"
    },
    { 
      title: "Logo Design", 
      description: "Memorable and scalable logos that represent your brand",
      number: "02",
      icon: "/images/logo-design.gif"
    },
    { 
      title: "Social Media Posts", 
      description: "Engaging social templates and campaign designs",
      number: "03",
      icon: "/images/post.gif"
    },
    { 
      title: "Brochures & Flyers", 
      description: "Engaging social templates and campaign designs",
      number: "04",
      icon: "/images/flyer.gif"
    },

     { 
      title: "Web & Android UI/UX Templates", 
      description: "Custom UI/UX templates for responsive web and Android applications.",
      number: "05",
      icon: "/images/responsive-design.gif"
    },

     { 
      title: "Custom Website Development", 
      description: "Designing and developing custom websites with modern code, secure hosting, and complete domain setup.",
      number: "06",
      icon: "/images/web-code.gif"
    },
  ];

  const testimonials = [
    {
      name: "Maryam",
      role: "Tech Startup",
      rating: 4,
      image: "/images/maryam@.jpg",
      text: "The service was reliable and the communication smooth throughout. Kuch choti delays hui, but the final result was definitely worth it."  
    },
      { 
        name: "Irtza Imtiaz",
      role: "E-commerce Brand",
      rating: 5,
      image: "/images/irtza.jpg",
      text: "The service was smooth from start to finish — everything delivered exactly the way my e-commerce brand required."
    },
    {
      name: "Emily Rodriguez",
      role: "Local Business",
      rating: 5,
      image: "/images/emily.jpg",
      text: "Amazing attention to detail that helped us stand out in a competitive market. Highly recommended!"
    },
    {
      name: "Alex Thompson",
      role: "Fashion Brand",
      rating: 4,
      image: "/images/alex.jpg",
      text: "Really impressed with how smoothly everything was handled — the final outcome matched our fashion brand’s style perfectly."
    },
    {
      name: "Zayden Faruq",
      role: "Digital Agency",
      rating: 5,
      image: "/images/furqan.jpg",
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
    { number: "50+", label: "Projects Completed" },
    { number: "42+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "94%", label: "Client Satisfaction" }
  ];

  const sliderItems = [
    { id: 1, title: "Social Media Post", desc: "Engaging graphics", image: "/images/boat.png" },
    { id: 2, title: "Social Media Post", desc: "Engaging graphics", image: "/images/deliciuos.png" },
    { id: 3, title: "Social Media Post", desc: "Engaging graphics", image: "/images/CREAM.png" },
    { id: 4, title: "Marketing", desc: "Professional materials", image: "/images/pappad.png"},
    { id: 5, title: "Social Media Post", desc: "Engaging graphics", image: "/images/headphone.png"},
    { id: 6, title: "Social Media Post", desc: "Engaging graphics", image: "/images/fashion.png"},
    { id: 7, title: "Social Media Post", desc: "Engaging graphics", image: "/images/burger.png"},
    { id: 8, title: "Logo Design", desc: "Smart Brand Identity", image: "/images/mermaid.png"},
    { id: 9, title: "Logo Design", desc: "Smart Brand Identity", image: "/images/gaminglogo.png"},
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

        @keyframes scaleRotate {
          0% {
            transform: scale(0) rotate(-30deg);
          }
          100% {
            transform: scale(1) rotate(0);
          }
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
    <MotionNav initial={isAndroidDevice ? { y: -24, opacity: 0 } : undefined} animate={isAndroidDevice ? { y: 0, opacity: 1 } : undefined} transition={isAndroidDevice ? { duration: 0.7, ease: 'easeOut' } : undefined} className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-sm bg-white/95 border-b border-gray-100' : 'bg-transparent border-b-0'} ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
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
                  <h1 className={`${scrolled ? 'text-x1 font-bold text-black' : 'text-x1 font-bold text-white'} tracking-tight`}>
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
              <button
                onClick={() => setShowInquiryModal(true)}
                className={`${scrolled ? 'text-sm font-medium text-[#FFC107] hover:text-[#FFB300]' : 'text-sm font-medium text-[#FFC107] hover:text-white'} transition-colors duration-200 tracking-wide uppercase transform hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${5 * 100}ms` }}
              >
                INQUIRY
              </button>
            </div>
            {/* Mobile hamburger */}
            <div className="md:hidden flex items-center">
              <button
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileMenuOpen(!mobileMenuOpen); }}
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
      </MotionNav>

      {/* Mobile menu overlay - clicking closes menu (full viewport coverage) */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed bg-black/50"
          style={{ zIndex: 9998, top: 0, left: 0, right: 0, bottom: 0, position: 'fixed' }}
          onMouseDown={() => setMobileMenuOpen(false)}
          onTouchStart={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Menu panel - right side drawer 50% width (outside nav for full screen coverage) */}
      <div 
        className={`md:hidden fixed top-0 right-0 bottom-0 bg-white overflow-y-auto overscroll-contain shadow-2xl transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ zIndex: 9999, width: '50vw', height: '100vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 pb-12 flex flex-col bg-white h-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <img src="/images/nafi-logo-new.jpg" alt="Nafi" className="h-8 w-8 object-contain" />
              </div>
              <div className="text-sm font-bold text-gray-900">NAFI CREATIONS</div>
            </div>
            <button aria-label="Close menu" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileMenuOpen(false); }} className="p-2 rounded-md text-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col space-y-3 bg-white flex-1">
            {['HOME', 'ABOUT', 'PORTFOLIO', 'SERVICES', 'CONTACT'].map((item) => (
              <button key={item} onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); scrollToSection(item.toLowerCase()); }} className="text-base font-semibold text-gray-900 text-left py-3 px-2 border-b border-gray-200 bg-white">
                {item}
              </button>
            ))}
            <button
              onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); setShowInquiryModal(true); }}
              className="text-base font-semibold text-[#FFC107] text-left py-3 px-2 bg-white"
            >
              INQUIRY
            </button>
          </nav>
        </div>
      </div>

      {/* Hero Section - New Design */}
  <MotionSection id="home" className="min-h-screen pt-32 pb-24 flex items-center justify-center relative bg-white overflow-hidden" initial={isAndroidDevice? 'hidden': undefined} animate={isAndroidDevice? 'visible': undefined} variants={isAndroidDevice? containerVariants: undefined}>
    {/* Responsive background images: desktop and mobile */}
    <div className="absolute inset-0 hidden lg:block" style={{ backgroundImage: "url('/images/landing%20page%20bg.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    <div className="absolute inset-0 block lg:hidden" style={{ backgroundImage: "url('/images/mob%20view.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
    {/* Yellow accent elements with animations */}
    <div className={`absolute top-20 left-8 w-1 h-32 bg-[#FFC107] transition-all duration-1000 delay-500 ${isLoaded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}></div>
        <div className={`absolute bottom-20 right-8 w-32 h-1 bg-[#FFC107] transition-all duration-1000 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
        
        <MotionDiv className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 md:px-8" variants={isAndroidDevice? itemVariants: undefined} style={isAndroidDevice? { willChange: 'transform, opacity' } : undefined}>
          <div className="mb-8 md:mb-16">
            {/* Main heading with staggered animation */}
            <div className="mb-4 md:mb-8">
              {isAndroidDevice ?
               (
                <>
                 <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white">NAFI</motion.h1> <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white">CREATIONS</motion.h1>
                  </>
              ) : (
                <>
  <h1
    className={`text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-black leading-none tracking-tighter text-white
    transition-all duration-1000 delay-300 ease-out
    ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}
  >
    NAFI
  </h1>

  <h1
    className={`text-5xl sm:text-6xl md:text-7xl lg:text-[90px] font-black leading-none tracking-tighter text-white
    transition-all duration-1000 delay-500 ease-out
    ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-0 opacity-100'}`}
  >
    CREATIONS
  </h1>
 </>
              )}
            </div>

          {/* Yellow accent bars with animation */}
          <div className="flex justify-center items-center space-x-0 mb-6 md:mb-12">
            <div className={`w-12 sm:w-16 md:w-20 h-1 bg-[#FFC107] transition-all duration-800 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
            <div className={`w-12 sm:w-16 md:w-20 h-1 bg-[#FFC107] transition-all duration-800 delay-800 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
          </div>
            


            
            {/* Subtitle with fade-in */}
          
            <p className={`text-lg sm:text-xl font-light tracking-wide text-white mb-4 md:mb-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Design beyond limits
            </p>
            
            {/* Description with fade-in */}
            <p className={`text-sm sm:text-base text-white max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12 px-2 transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Creating bold visual experiences where creativity meets structure and flow.
              A fusion of graphic design, UI/UX, and front-end development built for modern brands.
            </p>
          </div>
          
          {/* CTA Button with hover animations */}
          <div className={`transition-all duration-1000 delay-1100 mb-4 md:mb-8 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Button 
              onClick={() => {
                setShowResumeModal(true);
                setShowDownloadButton(false);
                // Show download button after a short delay (after user views PDF)
                setTimeout(() => setShowDownloadButton(true), 1500);
              }}
              size="lg"
              className="hero-cta bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105 uppercase tracking-wide transform hover:-translate-y-1 inline-flex items-center justify-center"
            >
              VIEW MY RESUME
            </Button>
          </div>
          </MotionDiv>
        </MotionSection>

      {/* About Section */}
      <MotionSection id="about" data-animate-scroll className="py-32 bg-white relative" initial={isAndroidDevice? { opacity: 0, y: 18 } : undefined} whileInView={isAndroidDevice? { opacity: 1, y: 0 } : undefined} viewport={isAndroidDevice? { once: true, amount: 0.2 } : undefined} transition={isAndroidDevice? { duration: 0.8, ease: 'easeOut' } : undefined}>
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
                  As a multidisciplinary designer and front-end developer, I bring ideas to life through thoughtful design and clean, purposeful interfaces. My work spans graphic design, UI/UX, and front-end development, allowing me to create visually engaging and user-friendly digital experiences.
                </p>
                <p className="text-base text-gray-500 leading-relaxed mb-12">
                  I specialize in layout design, typography, color systems and responsive interfaces with hands-on experience using tools like Adobe Photoshop, Adobe Illustrator, Adobe XD, Figma, VScode, React, Tailwind CSS and modern UI libraries. My approach focuses on clarity, consistency and usability—ensuring every design not only looks good but works seamlessly.

                  I’m driven by creativity, continuous learning and the challenge of turning complex ideas into simple elegant solutions that connect with users.
                </p>
                
                <div className="flex flex-wrap gap-3 mb-12">
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none transition-none hover:bg-[#FFC107]">Graphic Design</Badge>
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none transition-none hover:bg-[#FFC107]">UI/UX Design</Badge>
                  <Badge className="bg-[#FFC107] text-black px-4 py-2 text-sm font-medium rounded-none transition-none hover:bg-[#FFC107]">Front-End Development</Badge>
                </div>
                
               <Button
  variant="outline"
  size="lg"
  onClick={() => scrollToSection('contact')}
  className="
    border-2 border-black
    bg-gradient-to-tr from-white via-gray-600 to-gray-800
    text-black
    font-semibold
    px-8 py-4
    rounded-none
    uppercase tracking-wide
    transition-all duration-300
    hover:from-gray-700 hover:via-gray-800 hover:to-gray-950
    hover:text-white
  "
>
  Get In Touch
</Button>

              </div>
            </div>

            {/* Professional Photo - Right Side */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Yellow accent elements */}
                <div className="absolute -top-8 -right-8 w-16 h-16 border-4 border-[#FFC107]"></div>
                <div className="absolute -bottom-8 -left-8 w-6 h-12 bg-[#FFC107]"></div>
                
                {/* Main Photo */}
                <div className="relative w-100 h-96 overflow-hidden border-8 border-white shadow-2xl rounded-full">
                  <img 
                    src="/images/nafi-profile.png"
                    alt="Nafi - Graphic Designer" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Name Below Photo */}
                <div className="text-center mt-8">
                  <h3 className="text-3xl font-black text-black tracking-tight">Nafeel Qamar</h3>
                  <p className="text-gray-600 font-medium mt-2">Graphic Designer & Developer</p>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </MotionSection>


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
                    loading="lazy"
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

      {/* Image Slider Section (lazy-loaded) */}
      <section data-animate-scroll>
        <Suspense fallback={
          <div className="py-24 bg-gray-900">
            <div className="max-w-5xl mx-auto px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Loading slider...</h2>
              </div>
            </div>
          </div>
        }>
          <FeaturedSlider items={sliderItems} />
        </Suspense>
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
                
                <div className="mb-4 flex justify-center">
  <img
    src={service.icon}
    alt={service.title}
    loading="eager"
    onError={(e) => {
      (e.target as HTMLImageElement).onerror = null;
      (e.target as HTMLImageElement).src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%23f3f4f6'/><circle cx='32' cy='28' r='8' fill='%23d1d5db'/><path d='M8 56h48v-2H8z' fill='%23d1d5db'/></svg>";
    }}
    className="w-16 h-16 object-contain"
  />
</div>

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
      <MotionSection data-animate-scroll className="py-24 bg-gradient-to-br from-white to-gray-50" initial={isAndroidDevice? { opacity: 0, y: 18 } : undefined} whileInView={isAndroidDevice? { opacity: 1, y: 0 } : undefined} viewport={isAndroidDevice? { once: true, amount: 0.2 } : undefined} transition={isAndroidDevice? { duration: 0.8, ease: 'easeOut' } : undefined}>
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

          {/* Testimonials: use single-card ClientTestimonials component (lazy loaded) */}
          <div>
            <Suspense fallback={<div className="py-12"><div className="max-w-3xl mx-auto p-6 rounded-2xl bg-white shadow">Loading testimonials...</div></div>}>
              <ClientTestimonials />
            </Suspense>
          </div>
        </div>
      </MotionSection>

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
            <button 
              onClick={() => window.location.href = 'mailto:nafix2103@gmail.com'}
              className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center cursor-pointer block w-full"
            >
              <MailIcon className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">Email</h3>
              <p className="text-gray-600 text-sm">nafix2103@gmail.com</p>
            </button>
            <a 
              href="https://wa.me/923266438203" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center cursor-pointer block"
            >
              <WhatsAppIcon className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">WhatsApp</h3>
              <p className="text-gray-600 text-sm">03266438203</p>
            </a>
            <a 
              href="https://web.facebook.com/nafi.rj.creative?_rdc=1&_rdr#" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-6 hover:bg-gray-50 transition-all duration-300 text-center cursor-pointer block"
            >
              <FacebookIcon className="w-8 h-8 text-[#FFC107] mx-auto mb-3" />
              <h3 className="text-base font-bold mb-2 text-black">Social</h3>
              <p className="text-gray-600 text-sm">Nafi Rj</p>
            </a>
          </div>

          <Button 
            onClick={() => setShowInquiryModal(true)}
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
                <XIcon className="w-6 h-6 text-white" />
              </button>

              {lightboxImage.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                  >
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                  >
                    <ChevronRightIcon className="w-6 h-6 text-white" />
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
                            <ExternalLinkIcon className="w-5 h-5 text-gray-800" />
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
        <ArrowUpIcon className="w-6 h-6 text-black" />
      </button>

      {/* Inquiry Modal */}
      <Dialog open={showInquiryModal} onOpenChange={setShowInquiryModal}>
        <DialogContent className="max-w-md lg:max-w-lg w-[90vw] md:w-auto bg-white max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl md:text-3xl font-black text-black">Send an Inquiry</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInquirySubmit} className="space-y-4 md:space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-black mb-2">Name *</label>
              <input
                type="text"
                name="name"
                value={inquiryForm.name}
                onChange={handleInquiryChange}
                required
                className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFC107] transition-colors text-sm md:text-base"
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-black mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={inquiryForm.email}
                onChange={handleInquiryChange}
                required
                className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFC107] transition-colors text-sm md:text-base"
                placeholder="Your email"
              />
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-black mb-2">Project Description *</label>
              <textarea
                name="description"
                value={inquiryForm.description}
                onChange={handleInquiryChange}
                required
                className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFC107] transition-colors resize-none text-sm md:text-base"
                placeholder="Tell me about your project..."
                rows={3}
              />
            </div>

            {/* Budget */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-black mb-2">Budget (Optional)</label>
              <input
                type="text"
                name="budget"
                value={inquiryForm.budget}
                onChange={handleInquiryChange}
                className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFC107] transition-colors text-sm md:text-base"
                placeholder="e.g., $5000 - $10000"
              />
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-black mb-2">Timeline (Optional)</label>
              <input
                type="text"
                name="timeline"
                value={inquiryForm.timeline}
                onChange={handleInquiryChange}
                className="w-full px-3 md:px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#FFC107] transition-colors text-sm md:text-base"
                placeholder="e.g., 2 weeks, ASAP"
              />
            </div>

            {/* Error Message */}
            {inquiryError && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-3 md:p-4">
                <p className="text-red-700 text-xs md:text-sm font-semibold">{inquiryError}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-end pt-2 md:pt-4">
              <button
                type="button"
                onClick={() => setShowInquiryModal(false)}
                disabled={inquiryLoading}
                className="w-full md:w-auto px-6 py-2 border-2 border-gray-300 text-black rounded-full hover:bg-gray-100 transition-colors font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={inquiryLoading}
                className="w-full md:w-auto px-8 py-2 bg-[#FFC107] hover:bg-[#FFB300] text-black rounded-full transition-colors font-semibold text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {inquiryLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Sending...
                  </>
                ) : (
                  'Send Inquiry'
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Thank You Message Overlay */}
      {showThankYouMessage && (
        <div className="thank-you-overlay">
          <div className="thank-you-content">
            <div className="checkmark-icon">✓</div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-3">Thank You!</h2>
            <p className="text-gray-600 text-base md:text-lg mb-2">
              Your inquiry has been received successfully.
            </p>
            <p className="text-gray-500 text-sm md:text-base">
              I'll review your message and get back to you as soon as possible.
            </p>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      <Dialog open={showResumeModal} onOpenChange={setShowResumeModal}>
        <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex flex-col">
            {/* Header with Download Button and Close */}
            <div className="absolute top-0 right-0 left-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-4 flex justify-between items-center">
              <h3 className="text-white font-semibold text-lg">Resume - Nafeel Qamar</h3>
              <div className="flex items-center gap-3">
                {showDownloadButton && (
                  <a
                    href="/NAFI_RESUME.pdf"
                    download="Nafeel_Qamar_Resume.pdf"
                    className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download Resume
                  </a>
                )}
                <button
                  onClick={() => setShowResumeModal(false)}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:shadow-lg"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            
            {/* PDF Viewer */}
            <iframe
              src="/NAFI_RESUME.pdf"
              className="w-full h-full border-0"
              title="Resume - Nafeel Qamar"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}