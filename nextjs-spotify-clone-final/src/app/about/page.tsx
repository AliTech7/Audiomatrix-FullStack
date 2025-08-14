import React from 'react';
import Link from "next/link";
import Image from 'next/image';

const AboutPage = () => {
    return (
        <div className="flex flex-col gap-y-4 w-full px-4 sm:px-6 text-neutral-400 bg-neutral-900 min-h-screen">

            <div className="flex justify-between items-center mb-7 mt-7">
                <Link
                    href="/"
                    className="pl-5 text-yellow-400 hover:text-green-600 transition-colors flex items-center"
                >
                    <span>🏠</span>
                    Back to Home
                </Link>
            </div>

            <h1 className="text-green-700 text-4xl text-center font-semibold pl-6 mb-6">About</h1>
            <div className="flex flex-col gap-y-4 pl-6 text-white/95 text-center">
                <h2>
                    Welcome to <span className="text-green-700 text-lg">Audiomatrix</span>
                </h2>
                <p>
                    Audiomatrix is a smart, music platform crafted for those who want full control over how they experience music.<br />
                    Whether you're exploring beats, uploading your own tracks, or saving your favorites,<br />
                    Audiomatrix offers a seamless experience backed by modern web technologies.
                </p>
                <p>
                    Core Features:
                </p>

                <p>
                    Browse a curated and dynamic music library<br />
                    Add new songs<br />
                    Manage and revisit your favorite tracks<br />
                    Search functionality<br />
                    User authentication<br />
                    Responsive design<br />
                    <span className="text-green-700">More Features Coming Soon...</span><br />
                </p>

                <br></br>
                <p>
                    At Audiomatrix, it's not just about listening-it's about owning your sound journey.
                </p>
                <div className="flex items-center justify-center mt-5 mb-2 sm:mb-2">
                    <Image
                        src="/Audiomatrix-90.png"
                        alt="Audiomatrix Logo"
                        width={150}
                        height={150}
                        className="border-2 border-green-700 rounded-full"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default AboutPage; 
