import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='grid grid-cols-3 gap-14 my-10 mt-40 text-sm'>

            <div className='flex flex-col items-center'>
                <img src={assets.logo} className='mb-5 w-[60px] h-[60px]' alt=''/>
                <p className='w-full md:w-2/3 text-gray-600'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>
                    COMPANY
                </p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>(+84) 123 456 789</li>
                    <li>contact@clothingstore.com</li>
                </ul>
            </div>
        </div>

        <div>
            <hr/>
            <p className='py-5 text-sm text-center'>Copyright 2025@ myproject.com - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer