import React from 'react'
import { ArrowRight } from 'lucide-react'

function FeatureCard({ icon, title, description, cta, href }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
      <div className="text-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <a 
        href={href} 
        className="text-gold hover:text-maroon transition-colors duration-300 flex items-center"
      >
        {cta} <ArrowRight className="ml-2 h-4 w-4" />
      </a>
    </div>
  )
}

export default FeatureCard;