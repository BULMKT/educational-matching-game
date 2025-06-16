import React, { useState } from "react";

export type Pair = { left: string; right: string };

const defaultPairs: Pair[] = [
  { left: '', right: '' },
  { left: '', right: '' },
];

const CreateMatchingGame = ({ onPreview, initialTitle = "", initialPairs = defaultPairs, initialTheme = "jungle" }) => {
  const [title, setTitle] = useState(initialTitle);
  const [pairs, setPairs] = useState<Pair[]>(initialPairs);
  const [theme] = useState(initialTheme); // For future theme support
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

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20 mt-8 fade-in">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6 flex items-center gap-3">
        <span className="inline-block text-purple-600 text-4xl">✏️</span>
        Edit Game: <span className="text-gray-800">{title || 'Untitled'}</span>
      </h2>
      <p className="text-gray-600 mb-4">Customize your matching game below. Add pairs, edit the title, and preview instantly!</p>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-lg">Game Title</label>
        <input
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/90"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Animal Sounds"
        />
      </div>
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-lg">Pairs</label>
        <div className="space-y-3">
          {pairs.map((pair, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white/90"
                value={pair.left}
                onChange={e => updatePair(idx, "left", e.target.value)}
                placeholder="Left Item"
              />
              <span className="mx-2 text-xl font-bold">→</span>
              <input
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white/90"
                value={pair.right}
                onChange={e => updatePair(idx, "right", e.target.value)}
                placeholder="Right Item"
              />
              <button
                className="ml-2 text-red-500 hover:text-red-700 text-2xl transition-all duration-150"
                onClick={() => removePair(idx)}
                aria-label="Remove pair"
                disabled={pairs.length <= 1}
                title="Remove this pair"
              >
                ❌
              </button>
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-5 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all duration-150"
          onClick={addPair}
        >
          + Add Pair
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 font-semibold">{error}</div>
      )}
      <button
        className="w-full py-3 mt-4 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-xl font-bold shadow-md transition-all duration-150"
        onClick={handlePreview}
      >
        <span className="inline-block align-middle mr-2">▶️</span> Preview Game
      </button>
    </div>
  );
};

export default CreateMatchingGame;
