"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Masonry from "../components/Masonry";

const galleryImages: { src: string; title: string; year: string; subtitle?: string }[] = [
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

export default function PhotographyPage() {
  // Main hero images (these work fine)
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

const galleryItems = galleryImages;
  

  return (
    <div className="flex flex-col">

      {/* ===== HERO SECTION ===== */}
<section className="relative w-full max-w-[1300px] mx-auto h-[90vh] mt-5 rounded-xl overflow-hidden shadow-md">
        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop
          navigation
          pagination={{ clickable: true }}
          className="w-full h-full"
        >
{heroImages.map((img, i) => (
  <SwiperSlide key={i}>
    <div className="relative w-full h-full"> 
      <Image
        src={img.src}
        alt={img.title}
        fill
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
        priority={i === 0}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      {/* TOP-LEFT TEXT */}
<div className="photo-overlay absolute top-10 left-10 z-20 drop-shadow-lg">
        <h3 className="text-xl font-semibold">{img.title}</h3>
        <p className="text-sm opacity-80">{img.year}</p>
      </div>
    </div>
  </SwiperSlide>
))}

        </Swiper>

        {/* Overlay Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-lg">
            Photography
          </h1>
        </div>
      </section>

{/* ===== GALLERY SECTION ===== */}
<section className="px-8 sm:px-12 md:px-24 py-16 space-y-8 bg-background dark:bg-darkbg text-center">
  <h2 className="text-4xl md:text-5xl font-extrabold text-primary dark:text-darkaccent whitespace-nowrap mx-auto">
    Gallery
  </h2>
  <p className="text-lg text-text/80 dark:text-darktext/80 max-w-3xl mx-auto">
    Shot on Sony A6400 with 18-105mm lens
  </p>

  {/* Portrait grid with Masonry animation */}
  <div className="max-w-7xl mx-auto">
    <Masonry
      items={galleryImages.map((img, i) => ({
        id: i,
        content: (
          <div
            className="relative w-full aspect-2/3 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-700 ease-in-out group"
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
              <h2 className="text-2xl font-semibold">
                {img.title}
              </h2>

              {img.subtitle && (
                <p className="text-sm italic mt-1">
                  {img.subtitle}</p>
              )}

              {img.year && (
                <p className="text-xs mt-2">
                  {img.year}</p>
              )}
            </div>
          </div>
        ),
      }))}
      columnWidth={350}
      gap={20}
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
    </div>
  );
}
