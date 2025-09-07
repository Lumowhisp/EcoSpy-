import React, { useState } from 'react';
import { Phone, Mail, Instagram, Linkedin, MapPin, Send, Leaf, MessageCircle } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-emerald-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-teal-200 rounded-full opacity-25 animate-ping"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-green-600 p-4 rounded-full mr-4 animate-bounce">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-green-800 tracking-tight">
              Eco<span className="text-green-600">Spy</span>
            </h1>
          </div>
          <p className="text-xl text-green-700 max-w-2xl mx-auto leading-relaxed">
            Get in touch with us! We'd love to hear from you and help make the world more sustainable.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-green-100">
            <h2 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
              <MessageCircle className="w-8 h-8 mr-3 text-green-600" />
              Contact Information
            </h2>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center group hover:bg-green-50 p-4 rounded-xl transition-all duration-300 cursor-pointer">
                <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Phone</h3>
                  <a href="tel:+917459971978" className="text-green-600 hover:text-green-800 transition-colors duration-300">
                    +91 7459971978
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center group hover:bg-green-50 p-4 rounded-xl transition-all duration-300 cursor-pointer">
                <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Email</h3>
                  <a href="mailto:kumaraditya12981006@gmail.com" className="text-green-600 hover:text-green-800 transition-colors duration-300 break-all">
                    kumaraditya12981006@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center group hover:bg-green-50 p-4 rounded-xl transition-all duration-300">
                <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors duration-300">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Organization</h3>
                  <p className="text-green-600">EcoSpy</p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 pt-8 border-t border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/geek_aditya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-full text-white hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/nerdyaditya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-600 p-3 rounded-full text-white hover:shadow-lg transform hover:scale-110 transition-all duration-300"
                >
                  <Linkedin className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-all duration-300 border border-green-100">
            <h2 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
              <Send className="w-8 h-8 mr-3 text-green-600" />
              Send us a Message
            </h2>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300 group-hover:border-green-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300 group-hover:border-green-300"
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-green-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:outline-none transition-colors duration-300 group-hover:border-green-300 resize-none"
                  placeholder="Tell us about your sustainability project or question..."
                />
              </div>

              <button
                onClick={handleSubmit}
                className={`w-full py-4 px-6 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
                  isSubmitted 
                    ? 'bg-green-600 animate-pulse' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                }`}
              >
                {isSubmitted ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Message Sent!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </span>
                )}
              </button>
            </div>

            {isSubmitted && (
              <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 text-center animate-fade-in">
                <p className="font-semibold">Thank you for reaching out!</p>
                <p className="text-sm">We'll get back to you soon.</p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4">Ready to make a difference?</h3>
            <p className="text-green-100 mb-6">Join EcoSpy in creating a more sustainable future for everyone.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="tel:+917459971978"
                className="bg-white text-green-600 px-6 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-300 inline-flex items-center"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
              <a 
                href="mailto:kumaraditya12981006@gmail.com"
                className="bg-green-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-800 transition-colors duration-300 inline-flex items-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;