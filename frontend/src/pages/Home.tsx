import { useEffect, useState } from "react";
import { Navbar } from "../components/layout/Navbar";
import { Hero } from "../components/layout/Hero";
import { sectionRegistry } from "../components/sections/registry";
import { fetchSections } from "../api/sections";
import type { Section } from "../types/section";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTheme } from "../hooks/useTheme";
import { AquaticScales } from "../components/effects/AquaticScales";
import { Footer } from "../components/layout/Footer";

export function Home() {
  const { theme, toggleTheme } = useTheme();



  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useScrollReveal<HTMLDivElement>([isLoading]);


  useEffect(() => {
    fetchSections()
      .then((data) => setSections(data))
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p style={{ padding: "4rem", textAlign: "center" }}>Loading…</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "4rem", textAlign: "center", color: "crimson" }}>
        Couldn't load this page: {error}
      </p>
    );
  }

  const visibleSections = sections
    .filter((section) => section.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <div ref={containerRef}>
      <AquaticScales theme={theme}/>
      <Navbar sections={visibleSections} theme={theme} onToggleTheme={toggleTheme} />
      <Hero />
      <main>
        {visibleSections.map((section) => {
          const Component = sectionRegistry[section.layoutVariant];
          if (!Component) return null;
          return <Component key={section.id} section={section} />;
        })}
      </main>
      <Footer sections={visibleSections} />
    </div>
  );
}