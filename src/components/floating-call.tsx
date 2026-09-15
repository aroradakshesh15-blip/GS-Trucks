"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { LocateFixed, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";

import { BUSINESS, whatsappHref } from "@/lib/site";
import { EASE_OUT } from "@/components/motion";

export function FloatingCall() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 600));

  function shareLocation() {
    const openWhatsApp = (message: string) => {
      window.open(whatsappHref(message), "_blank", "noopener,noreferrer");
    };
    if (!navigator.geolocation) {
      openWhatsApp(`Breakdown near Brampton. Please call me at ${BUSINESS.phoneDisplay}.`);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        openWhatsApp(
          `Breakdown location: https://maps.google.com/?q=${coords.latitude},${coords.longitude}`,
        ),
      () => openWhatsApp(`Breakdown near Brampton. Please call me at ${BUSINESS.phoneDisplay}.`),
      { enableHighAccuracy: true, timeout: 6000 },
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 bg-primary px-4 py-3 font-display tracking-[0.08em] text-primary-foreground shadow-[var(--shadow-forge)] sm:bottom-8 sm:right-8 sm:gap-3 sm:px-5 sm:py-4"
        >
          <a href={BUSINESS.phoneHref} className="flex items-center gap-2">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <motion.span
                className="absolute h-4 w-4 rounded-full bg-primary-foreground/40"
                animate={{ scale: [1, 2.2], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
              />
              <Phone className="relative h-4 w-4" />
            </span>
            <span className="hidden sm:inline">Call Now · {BUSINESS.phoneDisplay}</span>
            <span className="sm:hidden">Call</span>
          </a>
          <button
            type="button"
            aria-label="Share your location on WhatsApp"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              shareLocation();
            }}
            className="ml-1 border-l border-primary-foreground/40 pl-2 transition-colors hover:text-primary-foreground/70"
          >
            <LocateFixed className="h-4 w-4" />
          </button>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noreferrer"
            aria-label="Open WhatsApp"
            onClick={(event) => event.stopPropagation()}
            className="border-l border-primary-foreground/40 pl-2 transition-colors hover:text-primary-foreground/70"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
