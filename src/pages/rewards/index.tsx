import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import RewardsStore from '../../components/user/RewardsStore';
import { motion } from 'framer-motion';
import Head from 'next/head';

export default function RewardsPage() {
  return (
    <ProtectedRoute>
      <Head>
        <title>Rewards Store — EcoQuest</title>
        <meta name="description" content="Redeem your EcoQuest points for exclusive rewards, discounts, and prizes." />
      </Head>
      <div className="min-h-screen bg-primary particle-bg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-100 font-[family-name:var(--font-clash-display)] mb-3">
              <span className="text-gradient">Rewards</span> Store
            </h1>
            <p className="text-neutral-400 max-w-lg mx-auto font-[family-name:var(--font-satoshi)]">
              Redeem your hard-earned points for exclusive rewards and prizes
            </p>
          </div>

          <RewardsStore />
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
