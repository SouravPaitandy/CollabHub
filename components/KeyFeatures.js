"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Pagination,
  Autoplay,
  Navigation,
  EffectCards,
} from "swiper/modules";
import {
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  PencilSquareIcon,
  ArrowRightIcon,
  DocumentIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import SpotlightCard from "./ui/SpotlightCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Feature = ({ icon, title, description }) => {
  return (
    <SpotlightCard className="h-full bg-white/40 dark:bg-black/40 backdrop-blur-2xl border-black/5 dark:border-white/10 relative overflow-hidden group rounded-3xl">
      {/* Animated corner accents - Subtler for Cosmic Theme */}
      <div
        className="absolute top-0 right-0 w-32 h-32 translate-x-12 -translate-y-12 
                    bg-primary/20 rounded-full blur-[60px] group-hover:bg-primary/30
                    transition-all duration-700 ease-out pointer-events-none"
      ></div>
      <div
        className="absolute bottom-0 left-0 w-32 h-32 -translate-x-12 translate-y-12 
                    bg-indigo-500/10 rounded-full blur-[60px] group-hover:bg-indigo-500/20
                    transition-all duration-700 ease-out pointer-events-none"
      ></div>

      <div className="relative z-10 flex flex-col justify-between h-full p-8 sm:p-10">
        <div>
          <div
            className="flex items-center justify-center w-16 h-16 mb-8 rounded-2xl 
                        bg-black/5 dark:bg-white/5 text-primary shadow-inner transform transition-transform duration-500
                        group-hover:rotate-6 group-hover:scale-110 border border-black/5 dark:border-white/10 backdrop-blur-md"
          >
            {icon}
          </div>
          <h4
            className="text-2xl font-bold font-hacker text-foreground mb-4 
                       group-hover:text-primary tracking-wide
                       transition-colors duration-300"
          >
            {title}
          </h4>
          <p className="text-muted-foreground mb-8 leading-relaxed text-base font-geist-sans font-light">
            {description}
          </p>
        </div>
        <Link
          href="/features"
          className="text-primary hover:text-primary/80 
                   flex items-center font-medium text-sm font-geist-sans
                   relative overflow-hidden group/link"
        >
          <span className="relative z-10 flex items-center gap-2">
            Explore
            <ArrowRightIcon
              className="w-4 h-4 transition-transform duration-500 
                                     group-hover:translate-x-1"
            />
          </span>
        </Link>
      </div>
    </SpotlightCard>
  );
};

const KeyFeatures = () => {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(2);

  useEffect(() => {
    setMounted(true);

    // Apply custom styles
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      /* Pagination bullets */
      .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        opacity: 1;
        transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .swiper-pagination-bullet-active {
        width: 32px;
        height: 8px;
        border-radius: 4px;
        background: linear-gradient(to right, rgb(124, 58, 237), rgb(79, 70, 229));
        box-shadow: 0 0 10px rgba(124, 58, 237, 0.4);
      }
      
      /* Slide transitions */
      .swiper-slide {
        transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        opacity: 0.3;
        filter: blur(4px) grayscale(50%);
        transform: scale(0.9);
      }
      .swiper-slide-active {
        transform: scale(1);
        opacity: 1;
        filter: blur(0) grayscale(0%);
        z-index: 2;
      }
      
      /* Mobile card effect */
      .card-effect .swiper-slide {
        transition: all 0.4s ease-out;
        opacity: 1;
        filter: none;
        transform: none;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      if (styleElement.parentNode) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const features = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
      title: "Real-time Chat",
      description:
        "Communicate instantly with your team members with secure, end-to-end encryption.",
    },
    {
      icon: <VideoCameraIcon className="w-8 h-8" />,
      title: "Video Conferencing",
      description:
        "Connect face-to-face with high-quality video and simple screen sharing.",
    },
    {
      icon: <PencilSquareIcon className="w-8 h-8" />,
      title: "Interactive Whiteboard",
      description:
        "Share ideas visually on a collaborative canvas that updates in real-time.",
    },
    {
      icon: <DocumentIcon className="w-8 h-8" />,
      title: "File Sharing",
      description:
        "Share files securely with version tracking and collaborative editing.",
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: "Task Management",
      description:
        "Track projects with simple boards and lists to stay organized.",
    },
  ];

  if (!mounted) {
    return (
      <div className="h-[500px] bg-muted/50 animate-pulse rounded-xl"></div>
    );
  }

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <section className="py-32 relative z-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10"></div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary mb-0.5"></span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest font-geist-sans">
              Power Tools
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold font-hacker text-foreground mb-6">
            Everything you need <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500">
              in one void.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-geist-sans font-light">
            Powerful tools to enhance your collaboration, seamlessly integrated
            into your workflow.
          </p>
        </div>

        {/* Mobile View */}
        <div className="md:hidden card-effect relative z-10">
          <Swiper
            ref={swiperRef}
            effect={"cards"}
            grabCursor={true}
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            cardsEffect={{
              perSlideOffset: 8,
              perSlideRotate: 2,
              rotate: true,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCards, Pagination, Autoplay]}
            className="pb-12 h-[480px] mx-auto max-w-[340px] sm:max-w-[400px]"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="px-1">
                <Feature {...feature} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Feature dots indicator for mobile */}
          <div className="flex justify-center gap-3 mt-4 mb-2 px-4">
            {features.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                  ${activeIndex === index ? "bg-primary w-6" : "bg-white/20"}`}
                onClick={() => {
                  if (swiperRef.current && swiperRef.current.swiper) {
                    swiperRef.current.swiper.slideToLoop(index);
                  }
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden md:block relative swiper-container">
          <Swiper
            ref={swiperRef}
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={3}
            initialSlide={2}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 300,
              modifier: 1,
              slideShadows: false,
            }}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              768: { slidesPerView: 1.8 },
              1024: { slidesPerView: 2.5 },
              1280: { slidesPerView: 3 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="pb-20 pt-10 px-10"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="h-[450px]">
                <Feature {...feature} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Enhanced Navigation Buttons (Desktop) */}
      <div className="hidden md:flex justify-center gap-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-4 rounded-full transition-all duration-300 hover:scale-110
                   bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-primary/50 group backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ArrowRightIcon className="w-5 h-5 rotate-180 group-hover:text-primary transition-colors" />
        </button>
        <button
          onClick={handleNext}
          className="p-4 rounded-full transition-all duration-300 hover:scale-110
                   bg-white/5 border border-white/10 text-foreground hover:bg-white/10 hover:border-primary/50 group backdrop-blur-md"
          aria-label="Next slide"
        >
          <ArrowRightIcon className="w-5 h-5 group-hover:text-primary transition-colors" />
        </button>
      </div>
    </section>
  );
};

export default KeyFeatures;
