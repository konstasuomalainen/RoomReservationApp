import React, { useState } from "react";
import "./MainPage.css";

const BackgroundSwitcher: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(
    "https://example.com/initial-image.jpg"
  );
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [fade, setFade] = useState<"fade-in" | "fade-out">("fade-in");

  const changeBackground = (newImage: string) => {
    setNextImage(newImage);
    setFade("fade-out");

    // After the fade-out transition ends, switch the background
    const timeout = setTimeout(() => {
      setCurrentImage(newImage);
      setNextImage(null);
      setFade("fade-in");
    }, 1000); // Duration matches the CSS transition time

    return () => clearTimeout(timeout); // Cleanup timeout if the component unmounts
  };

  return (
    <div className="background-container">
      <div
        className={`background-image fade ${
          fade === "fade-in" ? "fade-in" : "fade-out"
        }`}
        style={{ backgroundImage: `url(${currentImage})` }}
      />
      {nextImage && (
        <div
          className={`background-image fade ${
            fade === "fade-out" ? "fade-in" : "fade-out"
          }`}
          style={{ backgroundImage: `url(${nextImage})` }}
        />
      )}
      <div
        className="settings-button"
        onClick={() => changeBackground("https://example.com/new-image.jpg")}
      >
        Change Photo
      </div>
    </div>
  );
};

export default BackgroundSwitcher;
