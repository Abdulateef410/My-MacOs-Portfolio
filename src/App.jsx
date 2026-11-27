import { useEffect, useRef, useState } from "react";
import { Dock, Navbar, PortfolioExplorer, Welcome } from "#components";

const WALLPAPERS = [
  {
    id: "tahoe-dark",
    src: "/images/wallpapers/responsive/26-Tahoe-Dark-3840.jpg",
    srcSet: [
      "/images/wallpapers/responsive/26-Tahoe-Dark-1440.jpg 1440w",
      "/images/wallpapers/responsive/26-Tahoe-Dark-2880.jpg 2880w",
      "/images/wallpapers/responsive/26-Tahoe-Dark-3840.jpg 3840w",
    ].join(", "),
    positionClass: "desktop-wallpaper__layer--tahoe",
  },
  {
    id: "tahoe-light",
    src: "/images/wallpapers/responsive/26-Tahoe-Light-3840.jpg",
    srcSet: [
      "/images/wallpapers/responsive/26-Tahoe-Light-1440.jpg 1440w",
      "/images/wallpapers/responsive/26-Tahoe-Light-2880.jpg 2880w",
      "/images/wallpapers/responsive/26-Tahoe-Light-3840.jpg 3840w",
    ].join(", "),
    positionClass: "desktop-wallpaper__layer--tahoe",
  },
  {
    id: "big-sur-day",
    src: "/images/wallpapers/11-Big-Sur-Color-Day-6k.jpg",
    srcSet: [
      "/images/wallpapers/responsive/11-Big-Sur-Color-Day-1440.jpg 1440w",
      "/images/wallpapers/responsive/11-Big-Sur-Color-Day-2880.jpg 2880w",
      "/images/wallpapers/responsive/11-Big-Sur-Color-Day-3840.jpg 3840w",
      "/images/wallpapers/11-Big-Sur-Color-Day-6k.jpg 6016w",
    ].join(", "),
    positionClass: "desktop-wallpaper__layer--big-sur",
  },
];

const WALLPAPER_DISPLAY_DURATION = 10_000;
const WALLPAPER_CROSSFADE_DURATION = 2_000;

const getWallpaperSizes = () =>
  typeof window !== "undefined" && window.innerHeight > window.innerWidth
    ? "100vh"
    : "100vw";

const preloadWallpaper = (wallpaper, sizes) => {
  const image = new Image();
  let resolveLoad;
  let isSettled = false;

  const promise = new Promise((resolve) => {
    resolveLoad = resolve;
  });
  const finish = (loaded) => {
    if (isSettled) return;
    isSettled = true;
    image.onload = null;
    image.onerror = null;
    resolveLoad(loaded);
  };

  const resolveDecoded = () => {
    if (typeof image.decode === "function") {
      image.decode().then(
        () => finish(true),
        () => finish(image.naturalWidth > 0),
      );
      return;
    }
    finish(true);
  };

  image.onload = resolveDecoded;
  image.onerror = () => finish(false);
  image.sizes = sizes;
  image.srcset = wallpaper.srcSet;
  image.src = wallpaper.src;

  if (image.complete && image.naturalWidth > 0) resolveDecoded();

  return { promise, cancel: () => finish(false) };
};

const App = () => {
  const [wallpaperSizes, setWallpaperSizes] = useState(getWallpaperSizes);
  const wallpaperSizesRef = useRef(wallpaperSizes);
  const [wallpaperLayers, setWallpaperLayers] = useState({
    previous: null,
    current: WALLPAPERS[0],
  });
  const [explorer, setExplorer] = useState({
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    activeSection: "about",
    focusToken: 0,
  });

  useEffect(() => {
    wallpaperSizesRef.current = wallpaperSizes;
  }, [wallpaperSizes]);

  useEffect(() => {
    const updateSizes = () => {
      const nextSizes = getWallpaperSizes();
      setWallpaperSizes((prev) => (prev === nextSizes ? prev : nextSizes));
    };

    window.addEventListener("resize", updateSizes, { passive: true });
    window.addEventListener("orientationchange", updateSizes, { passive: true });

    return () => {
      window.removeEventListener("resize", updateSizes);
      window.removeEventListener("orientationchange", updateSizes);
    };
  }, []);

  useEffect(() => {
    let isActive = true;
    let currentIndex = 0;
    let currentWallpaper = WALLPAPERS[0];
    let displayTimer;
    let crossfadeTimer;
    let pendingPreload;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");

    const scheduleNextWallpaper = (delay = WALLPAPER_DISPLAY_DURATION) => {
      if (!isActive) return;

      window.clearTimeout(displayTimer);
      displayTimer = window.setTimeout(async () => {
        if (document.hidden) return;

        const nextIndex = (currentIndex + 1) % WALLPAPERS.length;
        const nextWallpaper = WALLPAPERS[nextIndex];
        pendingPreload = preloadWallpaper(nextWallpaper, wallpaperSizesRef.current);
        const isPreloaded = await pendingPreload.promise;
        pendingPreload = null;

        if (!isActive || document.hidden) return;
        if (!isPreloaded) {
          currentIndex = nextIndex;
          scheduleNextWallpaper();
          return;
        }

        if (reducedMotion?.matches) {
          currentIndex = nextIndex;
          currentWallpaper = nextWallpaper;
          setWallpaperLayers({ previous: null, current: nextWallpaper });
          scheduleNextWallpaper();
          return;
        }

        setWallpaperLayers({ previous: currentWallpaper, current: nextWallpaper });
        crossfadeTimer = window.setTimeout(() => {
          if (!isActive) return;
          currentIndex = nextIndex;
          currentWallpaper = nextWallpaper;
          setWallpaperLayers({ previous: null, current: nextWallpaper });
          scheduleNextWallpaper();
        }, WALLPAPER_CROSSFADE_DURATION);
      }, delay);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && isActive) {
        window.clearTimeout(displayTimer);
        scheduleNextWallpaper(WALLPAPER_DISPLAY_DURATION);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    scheduleNextWallpaper();

    return () => {
      isActive = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.clearTimeout(displayTimer);
      window.clearTimeout(crossfadeTimer);
      pendingPreload?.cancel();
    };
  }, []);

  const openExplorerAt = (section) => {
    setExplorer((current) => ({
      ...current,
      isOpen: true,
      isMinimized: false,
      activeSection: section,
      focusToken: current.focusToken + 1,
    }));
  };

  const isExplorerActive = explorer.isOpen && !explorer.isMinimized;

  return (
    <main className="desktop-root">
      <div className="desktop-wallpaper" aria-hidden="true">
        {wallpaperLayers.previous && (
          <img
            key={wallpaperLayers.previous.id}
            className={`desktop-wallpaper__layer ${wallpaperLayers.previous.positionClass}`}
            src={wallpaperLayers.previous.src}
            srcSet={wallpaperLayers.previous.srcSet}
            sizes={wallpaperSizes}
            alt=""
            loading="eager"
            decoding="sync"
            draggable={false}
          />
        )}
        <img
          key={wallpaperLayers.current.id}
          className={`desktop-wallpaper__layer ${wallpaperLayers.current.positionClass}${
            wallpaperLayers.previous ? " desktop-wallpaper__layer--next" : ""
          }`}
          src={wallpaperLayers.current.src}
          srcSet={wallpaperLayers.current.srcSet}
          sizes={wallpaperSizes}
          alt=""
          loading="eager"
          decoding="sync"
          fetchPriority={wallpaperLayers.previous ? "auto" : "high"}
          draggable={false}
        />
      </div>
      <Navbar onOpenAbout={() => openExplorerAt("about")} />
      <Welcome />
      <Dock onOpenSection={openExplorerAt} isExplorerOpen={isExplorerActive} />
      <div
        className={`desktop-backdrop${isExplorerActive ? " is-active" : ""}`}
        aria-hidden="true"
        onClick={() => setExplorer((current) => ({ ...current, isOpen: false }))}
      />
      <PortfolioExplorer
        isOpen={explorer.isOpen}
        isMinimized={explorer.isMinimized}
        isMaximized={explorer.isMaximized}
        activeSection={explorer.activeSection}
        focusToken={explorer.focusToken}
        onSelectSection={(activeSection) =>
          setExplorer((current) => ({ ...current, activeSection }))
        }
        onClose={() =>
          setExplorer((current) => ({ ...current, isOpen: false }))
        }
        onMinimize={() =>
          setExplorer((current) => ({ ...current, isMinimized: true }))
        }
        onToggleMaximize={() =>
          setExplorer((current) => ({
            ...current,
            isMaximized: !current.isMaximized,
          }))
        }
      />
    </main>
  );
};

export default App;
