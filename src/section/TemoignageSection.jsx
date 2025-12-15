"use client";

import React, { useState, useEffect, useRef } from 'react';
import { H2 } from '@/components/Typographie';
import { useNavigate } from 'react-router-dom';
import { getData } from '@/service/api';
import { getRelativeTime } from '../service/getRelativeTime';
import { motion, animate, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";

// --- Composant StarRating ---
const StarRating = ({ note }) => {
  const MAX_STARS = 5;
  return (
    <div className="flex text-yellow-400">
      {Array.from({ length: MAX_STARS }, (_, i) => (
        <svg
          key={i}
          className={`w-5 h-5 ${i < note ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.783.57-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// --- Animation scroll mask ---
const left = `0%`;
const right = `100%`;
const leftInset = `20%`;
const rightInset = `80%`;
const transparent = `#0000`;
const opaque = `#000`;

function useScrollOverflowMask(scrollXProgress) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
  );

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} ${left}, ${opaque} ${rightInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${right}, ${opaque})`
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}

// --- Composant Temoignage (cartes carrées) ---
const Temoignage = ({ image, nom, prenom, designation, message, date, note, email }) => {
  const initial = email ? email[0].toUpperCase() : nom[0].toUpperCase();

  const variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="flex-shrink-0 w-[320px] sm:w-[360px] md:w-[380px]"
    >
      <div className="flex flex-col bg-white p-4 shadow-xl h-[420px] sm:h-[390px] rounded-2xl">
        {/* Photo + nom/prénom/désignation */}
        <div className="flex flex-row items-center gap-4 mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-2 border-white">
            {image ? (
              <img src={image} alt={nom} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-[#8a2be2] to-[#6c63ff] flex items-center justify-center text-white text-4xl font-bold">
                {initial}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">{nom} {prenom}</h3>
            <p className="text-sm text-gray-600">{designation}</p>
          </div>
        </div>

        {/* Message + Note */}
        <div className="flex flex-col justify-between h-full">
          <p className="text-sm leading-relaxed mb-4 text-black pt-7">{message}</p>

          <div className="flex justify-between items-end mt-auto">
            <div className="bg-white rounded-full shadow-xl inline-flex px-3 py-2 mb-2">
              <StarRating note={note} />
            </div>
            <p className="text-xs text-gray-500 text-right">Publié {getRelativeTime(date)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Section Témoignage avec scroll horizontal ---
function TemoignageSection() {
  const navigate = useNavigate();
  const [temoin, setTemoin] = useState([]);

  const fetchTemoignage = async () => {
    try {
      const response = await getData("temoignages/valide/");
      setTemoin(response.data);
    } catch (err) {
      console.log("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchTemoignage();
  }, []);

  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollXProgress);

  return (
    <div className="py-10 px-4 sm:px-8 md:py-20 max-w-7xl mx-auto">

      <H2 className="text-xl sm:text-2xl md:text-3xl text-center mb-12">Témoignages</H2>

      {/* Circle Progress */}
      <svg width="80" height="80" viewBox="0 0 100 100" className="mx-auto mb-8 rotate-[-90deg]">
        <circle cx="50" cy="50" r="30" pathLength="1" className="stroke-gray-300" fill="none" strokeWidth="10%" />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          stroke="var(--accent)"
          strokeWidth="10%"
          fill="none"
          style={{ pathLength: scrollXProgress }}
        />
      </svg>

      {/* Scroll horizontal animé */}
      <motion.div
        ref={ref}
        className="flex overflow-x-scroll gap-6 px-3 py-4"
        style={{ maskImage }}
      >
        {temoin.map((t) => (
          <Temoignage
            key={t.id}
            image={t.image}
            nom={t.nomClient}
            prenom={t.prenomClient}
            designation={t.role}
            message={t.messageClient}
            date={t.dateTem}
            note={t.note}
            email={t.emailClient}
          />
        ))}
      </motion.div>

      {/* Bouton */}
      <div className="mt-16 flex justify-end px-4">
        <motion.button
          onClick={() => navigate('/temoin')}
          className="px-6 py-2 rounded-full text-[#0B1D5D] border border-[#0B1D5D] hover:bg-[#0B1D5D] hover:text-white font-semibold shadow-lg transition-all duration-300 cursor-pointer text-sm md:text-base whitespace-nowrap h-14 md:h-12"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Partagez votre histoire
        </motion.button>
      </div>
    </div>
  );
}

export default TemoignageSection;
