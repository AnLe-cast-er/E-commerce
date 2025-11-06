import React from 'react'
import { assets } from '../assets/assets'

const Hero = () => {
    return (
        <div className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-400 text-white">
            <div className="container-max mx-auto flex flex-col-reverse md:flex-row items-center gap-6 py-16 px-4 md:px-8">
                {/* Left: text */}
                <div className="w-full md:w-1/2">
                    <div className="max-w-lg">
                        <p className="text-indigo-100 font-medium mb-3">OUR BESTSELLER</p>
                        <h1 className="prata-regular text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-4">Latest Arrivals</h1>
                        <p className="text-indigo-100 mb-6">Discover our newest collection — crafted with care and designed for everyday comfort.</p>
                        <div className="flex items-center gap-4">
                            <a href="/collection" className="inline-block bg-white text-indigo-600 px-5 py-3 rounded-md font-medium shadow-md hover:shadow-lg transition">Shop Now</a>
                            <a href="/about" className="text-indigo-100 underline underline-offset-4">Learn more</a>
                        </div>
                    </div>
                </div>

                {/* Right: image */}
                <div className="w-full md:w-1/2 flex items-center justify-center">
                    <div className="w-full max-w-md overflow-hidden rounded-xl shadow-lg">
                        <img className="w-full h-80 object-cover" src={assets.hero} alt="Hero" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero