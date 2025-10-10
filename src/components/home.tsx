import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, X, ChevronLeft, ChevronRight, Star, Mail, Phone, Facebook } from 'lucide-react';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      text: "NAFI delivered exceptional branding that perfectly captured our vision. Professional, creative, and reliable!"
    },
    {
      name: "Michael Chen",
      role: "E-commerce Brand",
      rating: 5,
      text: "The social media designs increased our engagement by 200%. Outstanding work and great communication throughout."
    },
    {
      name: "Emily Rodriguez",
      role: "Local Business",
      rating: 5,
      text: "Amazing attention to detail that helped us stand out in a competitive market. Highly recommended!"
    }
  ];

  const stats = [
    { number: "150+", label: "Projects Completed" },
    { number: "50+", label: "Happy Clients" },
    { number: "5+", label: "Years Experience" },
    { number: "98%", label: "Client Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-white text-black font-['Inter'] overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full bg-white/95 backdrop-blur-sm z-40 border-b border-gray-100 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2">
                  <img 
                    src="/images/nafi-logo-new.jpg" 
                    alt="Nafeel Logo" 
                    className="h-12 w-12 object-contain"
                  />
                  <h1 className="text-xl font-bold text-black tracking-tight">
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
                  className={`text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 tracking-wide uppercase transform hover:scale-105 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - New Design */}
      <section id="home" className="min-h-screen flex items-center justify-center relative bg-white overflow-hidden">
        {/* Yellow accent elements with animations */}
        <div className={`absolute top-20 left-8 w-1 h-32 bg-[#FFC107] transition-all duration-1000 delay-500 ${isLoaded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}></div>
        <div className={`absolute bottom-20 right-8 w-32 h-1 bg-[#FFC107] transition-all duration-1000 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-8">
          <div className="mb-16">
            {/* Main heading with staggered animation */}
            <div className="mb-8">
              <h1 className={`text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-black transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                NAFI
              </h1>
              <h1 className={`text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tighter text-black transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                CREATIONS
              </h1>
            </div>
            
            {/* Yellow accent bars with animation */}
            <div className="flex justify-center items-center space-x-8 mb-12">
              <div className={`w-16 h-1 bg-[#FFC107] transition-all duration-800 delay-700 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
              <div className={`w-16 h-1 bg-[#FFC107] transition-all duration-800 delay-800 ${isLoaded ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>
            </div>
            
            {/* Subtitle with fade-in */}
            <p className={`text-xl font-light tracking-wide text-gray-600 mb-6 transition-all duration-1000 delay-900 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Design beyond limits
            </p>
            
            {/* Description with fade-in */}
            <p className={`text-base text-gray-500 max-w-2xl mx-auto leading-relaxed mb-12 transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              Creating impactful visual experiences through minimal design, bold typography, and strategic use of color that resonate with audiences and drive results.
            </p>
          </div>
          
          {/* CTA Button with hover animations */}
          <div className={`transition-all duration-1000 delay-1100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <Button 
              onClick={() => scrollToSection('portfolio')}
              size="lg" 
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold px-12 py-4 text-base rounded-none transition-all duration-300 hover:shadow-lg hover:scale-105 uppercase tracking-wide transform hover:-translate-y-1"
            >
              VIEW MY WORK
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 bg-white relative">
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
                <div className="relative w-80 h-96 overflow-hidden border-8 border-white shadow-2xl">
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
      <section id="portfolio" className="py-24 bg-white">
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

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
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
      <section className="py-24 bg-white">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 border-0 shadow-sm bg-white hover:shadow-md transition-all duration-300">
                <CardContent className="p-0">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed text-sm italic">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-bold text-black text-sm">{testimonial.name}</div>
                    <div className="text-gray-500 text-xs">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#FFC107]">
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
      <section id="contact" className="py-24 bg-white">
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
    </div>
  );
}