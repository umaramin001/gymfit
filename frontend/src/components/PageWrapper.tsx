import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function PageWrapper({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {title && <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-8">{title}</h1>}
      {children}
    </motion.div>
  );
}
