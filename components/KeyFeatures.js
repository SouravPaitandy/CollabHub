'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay, Navigation, EffectCards } from 'swiper/modules';
import { 
  ChatBubbleLeftRightIcon, 
  VideoCameraIcon, 
  PencilSquareIcon, 
  ArrowRightIcon,
  DocumentIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-cards';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Feature = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-xl shadow-lg h-full 
                transition-all duration-500 transform border border-gray-100 dark:border-gray-700
                relative overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient that animates on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 
                    dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 opacity-0 
                    group-hover:opacity-15 transition-opacity duration-500"></div>
      
      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 -translate-x-8 -translate-y-8 
                    bg-indigo-500/10 rounded-full group-hover:translate-x-0 group-hover:translate-y-0 
                    transition-all duration-700 ease-out"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 translate-x-8 translate-y-8 
                    bg-purple-500/10 rounded-full group-hover:translate-x-0 group-hover:translate-y-0 
                    transition-all duration-700 ease-out"></div>
      
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full 
                        bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 
                        dark:from-indigo-600 dark:via-purple-700 dark:to-indigo-800
                        text-white shadow-lg transform transition-transform duration-500
                        group-hover:rotate-3 group-hover:scale-110">
            {icon}
          </div>
          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 
                       group-hover:text-indigo-700 dark:group-hover:text-indigo-300 
                       transition-colors duration-300">{title}</h4>
          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{description}</p>
        </div>
        <Link 
          href="/features" 
          className="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 
                   dark:hover:text-indigo-400 flex items-center w-fit font-medium
                   relative overflow-hidden group/link"
        >
          <span className="relative z-10 flex items-center">
            Learn More
            <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-500 
                                     group-hover:translate-x-[2px]" />
          </span>
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 
                         group-hover/link:w-full transition-all duration-300 ease-out"></span>
        </Link>
      </div>
    </div>
  );
};

const KeyFeatures = () => {
  const [mounted, setMounted] = useState(false);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(2);
  
  useEffect(() => {
    setMounted(true);
    
    // Apply custom styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* Pagination bullets */
      .swiper-pagination-bullet {
        width: 10px;
        height: 10px;
        background: rgba(107, 70, 193, 0.3);
        opacity: 1;
        transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      }
      .swiper-pagination-bullet-active {
        width: 24px;
        height: 10px;
        border-radius: 5px;
        background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247));
      }
      
      /* Slide transitions */
      .swiper-slide {
        transition: all 0.6s cubic-bezier(0.25, 1, 0.5, 1);
        opacity: 0.7;
        filter: blur(1px);
      }
      .swiper-slide-active {
        transform: scale(1.08);
        opacity: 1;
        filter: blur(0);
        z-index: 2;
      }
      .swiper-slide-prev, .swiper-slide-next {
        opacity: 0.85;
        filter: blur(0.5px);
        z-index: 1;
      }
      
      /* Shadow effects */
      .swiper-slide-shadow-left,
      .swiper-slide-shadow-right {
        border-radius: 12px;
        background: radial-gradient(rgba(0, 0, 0, 0.1), transparent 70%);
      }
      
      /* Navigation buttons */
      .swiper-button-next, .swiper-button-prev {
        color: rgb(99, 102, 241);
        opacity: 0;
        transform: scale(0.8);
        transition: all 0.3s ease;
      }
      .swiper-container:hover .swiper-button-next,
      .swiper-container:hover .swiper-button-prev {
        opacity: 1;
        transform: scale(1);
      }
      
      /* Mobile card effect */
      .card-effect .swiper-slide {
        box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
        transform: translateY(0);
        transition: all 0.4s ease;
      }
      .card-effect .swiper-slide-active {
        transform: translateY(-10px);
      }
      
      /* Progress bar */
      .swiper-pagination-progressbar {
        background: rgba(99, 102, 241, 0.2) !important;
      }
      .swiper-pagination-progressbar-fill {
        background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247)) !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    // Cleanup function to remove styles when component unmounts
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
      description: "Communicate instantly with your team members with secure, end-to-end encryption.",
    },
    {
      icon: <VideoCameraIcon className="w-8 h-8" />,
      title: "Video Conferencing",
      description: "Connect face-to-face with high-quality video and simple screen sharing.",
    },
    {
      icon: <PencilSquareIcon className="w-8 h-8" />,
      title: "Interactive Whiteboard",
      description: "Share ideas visually on a collaborative canvas that updates in real-time.",
    },
    {
      icon: <DocumentIcon className="w-8 h-8" />,
      title: "File Sharing",
      description: "Share files securely with version tracking and collaborative editing.",
    },
    {
      icon: <CheckCircleIcon className="w-8 h-8" />,
      title: "Task Management",
      description: "Track projects with simple boards and lists to stay organized.",
    },
  ];

  if (!mounted) {
    return (
      <div className="h-[500px] bg-gradient-to-r from-gray-100/80 to-gray-200/80 
                     dark:from-gray-800/80 dark:to-gray-700/80 animate-pulse rounded-xl"></div>
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
    <section className="py-24 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="h-1.5 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-1"></div>
            <div className="h-1.5 w-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full ml-6"></div>
          </div>
          <h2 className="text-4xl pb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-4 
                         animate-text-shimmer bg-[length:200%_100%]">
            Key Features
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Powerful tools to enhance your collaboration
          </p>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden card-effect">
          <Swiper
            ref={swiperRef}
            effect={'cards'}
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
            pagination={{ 
              type: 'progressbar',
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCards, Pagination, Autoplay]}
            className="pb-12 h-[420px]"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="px-1">
                <Feature {...feature} />
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Feature dots indicator for mobile */}
          <div className="flex justify-center gap-2 mt-2">
            {features.map((_, index) => (
              <button 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 
                          ${activeIndex === index 
                            ? 'bg-indigo-600 w-6' 
                            : 'bg-gray-300 dark:bg-gray-600'}`}
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
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={2.5}
            initialSlide={2}
            coverflowEffect={{
              rotate: 10,
              stretch: 0,
              depth: 200,
              modifier: 2,
              slideShadows: true,
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
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            breakpoints={{
              768: { slidesPerView: 1.8 },
              1024: { slidesPerView: 2.3 },
              1280: { slidesPerView: 2.5 },
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
            className="pb-16 pt-8"
          >
            {features.map((feature, index) => (
              <SwiperSlide key={index} className="w-[400px] h-[400px]">
                <Feature {...feature} />
              </SwiperSlide>
            ))}
            
            {/* Custom navigation elements that appear on hover */}
            <div className="swiper-button-prev-custom absolute top-1/2 left-4 z-10 -translate-y-1/2 opacity-0 
                         group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="swiper-button-next-custom absolute top-1/2 right-4 z-10 -translate-y-1/2 opacity-0 
                         group-hover:opacity-100 transition-opacity duration-300"></div>
          </Swiper>
        </div>
      </div>

      {/* Enhanced Navigation Buttons */}
      <div className="flex justify-center gap-6 mt-6">
        <button 
          onClick={handlePrev}
          className="p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110
                   bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700
                   hover:bg-indigo-50 dark:hover:bg-indigo-900/30 group"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} 
               stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400
                                               group-hover:text-indigo-700 dark:group-hover:text-indigo-300
                                               transition-transform duration-300 group-hover:-translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button 
          onClick={handleNext}
          className="p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110
                   bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700
                   hover:bg-indigo-50 dark:hover:bg-indigo-900/30 group"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} 
               stroke="currentColor" className="w-5 h-5 text-indigo-600 dark:text-indigo-400
                                               group-hover:text-indigo-700 dark:group-hover:text-indigo-300
                                               transition-transform duration-300 group-hover:translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
      
      {/* Feature dots indicator for desktop */}
      <div className="hidden md:flex justify-center gap-3 mt-6">
        {features.map((feature, index) => (
          <button 
            key={index}
            className="flex flex-col items-center group"
            onClick={() => {
              if (swiperRef.current && swiperRef.current.swiper) {
                swiperRef.current.swiper.slideToLoop(index);
              }
            }}
            aria-label={`Go to ${feature.title}`}
          >
            <span className={`w-3 h-3 rounded-full mb-2 transition-all duration-500
                         ${activeIndex === index 
                           ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
                           : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-indigo-300 dark:group-hover:bg-indigo-700'}`} />
            <span className={`text-xs font-medium transition-all duration-300
                          ${activeIndex === index 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'}`}>
              {feature.title.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default KeyFeatures;