import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
};

const setupTextHover = (container, type) => {
    if (!container) return () => {};
    const canHover = window.matchMedia?.("(hover: hover) and (pointer: fine)")?.matches;
    if (!canHover) return () => {};

    const letters = container.querySelectorAll("span");
    const { min, max, default: base } = FONT_WEIGHTS[type];
    let rafId = null;

    const animateLetter = (letter, weight, duration = 0.25) => {
        return gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
            overwrite: true,
        });
    };

    const updateWeights = (clientX) => {
        const { left } = container.getBoundingClientRect();
        const mouseX = clientX - left;

        letters.forEach((letter) => {
            const { left: l, width: w } = letter.getBoundingClientRect();
            const distance = Math.abs(mouseX - (l - left + w / 2));
            const intensity = Math.exp(-(distance ** 2) / 2000);
            animateLetter(letter, min + (max - min) * intensity);
        });
    };

    const handleMouseMove = (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        const clientX = e.clientX;
        rafId = requestAnimationFrame(() => {
            updateWeights(clientX);
            rafId = null;
        });
    };

    const handleMouseLeave = () => {
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
        letters.forEach((letter) => animateLetter(letter, base, 0.3));
    };

    container.addEventListener("mousemove", handleMouseMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        if (rafId) cancelAnimationFrame(rafId);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
        gsap.killTweensOf(letters);
    };
};

const renderText = (text, className, baseWeight = 400) => {
    return [ ...text].map((char, i) => (
        <span
        key={i}
        className={className}
        style={{ fontVariationSettings: `'wght' ${baseWeight}`}}>
            {char}
</span>
    ));
};

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanup = setupTextHover(titleRef.current, "title");
        const subtitleCleanup = setupTextHover(subtitleRef.current, "subtitle");
        return () => {
            subtitleCleanup?.();
            titleCleanup?.();
        };
    }, []);

return (
<section id="welcome">
    <p ref={subtitleRef} className="text-center">
        {renderText(
            "Hi there, I'm devAbdul! Welcome to my",
            "text-base sm:text-xl md:text-2xl lg:text-3xl font-georama",
            100,
        )}
        </p>
    <h1 ref={titleRef} className="mt-3 sm:mt-7 text-center">
        {renderText(
            "portfolio",
            "text-5xl sm:text-7xl md:text-8xl lg:text-9xl italic font-georama",
        )}
    </h1>

</section>
);
};

export default Welcome;

