import React from 'react';
import { motion } from 'framer-motion';
import Header from '../Components/Lost&Found/Header';
import MainLostAndFound from '../Components/Lost&Found/MainLostAndFound';

const LostAndFoundPage = () => {
  return (
    <div 
      className="min-h-full flex relative"
      style={{
        background: 'linear-gradient(90deg, #E0B7BE 0%, #F6B19A 50%, #DFAEB7 100%)'
      }}
    >
      <Header />
      
        <MainLostAndFound />
      
    </div>
  );
};

export default LostAndFoundPage;