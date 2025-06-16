import React, { useState, useRef, useEffect } from "react";
import CreateMatchingGame from "./CreateMatchingGame";

const builtInGames = [
	{
		id: "animal-sounds",
		title: "Animal Sounds",
		theme: "jungle",
		template: "matching",
		emoji: "🦁",
		color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
		items: [
			{ left: "Dog", right: "Barks" },
			{ left: "Cat", right: "Meows" },
			{ left: "Cow", right: "Moos" },
			{ left: "Sheep", right: "Baahs" },
		],
	},
	{
		id: "predator-prey",
		title: "Predator & Prey",
		theme: "desert",
		template: "matching",
		emoji: "🦅",
		color: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
		items: [
			{ left: "Lion", right: "Zebra" },
			{ left: "Wolf", right: "Rabbit" },
			{ left: "Eagle", right: "Mouse" },
		],
	},
];

const App = () => {
	const [view, setView] = useState("home");
	const [selectedGame, setSelectedGame] = useState(null);
	const [customGame, setCustomGame] = useState(null);
	const canvasRef = useRef(null);

	useEffect(() => {
		if (view === "play" && canvasRef.current && selectedGame) {
			let game;
			import("./engine/core/Game").then(({ Game }) => {
				import("./engine/utils/loader").then(({ Loader }) => {
					const originalLoad = Loader.loadGameData;
					Loader.loadGameData = () => selectedGame;
					game = new Game(canvasRef.current);
					game.start();
					Loader.loadGameData = originalLoad;
				});
			});

			const handleEsc = (e) => {
				if (e.key === "Escape") {
					if (game) {
						game.stop();
					}
					setView("home");
				}
			};
			window.addEventListener("keydown", handleEsc);
			return () => {
				window.removeEventListener("keydown", handleEsc);
				if (game) {
					game.stop();
				}
			};
		}
	}, [view, selectedGame]);

	const handlePreviewGame = (title, pairs, theme = "jungle") => {
		setCustomGame({ template: "matching", theme, title, items: pairs });
		setSelectedGame({ template: "matching", theme, title, items: pairs });
		setView("play");
	};

	const handleCustomize = (game) => {
		setCustomGame({ ...game });
		setView("edit");
	};

	// If in play mode, render only the canvas in full screen
	if (view === "play") {
		return (
			<div className="game-page">
				<canvas
					ref={canvasRef}
					className="game-canvas"
				/>
			</div>
		);
	}

	// For home and edit views, render the scrollable content
	return (
		<div className="home-page">
			<div className="min-h-screen p-4">
				{view === "edit" ? (
					<CreateMatchingGame
						initialTitle={customGame?.title || ""}
						initialPairs={customGame?.items || []}
						initialTheme={customGame?.theme || "jungle"}
						onPreview={handlePreviewGame}
					/>
				) : (
					<>
						<header className="text-center py-12">
							<h1 className="text-6xl font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent mb-4">
								Fun Learning Games
							</h1>
							<p className="text-xl text-gray-600 max-w-2xl mx-auto">
								Interactive educational games for learning and engagement
							</p>
						</header>
						<section className="max-w-7xl mx-auto px-4">
							<h2 className="text-4xl font-bold text-center mb-12 text-white">
								Choose a Game
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{builtInGames.map((game) => (
									<div
										key={game.id}
										className="bg-white/95 rounded-2xl p-8 shadow-xl backdrop-blur-sm border border-white/30 hover:shadow-2xl transition-all duration-300 cursor-pointer"
										style={{ background: game.color }}
										onClick={() => {
											setSelectedGame(game);
											setView("play");
										}}
									>
										<div className="text-4xl mb-4">{game.emoji}</div>
										<h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
										<button
											onClick={(e) => {
												e.stopPropagation();
												handleCustomize(game);
											}}
											className="mt-4 bg-white/20 hover:bg-white/30 text-white"
										>
											Customize
										</button>
									</div>
								))}
							</div>
						</section>
					</>
				)}
			</div>
		</div>
	);
};

// Separate GameCard component for cleaner code
const GameCard = ({ game, onPlay, onEdit, styles }) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			style={{
				...styles.gameCard,
				...(isHovered ? styles.gameCardHover : {})
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div style={styles.gameEmoji}>
				{game.emoji}
			</div>
			
			<h3 style={styles.gameTitle}>
				{game.title}
			</h3>
			
			<div style={styles.pairsList}>
				{game.items.slice(0, 2).map((pair, i) => (
					<div key={i} style={styles.pairItem}>
						<span style={{fontWeight: '600', color: '#374151'}}>{pair.left}</span>
						<div style={styles.pairArrow}>
							<div style={{...styles.dot, animationDelay: '0s'}}></div>
							<div style={{...styles.dot, animationDelay: '0.2s'}}></div>
							<div style={{...styles.dot, animationDelay: '0.4s'}}></div>
						</div>
						<span style={{fontWeight: '600', color: '#059669'}}>{pair.right}</span>
					</div>
				))}
				{game.items.length > 2 && (
					<div style={{
						textAlign: 'center',
						color: '#6b7280',
						fontSize: '0.85rem',
						fontWeight: '500',
						padding: '0.5rem'
					}}>
						+{game.items.length - 2} more pairs
					</div>
				)}
			</div>
			
			<div style={styles.buttonGroup}>
				<button
					style={styles.playButton}
					onClick={onPlay}
					onMouseEnter={(e) => {
						e.target.style.transform = 'translateY(-2px)';
						e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.6)';
					}}
					onMouseLeave={(e) => {
						e.target.style.transform = 'translateY(0)';
						e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
					}}
				>
					<span>▶</span> Play
				</button>
				<button
					style={styles.editButton}
					onClick={onEdit}
					onMouseEnter={(e) => {
						e.target.style.transform = 'translateY(-2px)';
						e.target.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.6)';
					}}
					onMouseLeave={(e) => {
						e.target.style.transform = 'translateY(0)';
						e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
					}}
				>
					<span>✏</span> Edit
				</button>
			</div>
		</div>
	);
};

export default App;