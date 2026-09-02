import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiActivity, FiClock, FiBarChart2, FiCheck, FiStar, FiArrowRight, FiZap, FiHeart, FiShield } from 'react-icons/fi';
import { FiDumbbell } from '../components/Icons';
import AnimatedBackground from '../components/AnimatedBackground';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const features = [
  { icon: FiActivity, title: 'Workout Tracking', desc: 'Log every rep, set, and weight with our intelligent tracking system.' },
  { icon: FiTarget, title: 'Smart Scheduling', desc: 'Create personalized weekly schedules that adapt to your goals.' },
  { icon: FiBarChart2, title: 'Progress Analytics', desc: 'Beautiful charts showing your strength gains and fitness journey.' },
  { icon: FiClock, title: 'Pro Timer', desc: 'Built-in workout timer with rest intervals and countdown.' },
  { icon: FiHeart, title: 'Health Metrics', desc: 'Track calories, duration, and overall fitness improvements.' },
  { icon: FiShield, title: 'Secure & Private', desc: 'Your data is encrypted and protected with enterprise security.' },
];

const pricing = [
  { name: 'Basic', price: '0', period: 'forever', features: ['Workout Tracking', 'Basic Analytics', '1 User Profile', 'Mobile Access'], cta: 'Get Started Free', popular: false },
  { name: 'Pro', price: '29', period: '/month', features: ['Advanced Analytics', 'Unlimited Profiles', 'Custom Workouts', 'Priority Support', 'Nutrition Plans', 'Progress Photos'], cta: 'Start Pro Trial', popular: true },
  { name: 'Elite', price: '59', period: '/month', features: ['Everything in Pro', 'Personal Trainer AI', 'Meal Planning', 'Recovery Tracking', 'API Access', 'White Label'], cta: 'Go Elite', popular: false },
];

const testimonials = [
  { name: 'Marcus Johnson', role: 'Fitness Enthusiast', content: 'GYMFIT transformed my training. The analytics help me push past plateaus I never knew I had.', rating: 5 },
  { name: 'Sarah Chen', role: 'Personal Trainer', content: 'As a trainer, I use GYMFIT to manage all my clients. The scheduling feature is a game-changer.', rating: 5 },
  { name: 'David Park', role: 'Competitive Athlete', content: 'The progress tracking is incredible. I can see exactly how my strength improves week over week.', rating: 5 },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '2M+', label: 'Workouts Logged' },
  { value: '100+', label: 'Exercises' },
  { value: '99.9%', label: 'Uptime' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-hidden">
      <AnimatedBackground />
      
      <nav className="relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <FiDumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">GYMFIT</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="btn-ghost">Login</Link>
              <Link to="/signup" className="btn-primary text-sm !px-4 !py-2">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative z-10 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
              <FiZap className="w-4 h-4 text-primary-400" />
              <span className="text-sm text-primary-300">Premium Fitness Platform</span>
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl lg:text-8xl font-display font-black leading-tight mb-6">
              Transform Your
              <span className="block gradient-text">Fitness Journey</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
              Track workouts, analyze progress, and achieve your fitness goals with the most advanced gym management platform.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="btn-primary text-lg px-8 py-4 flex items-center gap-2">
                Start Free Trial <FiArrowRight className="w-5 h-5" />
              </Link>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">Learn More</a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 py-16 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-3xl md:text-4xl font-display font-black gradient-text">{stat.value}</div>
                <div className="text-sm text-white/50 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="section-title mb-4">Everything You Need</h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Powerful features designed to help you achieve your fitness goals faster.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/60">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="section-title mb-4">Simple Pricing</h2>
            <p className="text-white/60 text-lg">Choose the plan that fits your fitness journey.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative glass-card p-8 ${plan.popular ? 'border-primary-500/50 bg-primary-500/5 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-black text-white">${plan.price}</span>
                  <span className="text-white/50">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/70">
                      <FiCheck className="w-4 h-4 text-primary-400 shrink-0" /> {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular ? 'btn-primary' : 'btn-secondary'
                }`}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="section-title mb-4">Loved by Athletes</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="glass-card p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="w-4 h-4 fill-accent-400 text-accent-400" />)}
                </div>
                <p className="text-white/70 mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/50">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="glass-card p-12 md:p-16 border-primary-500/20 bg-gradient-to-br from-primary-500/10 to-transparent">
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-4">Ready to Transform?</h2>
            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">Join thousands of athletes who are already achieving their fitness goals with GYMFIT.</p>
            <Link to="/signup" className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2">
              Start Your Journey <FiArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-12 bg-dark-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
                <FiDumbbell className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold gradient-text">GYMFIT</span>
            </div>
            <p className="text-sm text-white/40">&copy; 2026 GYMFIT. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
