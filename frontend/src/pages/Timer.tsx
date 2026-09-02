import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiPlay, FiPause, FiRotateCcw, FiClock, FiZap } from 'react-icons/fi';
import PageWrapper from '../components/PageWrapper';

type TimerMode = 'stopwatch' | 'countdown' | 'interval';

export default function Timer() {
  const [mode, setMode] = useState<TimerMode>('stopwatch');
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdownDuration, setCountdownDuration] = useState(60);
  const [workDuration, setWorkDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(15);
  const [isWorkPhase, setIsWorkPhase] = useState(true);
  const [intervalCount, setIntervalCount] = useState(0);
  const [totalIntervals, setTotalIntervals] = useState(8);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    if (mode === 'stopwatch') {
      startTimeRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else if (mode === 'countdown') {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (mode === 'interval') {
      intervalRef.current = setInterval(() => {
        setElapsed(prev => {
          const currentPhaseDuration = isWorkPhase ? workDuration : restDuration;
          if (prev >= currentPhaseDuration) {
            if (isWorkPhase) {
              setIsWorkPhase(false);
              return 0;
            } else {
              setIsWorkPhase(true);
              setIntervalCount(p => {
                if (p + 1 >= totalIntervals) {
                  clearInterval(intervalRef.current!);
                  setIsRunning(false);
                  return 0;
                }
                return p + 1;
              });
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
    }
    setIsRunning(true);
  }, [mode, elapsed, isWorkPhase, workDuration, restDuration, totalIntervals]);

  const pauseTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setElapsed(0);
    setIsWorkPhase(true);
    setIntervalCount(0);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (mode === 'countdown') setElapsed(countdownDuration);
  }, [mode, countdownDuration]);

  const progress = mode === 'countdown' 
    ? ((countdownDuration - elapsed) / countdownDuration) * 100
    : mode === 'interval'
    ? (elapsed / (isWorkPhase ? workDuration : restDuration)) * 100
    : Math.min((elapsed / 3600) * 100, 100);

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <PageWrapper title="Workout Timer">
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-2 mb-8 justify-center">
          {([
            { key: 'stopwatch', label: 'Stopwatch', icon: FiClock },
            { key: 'countdown', label: 'Countdown', icon: FiZap },
            { key: 'interval', label: 'Interval', icon: FiPlay },
          ] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => { resetTimer(); setMode(key); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                mode === key ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
              }`}>
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        <div className="glass-card p-8 text-center">
          {mode === 'interval' && (
            <div className={`mb-6 p-3 rounded-xl ${isWorkPhase ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
              <p className={`text-sm font-semibold ${isWorkPhase ? 'text-emerald-400' : 'text-orange-400'}`}>
                {isWorkPhase ? 'WORK' : 'REST'} - Set {intervalCount + 1} of {totalIntervals}
              </p>
            </div>
          )}

          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
              <circle cx="128" cy="128" r="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
              <circle cx="128" cy="128" r="120" fill="none"
                stroke={mode === 'interval' ? (isWorkPhase ? '#10b981' : '#f97316') : '#ec4899'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl font-display font-black text-white">
                {formatTime(mode === 'countdown' ? elapsed : elapsed)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mb-8">
            <button onClick={isRunning ? pauseTimer : startTimer}
              className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center hover:from-primary-400 hover:to-primary-500 transition-all shadow-lg shadow-primary-500/25">
              {isRunning ? <FiPause className="w-7 h-7 text-white" /> : <FiPlay className="w-7 h-7 text-white ml-1" />}
            </button>
            <button onClick={resetTimer}
              className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all">
              <FiRotateCcw className="w-5 h-5 text-white" />
            </button>
          </div>

          {mode === 'countdown' && (
            <div className="max-w-xs mx-auto">
              <label className="block text-sm text-white/50 mb-2">Duration (seconds)</label>
              <input type="range" min="10" max="300" value={countdownDuration}
                onChange={e => setCountdownDuration(parseInt(e.target.value))} className="w-full accent-primary-500" />
              <p className="text-sm text-white/50 mt-1">{countdownDuration}s ({Math.floor(countdownDuration / 60)}m {countdownDuration % 60}s)</p>
            </div>
          )}

          {mode === 'interval' && (
            <div className="max-w-md mx-auto grid grid-cols-3 gap-4 mt-6">
              <div>
                <label className="block text-xs text-white/50 mb-1">Work (s)</label>
                <input type="number" value={workDuration} onChange={e => setWorkDuration(parseInt(e.target.value) || 30)} className="input-field text-center text-sm" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Rest (s)</label>
                <input type="number" value={restDuration} onChange={e => setRestDuration(parseInt(e.target.value) || 15)} className="input-field text-center text-sm" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1">Sets</label>
                <input type="number" value={totalIntervals} onChange={e => setTotalIntervals(parseInt(e.target.value) || 8)} className="input-field text-center text-sm" />
              </div>
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
