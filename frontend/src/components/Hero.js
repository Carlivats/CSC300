import React, { useState } from "react";
import "../css/hero.css";

const Hero = () => {
    const colors = ['#dc3545', '#28a745', '#007bff', '#fd7e14'];
    const [colorIndex, setColorIndex] = useState(0);

    const changeColor = () => {
        setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
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
                onClick={changeColor}
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