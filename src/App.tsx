import React, { useEffect } from 'react'
import emailjs from '@emailjs/browser'
import Portfolio from './components/home'

function App() {
  useEffect(() => {
    // Initialize EmailJS with your public key
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    if (publicKey) {
      emailjs.init(publicKey)
      console.log('[EmailJS] Initialized successfully')
    } else {
      console.error('[EmailJS] Public key not found in environment variables')
    }
  }, [])

  return <Portfolio />
}

export default App