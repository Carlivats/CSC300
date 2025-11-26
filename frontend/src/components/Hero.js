import React, { useState } from "react";
import "../css/hero.css";

const Hero = () => {
    const colors = ['#dc3545', '#28a745', '#007bff', '#fd7e14'];
    const [colorIndex, setColorIndex] = useState(0);

    const changeColor = () => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    };

    const scrollToStations = () => {
        const target = document.getElementById('stations-section');
        if (!target) return;
        
        const targetPosition = target.offsetTop - 100;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        const duration = 1000;
        let start = null;
        
        const animation = (currentTime) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };
        
        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        };
        
        requestAnimationFrame(animation);
    };

    return (
        <div className="hero-container">
            <h1 className="hero-title">Find the Best Way to</h1>
            <h1 className="hero-title-animated">
                <div className="hero-words" style={{ color: colors[colorIndex] }}>
                    <span>Travel</span>
                    <span>Commute</span>
                    <span>Tour</span>
                    <span>Explore</span>
                    <span>Travel</span>
                </div>
            </h1>
            <button 
                className="hero-button"
                style={{ backgroundColor: colors[colorIndex] }}
                onClick={scrollToStations}
            >
                Select Station
            </button>

            <div 
                className="color-line"
                style={{ backgroundColor: colors[colorIndex] }}
                onClick={changeColor}
            />
        </div>
    );
};

export default Hero;