"use client";

import { useState } from "react";
import Image from "next/image";

export default function OchisiaGallery() {
  const [selected, setSelected] = useState<any>(null);

  const heroImage = "/ochisia/hero.jpg";

  const ochisiaSections = [
    {
      name: "The Lobster",
      poems: [
        {
          id: 1,
          title: "Beige",
          img: "/ochisia/the-lobster/beige.jpg",
          text: `What a strange color... Maybe because you recommended it.`,
        },
        {
          id: 2,
          title: "High School",
          img: "/ochisia/the-lobster/highschool.jpg",
          text: `Soon, my time here will reach its end... just another face in an old yearbook.`,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative w-full h-[90vh] overflow-hidden mt-6 rounded-xl shadow-md">
        <Image
          src={heroImage}
          alt="Ochisia hero image"
          fill
          priority
          quality={100}
          className="object-cover object-center brightness-105"
        />
        {/* Slight warm overlay to reduce darkness */}
        <div className="absolute inset-0 bg-black/5 dark:bg-black/10" />

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <h1 className="text-6xl sm:text-7xl font-extrabold text-white drop-shadow-lg">
            Ochisia
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 italic mt-4 max-w-2xl">
            A collection of writings by Alessandro “Sandro” Tasso
          </p>
        </div>
      </section>

      {/* ===== AUTHOR’S NOTE ABOVE BIO ===== */}
      <section className="max-w-6xl mx-auto py-20 px-8 flex flex-col space-y-16">
        {/* Author’s Note (Full Width, Centered) */}
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-6 text-primary dark:text-darkaccent">
            Author’s Note
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
            © Alessandro Tasso
          </p>
          <p className="leading-relaxed text-lg text-neutral-800 dark:text-neutral-200 mb-4">
            <em>Ochisia</em> is a collection of personal writing pieces initially
            started as an outlet for thoughts during a particularly challenging
            period in my life. It explores the sensations of nostalgia,
            self-reflection, and personal growth. This book has multiple
            sections: <em>The Lobster, The Hermit, The Interim,</em> and{" "}
            <em>Now or Never.</em> Each section represents a different part of
            recent years, in particular the experiences, memories, and notable
            sentiments along the way. The asterisks denote my personal favorites,
            but please interpret them in any way that speaks to you. Enjoy.
          </p>
          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
            - Alessandro “Sandro” Tasso
          </p>
        </div>

        {/* Author Photo + Bio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* LEFT COLUMN — AUTHOR PHOTO */}
          <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-md">
            <Image
              src="/ochisia/author-photo.jpg"
              alt="Alessandro Tasso with family"
              fill
              quality={100}
              className="object-cover"
            />
          </div>

          {/* RIGHT COLUMN — ABOUT THE AUTHOR */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-extrabold mb-4 text-primary dark:text-darkaccent">
              About the Author
            </h2>
            <p className="text-lg leading-relaxed text-neutral-800 dark:text-neutral-200">
              Alessandro “Sandro” Tasso grew up in Berkeley, California with his
              mother, father, younger sister, and golden retriever, Chloe. When
              in the Bay Area, he can be found attempting to learn Mac DeMarco’s
              songs on guitar, hiking around Mt. Tamalpais State Park without
              enough water, or averaging around 8 points per game playing
              basketball with his friends at Terrace Park. He hopes to one day
              backpack through Banff National Park, spend an entire summer
              traveling the Mediterranean, and buy his parents a beachfront
              retirement house on the west coast. He currently attends school in
              Southern California, studying Biomedical & Mechanical Engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ===== POEM GALLERY ===== */}
      <div className="max-w-6xl mx-auto py-20 px-6 space-y-16">
        {ochisiaSections.map((section) => (
          <div key={section.name}>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">
              {section.name}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {section.poems.map((poem) => (
                <div
                  key={poem.id}
                  className="cursor-pointer group"
                  onClick={() => setSelected(poem)}
                >
                  <div className="relative w-full aspect-3/4 overflow-hidden shadow-sm">
                    <Image
                      src={poem.img}
                      alt={poem.title}
                      fill
                      quality={100}
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-sm font-medium">
                      {poem.id}. {poem.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ===== MODAL ===== */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 p-8 rounded-2xl max-w-2xl w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-2xl font-semibold mb-4">{selected.title}</h3>
            <p className="whitespace-pre-line text-gray-700 dark:text-gray-200">
              {selected.text}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
