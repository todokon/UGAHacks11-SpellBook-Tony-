import { useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Book } from '../types';

interface BookOpeningAnimationProps {
  book: Book;
  onAnimationComplete: () => void;
}

export function BookOpeningAnimation({ book, onAnimationComplete }: BookOpeningAnimationProps) {
  useEffect(() => {
    // Auto-complete animation after duration
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 2500);
    
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      {/* Magical particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: book.accentColor,
              boxShadow: `0 0 10px ${book.accentColor}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -50, -100],
            }}
            transition={{
              duration: 2,
              delay: Math.random() * 1,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Book opening container */}
      <div className="relative w-[800px] h-[600px] perspective-[2000px]">
        {/* Center magical glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5] }}
          transition={{ duration: 1.5 }}
        >
          <div
            className="w-64 h-64 rounded-full blur-3xl"
            style={{
              background: `radial-gradient(circle, ${book.accentColor}60, transparent)`,
            }}
          />
        </motion.div>

        {/* Book spine (center line) */}
        <motion.div
          className="absolute left-1/2 top-1/2 w-3 h-[500px] -translate-x-1/2 -translate-y-1/2 z-20"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.6), ${book.color}40, rgba(0,0,0,0.6))`,
            boxShadow: `0 0 30px ${book.accentColor}40`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1] }}
          transition={{ duration: 0.5 }}
        />

        {/* Magical sparkle at center */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          initial={{ scale: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1.5, 1],
            rotate: [0, 180, 360],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Sparkles
            className="w-12 h-12"
            style={{
              color: book.accentColor,
              filter: `drop-shadow(0 0 20px ${book.accentColor})`,
            }}
          />
        </motion.div>

        {/* Left cover */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-right"
          style={{
            width: '400px',
            height: '500px',
            marginLeft: '-400px',
            marginTop: '-250px',
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 25 }}
          transition={{ 
            duration: 1.5,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.3
          }}
        >
          {/* Book cover */}
          <div
            className="absolute inset-0 rounded-l-xl shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${book.color}f0, ${book.color}cc, ${book.color}e8)`,
              border: `4px solid ${book.accentColor}80`,
              borderRight: 'none',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Leather texture */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px),
                  repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)
                `
              }}
            />
            
            {/* Title on cover */}
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Sparkles
                    className="w-16 h-16 mx-auto mb-4"
                    style={{
                      color: book.accentColor,
                      filter: `drop-shadow(0 0 15px ${book.accentColor})`,
                    }}
                  />
                  <h2
                    className="text-3xl font-serif"
                    style={{
                      color: book.accentColor,
                      textShadow: `0 0 20px ${book.accentColor}80, 2px 2px 4px rgba(0,0,0,0.8)`,
                    }}
                  >
                    {book.title}
                  </h2>
                </motion.div>
              </div>
            </div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-12 h-12 opacity-60">
              <svg viewBox="0 0 50 50" fill={book.accentColor}>
                <path d="M0,0 L50,0 L50,5 L5,5 L5,50 L0,50 Z" opacity="0.6" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            </div>
            <div className="absolute bottom-4 left-4 w-12 h-12 opacity-60 rotate-90">
              <svg viewBox="0 0 50 50" fill={book.accentColor}>
                <path d="M0,0 L50,0 L50,5 L5,5 L5,50 L0,50 Z" opacity="0.6" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${book.accentColor}20, transparent 70%)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Pages edge */}
          <div
            className="absolute top-2 bottom-2 right-0 w-6"
            style={{
              background: 'linear-gradient(to right, #f5e6d3, #e8d4b8, #f0e0ca)',
              boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.2)',
              transform: 'translateZ(-2px)',
            }}
          >
            {/* Page lines */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="h-[1px] bg-amber-900/10"
                style={{ marginTop: i === 0 ? '30px' : '28px' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right cover */}
        <motion.div
          className="absolute left-1/2 top-1/2 origin-left"
          style={{
            width: '400px',
            height: '500px',
            marginTop: '-250px',
            transformStyle: 'preserve-3d',
          }}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -25 }}
          transition={{ 
            duration: 1.5,
            ease: [0.4, 0.0, 0.2, 1],
            delay: 0.3
          }}
        >
          {/* Book cover */}
          <div
            className="absolute inset-0 rounded-r-xl shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${book.color}e8, ${book.color}cc, ${book.color}f0)`,
              border: `4px solid ${book.accentColor}80`,
              borderLeft: 'none',
              backfaceVisibility: 'hidden',
            }}
          >
            {/* Leather texture */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px),
                  repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.08) 4px, rgba(0,0,0,0.08) 5px)
                `
              }}
            />

            {/* Decorative corner elements */}
            <div className="absolute top-4 right-4 w-12 h-12 opacity-60 -rotate-90">
              <svg viewBox="0 0 50 50" fill={book.accentColor}>
                <path d="M0,0 L50,0 L50,5 L5,5 L5,50 L0,50 Z" opacity="0.6" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12 opacity-60 rotate-180">
              <svg viewBox="0 0 50 50" fill={book.accentColor}>
                <path d="M0,0 L50,0 L50,5 L5,5 L5,50 L0,50 Z" opacity="0.6" />
                <circle cx="10" cy="10" r="3" />
              </svg>
            </div>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at center, ${book.accentColor}20, transparent 70%)`,
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>

          {/* Pages edge */}
          <div
            className="absolute top-2 bottom-2 left-0 w-6"
            style={{
              background: 'linear-gradient(to left, #f5e6d3, #e8d4b8, #f0e0ca)',
              boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.2)',
              transform: 'translateZ(-2px)',
            }}
          >
            {/* Page lines */}
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="h-[1px] bg-amber-900/10"
                style={{ marginTop: i === 0 ? '30px' : '28px' }}
              />
            ))}
          </div>
        </motion.div>

        {/* Mystical text */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
          transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
        >
          <p
            className="text-xl font-serif italic"
            style={{
              color: book.accentColor,
              textShadow: `0 0 20px ${book.accentColor}, 0 0 40px ${book.accentColor}40`,
            }}
          >
            Opening the Tome of Knowledge...
          </p>
        </motion.div>
      </div>
    </div>
  );
}
