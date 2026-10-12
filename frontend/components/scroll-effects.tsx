"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollEffects() {
  const pathname = usePathname();
  useEffect(() => {
    const targets = document.querySelectorAll(
      "main > section:not(.hero), .service-line, .home-process li, .values-grid article, .profile-grid article, .offer, .contact-panel",
    );
    document.body.classList.add("motion-ready");
    targets.forEach((target, index) => {
      target.classList.add("reveal");
      (target as HTMLElement).style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 70}ms`,
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    targets.forEach((target) => observer.observe(target));

    let frame = 0;
    const updateParallax = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.querySelector<HTMLElement>(".hero");
        if (!hero) return;

        const progress = Math.min(Math.max(window.scrollY / hero.offsetHeight, 0), 1);
        document.documentElement.style.setProperty("--hero-progress", progress.toFixed(3));
        document.documentElement.style.setProperty(
          "--hero-shift",
          `${(progress * 55).toFixed(1)}px`,
        );
        document.documentElement.style.setProperty(
          "--hero-drift",
          `${(progress * -22).toFixed(1)}px`,
        );
        document.documentElement.style.setProperty(
          "--hero-scale",
          (1.12 + progress * 0.1).toFixed(3),
        );
        document.documentElement.style.setProperty(
          "--hero-brightness",
          (0.58 - progress * 0.05).toFixed(3),
        );
      });
    };
    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateParallax);
      cancelAnimationFrame(frame);
      document.documentElement.style.removeProperty("--hero-progress");
      document.documentElement.style.removeProperty("--hero-shift");
      document.documentElement.style.removeProperty("--hero-drift");
      document.documentElement.style.removeProperty("--hero-scale");
      document.documentElement.style.removeProperty("--hero-brightness");
      document.body.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}
