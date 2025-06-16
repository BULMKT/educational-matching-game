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
			
			// Set initial canvas size
			const canvas = canvasRef.current;
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;

			// Initialize game
			Promise.all([
				import("./engine/core/Game"),
				import("./engine/utils/loader")
			]).then(([{ Game }, { Loader }]) => {
				const originalLoad = Loader.loadGameData;
				Loader.loadGameData = () => selectedGame;
				game = new Game(canvas);
				game.start();
				Loader.loadGameData = originalLoad;
			}).catch(error => {
				console.error("Error loading game:", error);
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
		const gameData = {
			id: `custom-${Date.now()}`,
			title: title,
			theme: theme,
			template: "matching",
			emoji: "✨",
			color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
			items: pairs
		};
		setCustomGame(gameData);
		setSelectedGame(gameData);
		setView("play");
	};

	const handleCustomize = (game) => {
		setCustomGame({ ...game });
		setView("edit");
	};

	const styles = {
		container: {
			minHeight: '100vh',
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
			color: '#1f2937',
			position: 'relative',
			overflowY: 'auto', // Changed from 'hidden' to 'auto' to allow scrolling
			overflowX: 'hidden' // Keep horizontal overflow hidden
		},
		backgroundOrb1: {
			position: 'absolute',
			top: '-10rem',
			right: '-10rem',
			width: '20rem',
			height: '20rem',
			background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
			borderRadius: '50%',
			animation: 'float 6s ease-in-out infinite',
			zIndex: 1
		},
		backgroundOrb2: {
			position: 'absolute',
			bottom: '-10rem',
			left: '-10rem',
			width: '24rem',
			height: '24rem',
			background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
			borderRadius: '50%',
			animation: 'float 8s ease-in-out infinite reverse',
			zIndex: 1
		},
		content: {
			position: 'relative',
			zIndex: 10
		},
		header: {
			textAlign: 'center',
			padding: '4rem 1rem'
		},
		mainTitle: {
			fontSize: 'clamp(3rem, 8vw, 6rem)',
			fontWeight: '900',
			background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			textShadow: '0 4px 8px rgba(0,0,0,0.3)',
			marginBottom: '1rem',
			letterSpacing: '-0.02em'
		},
		subtitle: {
			fontSize: '1.25rem',
			color: 'rgba(255,255,255,0.9)',
			maxWidth: '32rem',
			margin: '0 auto',
			lineHeight: '1.6',
			fontWeight: '400'
		},
		sectionTitle: {
			fontSize: '2.5rem',
			fontWeight: '800',
			textAlign: 'center',
			color: 'white',
			marginBottom: '3rem',
			textShadow: '0 4px 8px rgba(0,0,0,0.3)'
		},
		gameGrid: {
			display: 'grid',
			gap: '2rem',
			gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
			maxWidth: '90rem',
			margin: '0 auto',
			padding: '0 1rem 2rem' // Added bottom padding for better scrolling
		},
		gameCard: {
			background: 'rgba(255,255,255,0.95)',
			borderRadius: '1.5rem',
			padding: '2rem',
			boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
			border: '1px solid rgba(255,255,255,0.3)',
			backdropFilter: 'blur(10px)',
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
			cursor: 'pointer',
			position: 'relative',
			overflow: 'hidden'
		},
		gameCardHover: {
			transform: 'translateY(-8px) scale(1.02)',
			boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
			background: 'rgba(255,255,255,0.98)'
		},
		gameEmoji: {
			fontSize: '4rem',
			marginBottom: '1rem',
			display: 'block',
			textAlign: 'center',
			filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
		},
		gameTitle: {
			fontSize: '1.5rem',
			fontWeight: '700',
			color: '#1f2937',
			marginBottom: '1rem',
			textAlign: 'center'
		},
		pairsList: {
			marginBottom: '1.5rem'
		},
		pairItem: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: '0.75rem 1rem',
			margin: '0.5rem 0',
			background: 'rgba(99, 102, 241, 0.1)',
			borderRadius: '0.75rem',
			fontSize: '0.9rem',
			border: '1px solid rgba(99, 102, 241, 0.2)'
		},
		pairArrow: {
			display: 'flex',
			gap: '0.25rem'
		},
		dot: {
			width: '0.25rem',
			height: '0.25rem',
			borderRadius: '50%',
			background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
			animation: 'pulse 2s infinite'
		},
		buttonGroup: {
			display: 'flex',
			gap: '0.75rem'
		},
		playButton: {
			flex: 1,
			padding: '0.875rem 1rem',
			background: 'linear-gradient(135deg, #10b981, #059669)',
			color: 'white',
			border: 'none',
			borderRadius: '0.875rem',
			fontWeight: '600',
			fontSize: '0.95rem',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem'
		},
		editButton: {
			flex: 1,
			padding: '0.875rem 1rem',
			background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
			color: 'white',
			border: 'none',
			borderRadius: '0.875rem',
			fontWeight: '600',
			fontSize: '0.95rem',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem'
		},
		backButton: {
			padding: '0.75rem 2rem',
			background: 'rgba(255,255,255,0.2)',
			backdropFilter: 'blur(10px)',
			color: 'white',
			border: '1px solid rgba(255,255,255,0.3)',
			borderRadius: '1rem',
			fontWeight: '600',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			marginBottom: '2rem',
			display: 'flex',
			alignItems: 'center',
			gap: '0.5rem'
		},
		canvas: {
			borderRadius: '1.5rem',
			border: '4px solid rgba(255,255,255,0.3)',
			boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
			background: 'white'
		},
		playSection: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			padding: '2rem 1rem'
		},
		editSection: {
			padding: '2rem 1rem'
		}
	};

	// If in play mode, render only the canvas
	if (view === "play") {
		return (
			<div style={{
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: "100vw",
				height: "100vh",
				touchAction: "none",
				overflow: "hidden",
				background: "#000"
			}}>
				<canvas
					ref={canvasRef}
					style={{
						display: "block",
						width: "100%",
						height: "100%",
						touchAction: "none"
					}}
				/>
			</div>
		);
	}

	// For all other views, render the normal UI
	return (
		<div style={styles.container}>
			<div style={styles.backgroundOrb1} />
			<div style={styles.backgroundOrb2} />
			<div style={styles.content}>
				{view === "edit" ? (
					<CreateMatchingGame
						initialTitle={customGame?.title || ""}
						initialPairs={customGame?.items || []}
						initialTheme={customGame?.theme || "jungle"}
						onPreview={handlePreviewGame}
					/>
				) : (
					<>
						<header style={styles.header}>
							<h1 style={styles.mainTitle}>Fun Learning Games</h1>
							<p style={styles.subtitle}>
								Interactive educational games for learning and engagement
							</p>
						</header>
						<section>
							<h2 style={styles.sectionTitle}>Choose a Game</h2>
							<div style={styles.gameGrid}>
								{builtInGames.map((game) => (
									<GameCard
										key={game.id}
										game={game}
										onPlay={() => {
											setSelectedGame(game);
											setView("play");
										}}
										onEdit={() => handleCustomize(game)}
										styles={styles}
									/>
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