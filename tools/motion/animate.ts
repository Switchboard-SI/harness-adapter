import { gsap } from "gsap";

export const fadeIn = (target: string | HTMLElement, duration = 0.6) =>
  gsap.to(target, { opacity: 1, y: 0, duration, ease: "power3.out" });

export const slideUp = (target: string | HTMLElement, duration = 0.6) =>
  gsap.to(target, { opacity: 1, y: 0, duration, ease: "power3.out" });

export const terminalType = (target: string | HTMLElement, text: string, duration = 0.03) =>
  gsap.to(target, {
    duration: text.length * duration,
    onUpdate: () => {},
  });
