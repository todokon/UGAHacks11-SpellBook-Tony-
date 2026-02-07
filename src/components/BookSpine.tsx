import { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Book } from '../types';
import { Trash2 } from 'lucide-react';

interface BookSpineProps {
  book: Book;
  onClick: () => void;
  onDelete: (bookId: string) => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
}

const ITEM_TYPE = 'BOOK';

export function BookSpine({ book, onClick, onDelete, onReorder }: BookSpineProps) {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Find the index of this book from its parent
  const findBookIndex = (bookId: string) => {
    const container = ref.current?.parentElement;
    if (!container) return 0;
    const bookElements = Array.from(container.children).filter(
      (child) => child.getAttribute('data-book-id')
    );
    return bookElements.findIndex((el) => el.getAttribute('data-book-id') === bookId);
  };

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => ({ id: book.id, index: findBookIndex(book.id) }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    hover: (item: { id: string; index: number }, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = item.index;
      const hoverIndex = findBookIndex(book.id);

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      
      if (!clientOffset) return;
      
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      onReorder(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drag(drop(ref));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete \"${book.title}\"? This will remove all notes inside.`)) {
      onDelete(book.id);
    }
  };

  // Generate varied heights for more organic look
  const bookHeight = 240 + (parseInt(book.id) % 5) * 12;
  const tilt = (parseInt(book.id) % 3) - 1; // -1, 0, or 1 degree tilt
  
  // Generate unique animation properties for each book
  const bookIndex = parseInt(book.id) || 0;
  const floatDuration = 3 + (bookIndex % 4) * 0.5; // 3s to 4.5s
  const floatDelay = (bookIndex % 5) * 0.3; // Stagger animations
  const floatDistance = 6 + (bookIndex % 3) * 2; // 6px to 10px
  const tiltVariation = (bookIndex % 4) - 1.5; // -1.5 to 1.5 degrees
  const glowIntensity = 0.15 + (bookIndex % 3) * 0.05; // Varied glow intensity

  return (
    <div
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: `${bookHeight}px` }}
      ref={ref}
      data-book-id={book.id}
    >
      {/* Magical aura around book - reduced intensity */}
      <div 
        className="absolute -inset-2 rounded-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${book.accentColor}40, transparent 70%)`,
          animation: `pulse-aura-${bookIndex} 2s ease-in-out infinite`,
          filter: 'blur(6px)',
        }}
      />

      {/* 3D ambient glow - always visible with subtle animation - reduced */}
      <div 
        className="absolute -inset-1 rounded-lg pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${book.accentColor}${Math.floor(glowIntensity * 255).toString(16).padStart(2, '0')}, transparent 60%)`,
          filter: 'blur(3px)',
          opacity: 0.3,
          animation: `glow-shift-${bookIndex} 4s ease-in-out infinite`,
        }}
      />

      {/* Magical particles emanating from book - varied shapes */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {/* Sparkle particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute animate-float-sparkle"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${i * 0.15}s`,
                animationDuration: `${1.5 + Math.random() * 1}s`,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12">
                <path 
                  d="M6,0 L7,5 L12,6 L7,7 L6,12 L5,7 L0,6 L5,5 Z" 
                  fill={book.accentColor}
                  opacity="0.8"
                  style={{ filter: `drop-shadow(0 0 3px ${book.accentColor})` }}
                />
              </svg>
            </div>
          ))}
          
          {/* Circular particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full animate-float-circle"
              style={{
                left: `${15 + Math.random() * 70}%`,
                top: `${5 + Math.random() * 90}%`,
                width: `${3 + Math.random() * 4}px`,
                height: `${3 + Math.random() * 4}px`,
                background: book.accentColor,
                boxShadow: `0 0 8px ${book.accentColor}`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${2 + Math.random() * 1}s`,
              }}
            />
          ))}
          
          {/* Diamond particles */}
          {[...Array(4)].map((_, i) => (
            <div
              key={`diamond-${i}`}
              className="absolute animate-float-diamond"
              style={{
                left: `${25 + Math.random() * 50}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.25}s`,
                animationDuration: `${2.5 + Math.random() * 1}s`,
              }}
            >
              <div 
                style={{
                  width: '8px',
                  height: '8px',
                  background: book.accentColor,
                  transform: 'rotate(45deg)',
                  boxShadow: `0 0 6px ${book.accentColor}`,
                  opacity: 0.7,
                }}
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={onClick}
        className="w-24 h-full transition-all duration-500 ease-out relative"
        style={{
          background: `linear-gradient(135deg, ${book.color}ee 0%, ${book.color} 50%, ${book.color}dd 100%)`,
          borderRadius: '8px 8px 4px 4px',
          transform: `rotate(${tilt}deg)`,
          boxShadow: `
            inset -3px 0 8px rgba(0,0,0,0.4),
            inset 3px 0 6px rgba(255,255,255,0.1),
            4px 4px 12px rgba(0,0,0,0.5),
            0 0 0 2px ${book.accentColor}40,
            0 0 20px ${book.accentColor}20,
            ${isHovered ? `0 0 40px ${book.accentColor}60, 0 0 60px ${book.accentColor}30` : ''}
          `,
          animation: `book-float-${bookIndex} ${floatDuration}s ease-in-out infinite ${floatDelay}s`,
        }}
      >
        {/* Leather texture overlay */}
        <div className="absolute inset-0 opacity-30 rounded-[8px_8px_4px_4px]" 
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3), transparent 40%),
              radial-gradient(circle at 80% 70%, rgba(0,0,0,0.2), transparent 50%),
              repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)
            `
          }} 
        />

        {/* Ornate top decoration */}
        <div className="absolute top-0 left-0 right-0 h-16 flex flex-col items-center justify-center gap-1">
          <div 
            className="w-10 h-10 relative"
            style={{ filter: `drop-shadow(0 2px 4px ${book.accentColor}60)` }}
          >
            {/* Arcane symbol - glowing */}
            <svg viewBox="0 0 40 40" className="w-full h-full">
              <defs>
                <filter id={`glow-${book.id}`}>
                  <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <circle cx="20" cy="20" r="12" fill="none" stroke={book.accentColor} strokeWidth="1.5" opacity="0.8" filter={`url(#glow-${book.id})`} className="animate-pulse"/>
              <circle cx="20" cy="20" r="8" fill="none" stroke={book.accentColor} strokeWidth="1" opacity="0.6" filter={`url(#glow-${book.id})`}/>
              <path d="M20,8 L20,32 M8,20 L32,20" stroke={book.accentColor} strokeWidth="1" opacity="0.7" filter={`url(#glow-${book.id})`}/>
              <circle cx="20" cy="8" r="2" fill={book.accentColor} opacity="0.8" filter={`url(#glow-${book.id})`}/>
              <circle cx="20" cy="32" r="2" fill={book.accentColor} opacity="0.8" filter={`url(#glow-${book.id})`}/>
              <circle cx="8" cy="20" r="2" fill={book.accentColor} opacity="0.8" filter={`url(#glow-${book.id})`}/>
              <circle cx="32" cy="20" r="2" fill={book.accentColor} opacity="0.8" filter={`url(#glow-${book.id})`}/>
            </svg>
          </div>
          
          {/* Decorative line */}
          <div className="w-16 h-px opacity-50" style={{ background: book.accentColor }} />
        </div>

        {/* Book title - vertical with ornate styling */}
        <div className="absolute inset-0 flex items-center justify-center pt-8">
          <span
            className="text-xs tracking-widest px-3 text-center leading-tight"
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              color: book.accentColor,
              textShadow: `
                0 2px 4px rgba(0,0,0,0.8),
                0 0 10px ${book.accentColor}40
              `,
              fontVariant: 'small-caps',
              fontFamily: 'Papyrus, fantasy',
            }}
          >
            {book.title}
          </span>
        </div>

        {/* Bottom decoration */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
          <div className="w-16 h-px opacity-50" style={{ background: book.accentColor }} />
          
          {/* Star symbols */}
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <svg key={i} width="8" height="8" viewBox="0 0 8 8">
                <path 
                  d="M4,0 L4.5,3 L8,4 L4.5,5 L4,8 L3.5,5 L0,4 L3.5,3 Z" 
                  fill={book.accentColor} 
                  opacity="0.7"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Magical glow effect */}
        <div 
          className={`absolute inset-0 rounded-[8px_8px_4px_4px] transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-30'}`}
          style={{
            background: `radial-gradient(circle at center, ${book.accentColor}50, transparent 60%)`,
            boxShadow: `0 0 30px ${book.accentColor}60, inset 0 0 30px ${book.accentColor}20`,
          }}
        />

        {/* Shimmering light effect */}
        <div 
          className="absolute inset-0 rounded-[8px_8px_4px_4px] opacity-20 pointer-events-none"
          style={{
            background: `linear-gradient(45deg, transparent 30%, ${book.accentColor}40 50%, transparent 70%)`,
            backgroundSize: '200% 200%',
            animation: 'shimmer-book 3s ease-in-out infinite',
          }}
        />

        {/* Spine edge highlights */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-2 rounded-l-lg"
          style={{
            background: `linear-gradient(to right, rgba(0,0,0,0.5), transparent)`
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-1"
          style={{
            background: `linear-gradient(to left, rgba(255,255,255,0.15), transparent)`
          }}
        />

        {/* Worn edges effect */}
        <div className="absolute inset-0 rounded-[8px_8px_4px_4px] border border-black/20" />
        
        {/* Ribbon bookmark */}
        <div 
          className="absolute -bottom-2 right-4 w-3 h-16 opacity-70"
          style={{
            background: `linear-gradient(to bottom, ${book.accentColor}, ${book.accentColor}cc)`,
            clipPath: 'polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)',
            boxShadow: '2px 2px 4px rgba(0,0,0,0.4)',
          }}
        />
      </button>

      {/* Delete button */}
      <button
        onClick={handleDelete}
        className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110 hover:from-red-500 hover:to-red-700 z-10 border-2 border-red-400"
      >
        <Trash2 className="w-3.5 h-3.5 text-white" />
      </button>

      {/* Book-specific shimmer animation */}
      <style>{`
        @keyframes shimmer-book {
          0%, 100% { background-position: -200% -200%; }
          50% { background-position: 200% 200%; }
        }
        
        @keyframes pulse-aura-${bookIndex} {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes glow-shift-${bookIndex} {
          0%, 100% { 
            transform: rotate(0deg) scale(1);
            opacity: 0.4;
          }
          50% { 
            transform: rotate(5deg) scale(1.1);
            opacity: 0.6;
          }
        }
        
        @keyframes book-float-${bookIndex} {
          0%, 100% { 
            transform: translateY(0) rotate(${tilt}deg);
          }
          50% { 
            transform: translateY(-${floatDistance}px) rotate(${tilt + tiltVariation}deg);
          }
        }
        
        @keyframes float-sparkle {
          0% { 
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% { 
            transform: translateY(-40px) scale(1.2) rotate(180deg);
            opacity: 0;
          }
        }
        
        @keyframes float-circle {
          0% { 
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.8;
          }
          100% { 
            transform: translate(${-20 + Math.random() * 40}px, -50px) scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes float-diamond {
          0% { 
            transform: translateY(0) scale(0) rotate(45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            opacity: 0.7;
          }
          100% { 
            transform: translateY(-45px) scale(1.3) rotate(225deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}