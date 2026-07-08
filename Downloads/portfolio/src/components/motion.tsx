"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ReactNode, useRef, useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

// ── Reveal (fade-up on scroll) ────────────────────────────────────────────────
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

// ── HeroWords (load-time word animation) ──────────────────────────────────────
export function HeroWords({ text, className = "" }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.15 + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── SplitHeading (scroll-triggered word-by-word) ──────────────────────────────
export function SplitHeading({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={reduce ? false : { y: "110%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.85, ease, delay: delay + i * 0.05 }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// ── ProgressBar (reading progress) ────────────────────────────────────────────
export function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50"
      style={{ scaleX, background: "var(--case-accent, var(--color-ultra))" }}
    />
  );
}

// ── HoverLift ─────────────────────────────────────────────────────────────────
export function HoverLift({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.45, ease }}
    >
      {children}
    </motion.div>
  );
}

// ── ParallaxCard (full-bleed card with scroll parallax + hover overlay) ────────
export function ParallaxCard({
  href,
  title,
  tagline,
  accent,
  coverUrl,
  index,
  portrait,
  categoryLabel,
  year,
  viewLabel,
}: {
  href: string;
  title: string;
  tagline?: string;
  accent: string;
  coverUrl: string | null;
  index: number;
  portrait: boolean;
  categoryLabel: string;
  year: string | null;
  viewLabel: string;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-60, 60]);

  return (
    <motion.a
      href={href}
      className="group block"
      style={{ ["--card-accent" as string]: accent }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Card image */}
      <div
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl bg-[color:var(--color-line)] ${portrait ? "aspect-[4/5]" : "aspect-[16/9]"}`}
      >
        {coverUrl ? (
          <motion.div
            style={{ y, position: "absolute", top: -70, bottom: -70, left: 0, right: 0 }}
          >
            <Image
              src={coverUrl}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover"
              priority={index === 0}
            />
          </motion.div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, #0c0c0e 150%)`,
            }}
          />
        )}

        {/* Category pill */}
        <span className="absolute top-5 left-5 font-mono text-[0.68rem] tracking-[0.14em] uppercase text-white/90 bg-black/25 backdrop-blur px-3 py-1.5 rounded-full z-10">
          {categoryLabel}
        </span>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-end p-8 z-10">
          <span
            className="font-medium text-lg text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out"
            style={{ color: "white" }}
          >
            {viewLabel} →
          </span>
        </div>
      </div>

      {/* Card info */}
      <div className="mt-6 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display font-semibold text-2xl md:text-4xl leading-tight group-hover:text-[color:var(--card-accent)] transition-colors duration-400">
            {title}
          </h3>
          {tagline && (
            <p className="mt-2 text-[color:var(--color-mist)] md:text-lg max-w-2xl leading-relaxed">
              {tagline}
            </p>
          )}
        </div>
        <div className="shrink-0 text-right pt-1">
          <span className="font-mono text-xs text-[color:var(--color-mist)]">
            {String(index + 1).padStart(2, "0")} · {year ?? ""}
          </span>
        </div>
      </div>
    </motion.a>
  );
}

// ── Preloader ─────────────────────────────────────────────────────────────────
export function Preloader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: "var(--color-coal)" }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease }}
        >
          <motion.span
            className="font-display font-semibold text-white text-5xl tracking-tight select-none"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
          >
            VP<span style={{ color: "var(--color-ultra)" }}>.</span>
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── ScrollAwareHeader ─────────────────────────────────────────────────────────
export function ScrollAwareHeader({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease }}
      className="fixed top-0 inset-x-0 z-40 backdrop-blur-xl border-b hairline"
      style={{ background: "color-mix(in srgb, var(--color-gesso) 80%, transparent)" }}
    >
      {children}
    </motion.header>
  );
}
