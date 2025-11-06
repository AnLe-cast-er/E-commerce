import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1="ABOUT" text2="US"/>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16 items-center'>
        <img 
          className='w-full md:w-1/2 max-w-[500px] h-auto rounded-lg shadow-lg' 
          src={assets.about_img} 
          alt="Our Store" 
        />
        
        <div className='flex flex-col justify-center gap-6 md:w-1/2'>
          <h3 className='text-2xl font-semibold text-gray-800'>Your Fashion Journey Starts Here</h3>
          <p className='text-gray-600 leading-relaxed'>
            Welcome to Clothing Store, where style meets comfort and quality. Since 2020, 
            we've been curating the finest collection of fashion pieces that empower you 
            to express your unique personality through clothing.
          </p>
          
          <div className='mt-4'>
            <h4 className='text-xl font-semibold text-gray-800 mb-3'>Our Mission</h4>
            <p className='text-gray-600 leading-relaxed'>
              To provide our customers with high-quality, trendy fashion that's both 
              accessible and sustainable. We believe that great style shouldn't compromise 
              comfort or values.
            </p>
          </div>
        </div>
      </div>

      <div className='mt-16'>
        <div className='text-2xl text-center mb-12'>
          <Title text1="WHY" text2="CHOOSE US"/>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Quality Assurance</h3>
            <p className='text-gray-600'>
              Every piece in our collection is carefully selected and quality-checked 
              to ensure the highest standards of craftsmanship.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Trendy Collections</h3>
            <p className='text-gray-600'>
              Stay ahead of fashion trends with our regularly updated collections, 
              featuring the latest styles and seasonal must-haves.
            </p>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border'>
            <h3 className='text-lg font-semibold text-gray-800 mb-3'>Customer First</h3>
            <p className='text-gray-600'>
              Our dedicated support team is here to help you find the perfect fit 
              and ensure your shopping experience is seamless.
            </p>
          </div>
        </div>

        <div className='mt-16 bg-gray-50 p-8 rounded-lg'>
          <h3 className='text-xl font-semibold text-gray-800 mb-4 text-center'>Our Values</h3>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-gray-800 mb-2'>🌿 Sustainability</h4>
              <p className='text-gray-600'>
                We're committed to reducing our environmental impact through 
                sustainable practices and eco-friendly packaging.
              </p>
            </div>
            <div>
              <h4 className='font-medium text-gray-800 mb-2'>🤝 Community</h4>
              <p className='text-gray-600'>
                We believe in building a community of fashion enthusiasts who share 
                our passion for style and sustainability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About