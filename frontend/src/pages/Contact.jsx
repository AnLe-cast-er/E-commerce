import React, { useState } from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    toast.success('Thank you for your message. We will get back to you soon!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className='text-center text-2xl pt-10 border-t mb-12'>
        <Title text1="CONTACT" text2="US"/>
      </div>

      <div className='grid md:grid-cols-2 gap-12 items-start'>
        {/* Contact Information */}
        <div className='space-y-8'>
          <div className='flex flex-col md:flex-row gap-8 items-center md:items-start'>
            <img 
              className='w-[300px] h-[300px] object-cover rounded-lg shadow-lg' 
              src={assets.contact_img} 
              alt="Our Store" 
            />
            <div className='flex flex-col justify-center items-start gap-6'>
              <h3 className='font-semibold text-2xl text-gray-800'>
                Visit Our Store
              </h3>
              <div className='space-y-4'>
                <p className='flex items-center gap-3 text-gray-600'>
                  <span className='text-xl'>📍</span>
                  123 Fashion Street, District 1, Ho Chi Minh City, Vietnam
                </p>
                <p className='flex items-center gap-3 text-gray-600'>
                  <span className='text-xl'>📱</span>
                  (+84) 123 456 789
                </p>
                <p className='flex items-center gap-3 text-gray-600'>
                  <span className='text-xl'>✉️</span>
                  contact@clothingstore.com
                </p>
              </div>
            </div>
          </div>

          <div className='bg-gray-50 p-6 rounded-lg'>
            <h3 className='font-semibold text-xl text-gray-800 mb-4'>Store Hours</h3>
            <div className='space-y-2 text-gray-600'>
              <p className='flex justify-between'>
                <span>Monday - Friday:</span>
                <span>9:00 AM - 9:00 PM</span>
              </p>
              <p className='flex justify-between'>
                <span>Saturday:</span>
                <span>9:00 AM - 8:00 PM</span>
              </p>
              <p className='flex justify-between'>
                <span>Sunday:</span>
                <span>10:00 AM - 6:00 PM</span>
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='bg-white p-8 rounded-lg shadow-sm border'>
          <h3 className='font-semibold text-2xl text-gray-800 mb-6'>Send Us a Message</h3>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-gray-700 mb-2' htmlFor="name">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2' htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2' htmlFor="subject">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              />
            </div>

            <div>
              <label className='block text-gray-700 mb-2' htmlFor="message">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className='w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors'
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map or Additional Information Section */}
      <div className='mt-16'>
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h3 className='font-semibold text-xl text-gray-800 mb-4'>Additional Information</h3>
          <div className='grid md:grid-cols-3 gap-6 text-gray-600'>
            <div>
              <h4 className='font-medium text-gray-800 mb-2'>Customer Service</h4>
              <p>Available 24/7 to assist you with any questions or concerns.</p>
            </div>
            <div>
              <h4 className='font-medium text-gray-800 mb-2'>Returns & Exchanges</h4>
              <p>Visit our store for hassle-free returns and exchanges within 30 days.</p>
            </div>
            <div>
              <h4 className='font-medium text-gray-800 mb-2'>Wholesale Inquiries</h4>
              <p>Contact us for bulk orders and wholesale pricing information.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact