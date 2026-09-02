import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute inset-0 bg-dark-950"/>
      <motion.div animate={{ x: [0, 30, 0], y: [0, -30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 left-20 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl"/>
      <motion.div animate={{ x: [0, -20, 0], y: [0, 20, 0] }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-primary-600/5 rounded-full blur-3xl"/>
      <motion.div animate={{ x: [0, 15, 0], y: [0, -15, 0] }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/[0.03] rounded-full blur-3xl"/>
    </div>
  );
}
