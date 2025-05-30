import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-4 px-6 bg-black text-white text-center border-t-2 border-yellow-400">
            <div className="flex justify-between items-center">
                <p className="text-sm text-yellow-400 pl-3">
                    © {new Date().getFullYear()} Audiomatrix. All rights reserved
                </p>
                <img
                    src="/audiomatrix.png"
                    alt="Audiomatrix Logo"
                    className="h-10 w-auto pr-2"
                />
            </div>
        </footer>
    );
};

export default Footer; 