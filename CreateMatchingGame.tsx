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
      padding: '2rem',
      background: 'rgba(255,255,255,0.95)',
      borderRadius: '1.5rem',
      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
      border: '1px solid rgba(255,255,255,0.3)',
      backdropFilter: 'blur(10px)'
    },
    header: {
      marginBottom: '2rem',
      textAlign: 'center' as const
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '1rem'
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#6b7280',
      maxWidth: '32rem',
      margin: '0 auto'
    },
    inputContainer: {
      marginBottom: '2rem'
    },
    label: {
      display: 'block',
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.75rem'
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      fontSize: '1.1rem',
      border: '2px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '0.875rem',
      background: 'rgba(255,255,255,0.9)',
      transition: 'all 0.3s ease'
    },
    pairsContainer: {
      display: 'grid',
      gap: '1rem',
      marginBottom: '2rem'
    },
    pairRow: {
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr auto',
      gap: '1rem',
      alignItems: 'center',
      padding: '1rem',
      background: 'rgba(99, 102, 241, 0.05)',
      borderRadius: '1rem',
      border: '1px solid rgba(99, 102, 241, 0.1)'
    },
    arrowContainer: {
      display: 'flex',
      gap: '0.25rem',
      padding: '0 0.5rem'
    },
    dot: {
      width: '0.25rem',
      height: '0.25rem',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
      animation: 'pulse 2s infinite'
    },
    button: {
      padding: '0.875rem 2rem',
      fontSize: '1rem',
      fontWeight: '600',
      borderRadius: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    addButton: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
      marginBottom: '2rem'
    },
    previewButton: {
      background: 'linear-gradient(135deg, #10b981, #059669)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
    },
    removeButton: {
      padding: '0.5rem',
      background: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    error: {
      color: '#ef4444',
      fontSize: '0.95rem',
      marginTop: '1rem',
      padding: '0.75rem 1rem',
      background: 'rgba(239, 68, 68, 0.1)',
      borderRadius: '0.5rem',
      textAlign: 'center' as const
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Customize Your Game</h2>
        <p style={styles.subtitle}>
          Create your own matching game by adding pairs of items that belong together.
        </p>
      </div>

      <div style={styles.inputContainer}>
        <label style={styles.label}>Game Title</label>
        <input
          style={{
            ...styles.input,
            ':focus': {
              borderColor: '#6366f1',
              boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.2)'
            }
          }}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Animal Sounds"
        />
      </div>

      <div style={styles.pairsContainer}>
        <label style={styles.label}>Matching Pairs</label>
        {pairs.map((pair, idx) => (
          <div key={idx} style={styles.pairRow}>
            <input
              style={styles.input}
              value={pair.left}
              onChange={e => updatePair(idx, 'left', e.target.value)}
              placeholder="Left item"
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
              placeholder="Right item"
            />
            {pairs.length > 2 && (
              <button
                style={styles.removeButton}
                onClick={() => removePair(idx)}
                title="Remove pair"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        style={{...styles.button, ...styles.addButton}}
        onClick={addPair}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
        }}
      >
        <span>+</span> Add Another Pair
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <button
        style={{...styles.button, ...styles.previewButton}}
        onClick={handlePreview}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
        }}
      >
        <span>▶</span> Preview Game
      </button>
    </div>
  );
};

export default CreateMatchingGame;
