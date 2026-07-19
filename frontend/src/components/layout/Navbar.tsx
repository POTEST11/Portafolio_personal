import { useEffect, useState } from "react";
import type { Section } from "../../types/section";


import styles from "./Navbar.module.css";

interface NavbarProps {
  sections: Section[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Navbar({ sections, theme, onToggleTheme }: NavbarProps) {
  const [activeSlug, setActiveSlug] = useState<string>(sections[0]?.slug ?? "");

  useEffect(() => {
    const visibleSections = sections.filter((s) => s.isVisible);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    visibleSections.forEach((section) => {
      const el = document.getElementById(section.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav className={styles.nav} aria-label="Section navigation">
      <div className={`container ${styles.inner}`}>
         <div className={styles.icon_container}>
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 604.000000 451.000000"
                preserveAspectRatio="xMidYMid meet">
                <g transform="translate(0.000000,451.000000) scale(0.100000,-0.100000)"
                stroke="none" className={styles.icon}>
                <path d="M2931 3720 l-603 -5 162 -140 c89 -77 173 -148 186 -158 25 -20 30
                -50 15 -89 -5 -13 -21 -70 -36 -128 -15 -58 -30 -114 -34 -125 -5 -11 -18 -60
                -31 -110 -20 -79 -71 -272 -115 -433 -8 -29 -15 -54 -15 -55 0 -3 -53 -29 -90
                -45 -55 -24 -104 -34 -134 -29 -66 12 -144 27 -216 42 -41 9 -88 18 -105 21
                -25 5 8 -32 195 -220 l225 -226 -19 -72 c-10 -40 -24 -76 -30 -80 -6 -4 -128
                -8 -271 -8 l-260 1 -70 33 c-264 128 -558 273 -720 354 -254 128 -266 134
                -368 181 -49 23 -93 41 -99 41 -6 0 -20 7 -30 17 -14 13 -18 13 -18 2 0 -8
                110 -236 245 -507 135 -270 245 -497 245 -503 0 -13 40 -82 50 -87 9 -3 441
                -315 549 -395 46 -34 91 -66 100 -72 9 -5 37 -25 64 -43 l47 -33 647 1 c356 0
                650 4 654 8 6 7 29 82 54 177 12 44 28 103 51 182 l6 22 -120 -6 c-80 -4 -121
                -2 -126 5 -3 6 10 66 30 134 19 68 46 161 60 208 13 47 29 101 35 120 7 24 31
                53 75 90 36 30 82 71 103 90 21 19 176 154 344 300 168 146 306 269 306 273 1
                5 -67 100 -151 210 -281 372 -287 381 -275 389 14 9 1258 11 1280 2 17 -6 17
                -6 -43 -229 -23 -82 -52 -193 -66 -245 -39 -143 -14 -130 -236 -130 -150 0
                -193 -3 -202 -14 -10 -13 -541 -478 -636 -558 l-45 -38 455 -1 c250 -1 612 -2
                804 -3 l349 -1 34 120 c35 125 67 243 103 380 11 44 24 89 29 100 5 11 14 45
                21 75 7 30 44 170 82 310 188 695 222 820 233 873 l5 27 -1024 0 c-563 0
                -1030 1 -1038 3 -7 1 -285 0 -617 -3z m250 -993 c74 -98 140 -186 146 -196 12
                -15 -11 -38 -199 -202 -117 -101 -240 -210 -273 -241 -62 -60 -80 -70 -71 -40
                3 10 58 204 121 432 63 228 117 421 120 429 7 17 -7 33 156 -182z"/>
                </g>
                </svg></div>

        <div className={styles.actionables}>
          <div className={styles.path}>
            {sections
              .filter((s) => s.isVisible)
              .map((section) => (
                <span key={section.id} style={{ display: "flex", alignItems: "center" }}>
                  <span className={styles.separator}>~</span>
                  <a
                    href={`#${section.slug}`}
                    className={`${styles.link} ${
                      activeSlug === section.slug ? styles.active : ""
                    }`}
                  >
                    {section.slug}
                  </a>
                </span>
              ))}
            <span className={styles.cursor} aria-hidden="true" />
          </div>

          <div className={styles.actions}>
            <a href="/admin" className={styles.adminLink}>
              admin
            </a>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? "🌙" : "☀️"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
