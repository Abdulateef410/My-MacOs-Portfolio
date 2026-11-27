import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { dockApps } from "#constants";

const Dock = ({ onOpenSection, isExplorerOpen = false }) => {
  const dockRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: dockRef });

  const liftIcon = contextSafe((event) => {
    if (event.pointerType === "touch") return;
    gsap.to(event.currentTarget, {
      y: -7,
      duration: 0.36,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  const resetIcon = contextSafe((event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      duration: 0.42,
      ease: "power2.out",
      overwrite: "auto",
    });
  });

  const handleOpen = (section, event) => {
    resetIcon(event);
    onOpenSection(section);
  };

  return (
    <section
      ref={dockRef}
      id="dock"
      className={isExplorerOpen ? "is-explorer-open" : ""}
      aria-label="Portfolio shortcuts"
    >
      <div className="dock-container">
        {dockApps.map((app) => (
          <button
            key={app.id}
            type="button"
            className="dock-icon group relative flex flex-none items-center justify-center border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            aria-label={`Open ${app.name}`}
            title={app.name}
            onClick={(event) => handleOpen(app.section, event)}
            onPointerEnter={liftIcon}
            onPointerLeave={resetIcon}
          >
            <img
              src={app.icon}
              alt=""
              aria-hidden="true"
              className="size-7 sm:size-9 object-contain 3xl:size-12"
            />
            <span className="tooltip pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {app.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Dock;
