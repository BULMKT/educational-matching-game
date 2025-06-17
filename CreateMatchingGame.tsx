import React, { useState } from "react";

export type Pair = { left: string; right: string };

const defaultPairs: Pair[] = [
  { left: '', right: '' },
  { left: '', right: '' },
];

const CreateMatchingGame = ({ onPreview, initialTitle = "", initialPairs = defaultPairs, initialTheme = "jungle" }) => {
  const [title, setTitle] = useState(initialTitle);
  const [pairs, setPairs] = useState<Pair[]>(initialPairs);
  const [theme] = useState(initialTheme);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = () => {
    if (!title.trim() || pairs.some(p => !p.left.trim() || !p.right.trim())) {
      setError("Please fill in the game title and all pair fields.");
      return;
    }
    setError(null);
    onPreview(title, pairs, theme);
  };

  const addPair = () => setPairs([...pairs, { left: '', right: '' }]);
  const removePair = (idx: number) => setPairs(pairs.filter((_, i) => i !== idx));
  const updatePair = (idx: number, key: 'left' | 'right', value: string) => {
    setPairs(pairs.map((pair, i) => (i === idx ? { ...pair, [key]: value } : pair)));
  };

  const styles = {
    container: {
      maxWidth: '90rem',
      margin: '2rem auto',
      padding: '3rem',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '2rem',
      boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.3)',
      backdropFilter: 'blur(10px)',
      position: 'relative',
      overflow: 'hidden'
    },
    decorativePattern: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      fontSize: '2rem',
      opacity: 0.1,
      pointerEvents: 'none'
    },
    header: {
      marginBottom: '3rem',
      textAlign: 'center' as const,
      position: 'relative'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '800',
      marginBottom: '1rem',
      animation: 'titleGlow 3s ease-in-out infinite alternate',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap'
    },
    titleText: {
      background: 'linear-gradient(135deg, #8b5cf6, #6366f1, #3b82f6)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    subtitle: {
      fontSize: '1.2rem',
      color: '#6b7280',
      maxWidth: '36rem',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    inputContainer: {
      marginBottom: '2.5rem',
      position: 'relative'
    },
    label: {
      display: 'flex',
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#374151',
      marginBottom: '1rem',
      alignItems: 'center',
      gap: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '1rem 1.5rem',
      fontSize: '1.1rem',
      border: '2px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '1rem',
      background: 'rgba(255,255,255,0.9)',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit'
    },
    inputFocus: {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 4px rgba(99, 102, 241, 0.1)',
      background: 'rgba(255,255,255,1)'
    },
    pairsContainer: {
      display: 'grid',
      gap: '1.5rem',
      marginBottom: '3rem'
    },
    pairsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    pairRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr auto',
      gap: '1.5rem',
      alignItems: 'center',
      padding: '1.5rem',
      background: 'rgba(99, 102, 241, 0.05)',
      borderRadius: '1.5rem',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    pairRowHover: {
      background: 'rgba(99, 102, 241, 0.08)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(99, 102, 241, 0.15)'
    },
    arrowContainer: {
      display: 'flex',
      gap: '0.3rem',
      padding: '0 1rem',
      alignItems: 'center'
    },
    dot: {
      width: '0.3rem',
      height: '0.3rem',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
      animation: 'pulse 2s infinite'
    },
    button: {
      padding: '1rem 2.5rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      borderRadius: '1rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      position: 'relative',
      overflow: 'hidden'
    },
    addButton: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
      marginBottom: '2rem',
      width: 'fit-content',
      margin: '0 auto 2rem'
    },
    previewButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
      width: '100%',
      justifyContent: 'center',
      fontSize: '1.2rem',
      padding: '1.25rem 2.5rem'
    },
    removeButton: {
      padding: '0.75rem',
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem'
    },
    error: {
      color: '#ef4444',
      fontSize: '1rem',
      marginTop: '1rem',
      padding: '1rem 1.5rem',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '1rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(239, 68, 68, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    successMessage: {
      color: '#059669',
      fontSize: '1rem',
      marginTop: '1rem',
      padding: '1rem 1.5rem',
      background: 'rgba(16, 185, 129, 0.1)',
      borderRadius: '1rem',
      textAlign: 'center' as const,
      border: '1px solid rgba(16, 185, 129, 0.2)'
    },
    buttonShine: {
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      transition: 'left 0.6s ease'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.decorativePattern}>
        ✨🎮⚡🌟
      </div>
      
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={{fontSize: '3rem', marginRight: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}>🎨</span>
          <span style={styles.titleText}>Customize Your Game</span>
        </h2>
        <p style={styles.subtitle}>
          Create your own matching game by adding pairs of items that belong together. Make it educational, fun, or both!
        </p>
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>
          <span style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>🎯</span>
          <span>Game Title</span>
        </label>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Animal Sounds, Colors & Emotions"
          onFocus={(e) => {
            e.target.style.borderColor = '#6366f1';
            e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
            e.target.style.background = 'rgba(255,255,255,1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            e.target.style.boxShadow = 'none';
            e.target.style.background = 'rgba(255,255,255,0.9)';
          }}
        />
      </div>

      <div style={styles.pairsContainer}>
        <div style={styles.pairsHeader}>
          <label style={styles.label}>
            <span style={{fontSize: '1.5rem', marginRight: '0.5rem'}}>🔗</span>
            <span>Matching Pairs</span>
          </label>
          <span style={{
            background: 'rgba(99, 102, 241, 0.1)',
            color: '#6366f1',
            padding: '0.5rem 1rem',
            borderRadius: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}>
            {pairs.length} pairs
          </span>
        </div>
        
        {pairs.map((pair, idx) => (
          <div 
            key={idx} 
            style={styles.pairRow}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(99, 102, 241, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <input
              style={styles.input}
              value={pair.left}
              onChange={e => updatePair(idx, 'left', e.target.value)}
              placeholder="Left item (e.g., 🐕 Dog)"
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={styles.arrowContainer}>
              <div style={{...styles.dot, animationDelay: '0s'}}></div>
              <div style={{...styles.dot, animationDelay: '0.2s'}}></div>
              <div style={{...styles.dot, animationDelay: '0.4s'}}></div>
            </div>
            <input
              style={styles.input}
              value={pair.right}
              onChange={e => updatePair(idx, 'right', e.target.value)}
              placeholder="Right item (e.g., 🔊 Barks)"
              onFocus={(e) => {
                e.target.style.borderColor = '#6366f1';
                e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {pairs.length > 2 && (
              <button
                style={styles.removeButton}
                onClick={() => removePair(idx)}
                title="Remove this pair"
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        style={{...styles.button, ...styles.addButton}}
        onClick={addPair}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.6)';
          const shine = e.currentTarget.querySelector('.shine');
          if (shine) shine.style.left = '100%';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
          const shine = e.currentTarget.querySelector('.shine');
          if (shine) shine.style.left = '-100%';
        }}
      >
        <div className="shine" style={styles.buttonShine}></div>
        <span>➕</span> Add Another Pair
      </button>

      {error && (
        <div style={styles.error}>
          <span>⚠️</span>
          {error}
        </div>
      )}

      <button
        style={{...styles.button, ...styles.previewButton}}
        onClick={handlePreview}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.6)';
          const shine = e.currentTarget.querySelector('.shine');
          if (shine) shine.style.left = '100%';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
          const shine = e.currentTarget.querySelector('.shine');
          if (shine) shine.style.left = '-100%';
        }}
      >
        <div className="shine" style={styles.buttonShine}></div>
        <span>🚀</span> Preview Your Game
      </button>
    </div>
  );
};

export default CreateMatchingGame;
