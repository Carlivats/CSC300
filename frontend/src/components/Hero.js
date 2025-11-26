import React from "react";
import "../css/hero.css";

const Hero = () => {
    return (
        <div className="hero-container">
            <h1 className="hero-title">Find the Best Way to</h1>
            <h1 className="hero-title-animated">
                <div className="hero-words">
                    <span>Travel</span>
                    <span>Commute</span>
                    <span>Tour</span>
                    <span>Explore</span>
                    <span>Travel</span>
                </div>
            </h1>
            <button className="hero-button">Select Station</button>
        </div>
    );
};

export default Hero;