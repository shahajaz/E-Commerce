import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import banner1 from "../../assets/banner1.jpg";
import banner2 from "../../assets/banner2.jpg";
import banner3 from "../../assets/banner3.jpg";
import banner4 from "../../assets/banner4.jpg";
import banner5 from "../../assets/banner5.jpg";

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
  {
    id: 1,
    title: "Premium Electronics",
    subtitle: "Discover the latest tech innovations",
    description:
      "Up to 50% off on premium headphones, smartwatches, and more",
    image: banner1,
    cta: "Shop Electronics",
    url: "/products?category=Electronics",
  },
  {
    id: 2,
    title: "Fashion Forward",
    subtitle: "Style Meets Comfort",
    description:
      "Explore the latest trends in fashion and accessories.",
    image: banner2,
    cta: "Explore Fashion",
    url: "/products?category=Fashion",
  },
  {
    id: 3,
    title: "Home & Garden",
    subtitle: "Transform Your Space",
    description:
      "Beautiful furniture and decor for every home.",
    image: banner3,
    cta: "Shop Home",
    url: "/products?category=Home & Garden",
  },
  {
    id: 4,
    title: "Luxury Collection",
    subtitle: "Premium Lifestyle",
    description:
      "Exclusive products with unbeatable quality.",
    image: banner4,
    cta: "View Collection",
    url: "/products",
  },
  {
    id: 5,
    title: "Mega Sale",
    subtitle: "Limited Time Offer",
    description:
      "Flat 60% OFF on selected products.",
    image: banner5,
    cta: "Shop Now",
    url: "/products",
  },
];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative h-screen pt-[80px] overflow-hidden">
      {/* Single Active Slide */}
      <div className="relative h-full">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
          style={{backgroundImage: `url(${slide.image})`,}}
        />
        <div className="absolute inset-0 bg-black/25"/>
        <div className="relative h-full flex items-center justify-center text-center px-6">
          <div className="max-w-3xl animate-fade-in-up">
            <h3 className="text-lg font-medium text-primary mb-2">
              {slide.subtitle}
            </h3>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-4">
              {slide.title}
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {slide.description}
            </p>
            <Link
              to={slide.url}
              className="px-8 py-4 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold text-lg">
              {slide.cta}
            </Link>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="hidden sm:block absolute left-6 top-1/2 transform -translate-y-1/2 p-3 glass-card rounded-full hover:glow-on-hover animate-smooth cursor-pointer">
        <ChevronLeft className="w-6 h-6 text-primary"/>
      </button>
      <button
        onClick={nextSlide}
        className="hidden sm:block absolute right-6 top-1/2 transform -translate-y-1/2 p-3 glass-card rounded-full hover:glow-on-hover animate-smooth cursor-pointer">
        <ChevronRight className="w-6 h-6 text-primary"/>
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary glow-primary"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
