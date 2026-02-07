"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Masonry from "../components/Masonry";

const galleryImages: { src: string; title: string; year: string; subtitle?: string; displayTitle?: string }[] = [
  {
    src: "/images/gallery/channelislands.JPG",
    title: "Santa Cruz Island, CA",
    year: "2025",
  },
  {
    src: "/images/gallery/coachella.JPG",
    title: "Indio, CA",
    year: "2024",
  },
  {
    src: "/images/gallery/craterlake.JPG",
    title: "Crater Lake, OR",
    year: "2024",
  },
  {
    src: "/images/gallery/dunesCO.JPG",
    title: "Great Sand Dunes, CO",
    year: "2023",
  },
  {
    src: "/images/gallery/joshuatree.JPG",
    title: "Joshua Tree, CA",
    year: "2022",
  },
  {
    src: "/images/gallery/leiftahoe.JPG",
    title: "Lake Tahoe, CA",
    year: "2024",
  },
  {
    src: "/images/gallery/leiftahoe2.JPG",
    title: "Lake Tahoe, CA",
    year: "2024",
  },
  {
    src: "/images/gallery/manarola.JPG",
    title: "Manarola, Italy",
    year: "2024",
  },
  {
    src: "/images/gallery/maroonbells.JPG",
    title: "Maroon Bells, CO",
    year: "2024",
  },
  {
    src: "/images/gallery/maroonbells2.JPG",
    title: "Maroon Bells, CO",
    year: "2024",
  },
  {
    src: "/images/gallery/monterosso.JPG",
    title: "Monterosso, Italy",
    year: "2024",
    displayTitle: "Monte\u00adrosso, Italy",
  },
  {
    src: "/images/gallery/mtrainier.JPG",
    title: "Mount Rainier, WA",
    year: "2022",
  },
  {
    src: "/images/gallery/muirwoods.JPG",
    title: "Muir Woods, CA",
    year: "2021",
  },
  {
    src: "/images/gallery/northstar.JPG",
    title: "Northstar, CA",
    year: "2024",
  },
  {
    src: "/images/gallery/pugetsound.JPG",
    title: "Puget Sound, WA",
    year: "2021",
  },
  {
    src: "/images/gallery/rifleCO.JPG",
    title: "Rifle, Colorado",
    year: "2024",
  },
  {
    src: "/images/gallery/sanpedroshark.JPG",
    title: "San Pedro, Belize",
    year: "2023",
  },
  {
    src: "/images/gallery/sanpedroshark2.JPG",
    title: "San Pedro, Belize",
    year: "2023",
  },
  {
    src: "/images/gallery/seattle.JPG",
    title: "Lake Union, WA",
    year: "2021",
  },
  {
    src: "/images/gallery/sedona.JPG",
    title: "Sedona, AZ",
    year: "2022",
  },
  {
    src: "/images/gallery/stinsonbeach.JPG",
    title: "Stinson Beach, CA",
    year: "2020",
  },
];

const heroImages = [
  {
    src: "/images/herophotos/belizeship.JPG",
    title: "San Pedro, Belize",
    year: "2024",
  },
  {
    src: "/images/herophotos/colorado.JPG",
    title: "Clear Creek County, CO",
    year: "2022",
  },
  {
    src: "/images/herophotos/colorado2.JPG",
    title: "Greys & Torreys, CO",
    year: "2022",
  },
  {
    src: "/images/herophotos/twinlakes.JPG",
    title: "Upper Twin Lake, CA",
    year: "2025",
  },
  {
    src: "/images/herophotos/twinlakes2.JPG",
    title: "Cedar Crest, CA",
    year: "2025",
  },
  {
    src: "/images/herophotos/belizeparaglider.JPG",
    title: "Caye Caulker, Belize",
    year: "2024",
  },
  {
    src: "/images/herophotos/scuba.JPG",
    title: "Cypress Canyons, Belize",
    year: "2024",
  },
  {
    src: "/images/herophotos/channelislands2.JPG",
    title: "Santa Cruz Island, CA",
    year: "2025",
  },
  {
    src: "/images/herophotos/channelisland.JPG",
    title: "Skeleton Cove, CA",
    year: "2025",
  },
];

type GalleryItem = (typeof galleryImages)[number];

export default function PhotographyPage() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  return (
    <section className="py-6 sm:py-8 w-full flex flex-col gap-6 sm:gap-8 lg:gap-10">
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}

      {/* ===== HERO SECTION ===== */}
<section className="relative w-full max-w-[1350px] mx-auto flex flex-col gap-4">
        <div className="text-center space-y-2 lg:hidden">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary dark:text-darkaccent">
            Photography
          </h1>
          <p className="text-sm sm:text-base text-text/70 dark:text-darktext/70">
            Shot on Sony A6400 with 18-105mm lens &amp; KODAK FunSaver 35mm
          </p>
        </div>
        <div className="relative rounded-3xl overflow-hidden shadow-md lg:h-[90vh]">
          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop
            navigation
            pagination={{ clickable: true }}
            autoHeight
            className="w-full lg:h-full"
            onSlideChange={(swiper) => setActiveHeroIndex(swiper.realIndex)}
          >
{heroImages.map((img, i) => (
  <SwiperSlide key={i}>
    <div className="relative w-full aspect-[3/2] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[90vh]">
      <Image
        src={img.src}
        alt={img.title}
        fill
        quality={100}
        className="object-contain sm:object-cover lg:object-cover"
        priority={i === 0}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1350px"
      />
      <div className="pointer-events-none absolute top-6 left-6 hidden lg:flex">
        <div className="px-6 py-4 text-white drop-shadow-lg">
          <p className="text-lg font-semibold">
            {heroImages[i].title}
          </p>
          <p className="text-sm text-white/80">
            {heroImages[i].year}
          </p>
        </div>
      </div>
    </div>
  </SwiperSlide>
))}

          </Swiper>
        </div>
        <div className="text-center lg:hidden text-sm sm:text-base text-text/80 dark:text-darktext/80">
          <p className="font-semibold">{heroImages[activeHeroIndex].title}</p>
          <p>{heroImages[activeHeroIndex].year}</p>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section className="px-6 sm:px-12 md:px-24 pt-10 sm:pt-16 pb-16 space-y-6 sm:space-y-8 bg-background dark:bg-darkbg text-center">
  <p className="hidden lg:block text-base text-text/70 dark:text-darktext/70">
    Shot on Sony A6400 with 18-105mm lens &amp; KODAK FunSaver 35mm
  </p>
  <h2 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-darkaccent whitespace-nowrap mx-auto">
    Gallery
  </h2>
  {/* Portrait grid with Masonry animation */}
  <div className="max-w-7xl mx-auto">
    <Masonry
      columns={3}
      gap={12}
      breakpoints={{
        0: { columns: 3, gap: 8 },
        640: { columns: 3, gap: 10 },
        1024: { columns: 3, gap: 16 },
        1440: { columns: 3, gap: 20 },
      }}
      items={galleryImages.map((img, i) => ({
        id: i,
        content: (
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelectedImage(img)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedImage(img);
              }
            }}
            className="relative w-full aspect-2/3 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-700 ease-in-out group cursor-zoom-in rounded-2xl"
          >
            <Image
              src={img.src}
              alt={`Gallery image ${i + 1}`}
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />

            {/* Hover overlay */}
            <div className="
              photo-overlay
              absolute inset-0 
              bg-black/0 group-hover:bg-black/40 
              opacity-0 group-hover:opacity-100 
              transition-all duration-500 
              flex flex-col justify-end 
              p-6
            ">
              <h2 className="text-2xl font-semibold hyphens-manual text-center">
                {img.displayTitle ?? img.title}
              </h2>

              {img.subtitle && (
                <p className="text-sm italic mt-1 text-center">
                  {img.subtitle}</p>
              )}

              {img.year && (
                <p className="text-xs mt-2 text-center">
                  {img.year}</p>
              )}
            </div>
          </div>
        ),
      }))}
      ease="power3.out"
      duration={0.6}
      stagger={0.05}
      animateFrom="bottom"
      scaleOnHover={false}
      hoverScale={0.95}
      blurToFocus={true}
      colorShiftOnHover={false}
    />
  </div>
</section>
    </section>
  );
}

function Lightbox({ image, onClose }: { image: GalleryItem; onClose: () => void }) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-4xl h-full max-h-[90vh]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Close image"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 rounded-full bg-black/70 hover:bg-black/90 text-white px-4 py-2 text-sm font-semibold shadow-md transition"
        >
          Close ✕
        </button>
        <div className="relative w-full h-full rounded-3xl overflow-hidden">
          <Image
            src={image.src}
            alt={image.title}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 text-center text-white">
          <h3 className="text-xl font-semibold">{image.title}</h3>
          {image.year && <p className="text-sm opacity-80">{image.year}</p>}
          {image.subtitle && <p className="text-xs opacity-70 mt-1">{image.subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
