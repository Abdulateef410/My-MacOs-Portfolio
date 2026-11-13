import { useState, useEffect } from "react";
import dayjs from "dayjs";

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(() =>
    dayjs().format("ddd MMMM D, h:mm A")
  );

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(dayjs().format("ddd MMMM D, h:mm A"));
    };

    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <nav>
      <div className="flex items-center gap-2">
        <p className="font-bold text-sm tracking-wide select-none text-white">
          {"DevAbdul"}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Profile"
          className="flex items-center justify-center p-1 bg-transparent hover:bg-transparent border-none cursor-pointer transition-opacity duration-200 hover:opacity-75 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/50 rounded"
        >
          <img
            src="/icons/user.svg"
            alt=""
            aria-hidden="true"
            className="w-4 h-4 object-contain brightness-0 invert"
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </button>

        <time className="text-xs sm:text-sm font-medium text-white select-none whitespace-nowrap">
          {currentTime}
        </time>
      </div>
    </nav>
  );
};

export default Navbar;