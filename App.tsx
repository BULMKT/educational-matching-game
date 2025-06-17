import React, { useState, useRef, useEffect } from "react";
import CreateMatchingGame from "./CreateMatchingGame";

const builtInGames = [
	{
		id: "animal-sounds",
		title: "Animal Sounds",
		theme: "jungle",
		template: "matching",
		emoji: "🦁",
		icon: "🎵",
		description: "Match animals with their sounds",
		color: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
		bgPattern: "🌿🌱🍃",
		items: [
			{ left: "🐕 Dog", right: "🔊 Barks" },
			{ left: "🐱 Cat", right: "🔊 Meows" },
			{ left: "🐄 Cow", right: "🔊 Moos" },
			{ left: "🐑 Sheep", right: "🔊 Baahs" },
		],
	},
	{
		id: "predator-prey",
		title: "Predator & Prey",
		theme: "desert",
		template: "matching",
		emoji: "🦅",
		icon: "🏹",
		description: "Learn about food chains in nature",
		color: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
		bgPattern: "🌵🏜️☀️",
		items: [
			{ left: "🦁 Lion", right: "🦓 Zebra" },
			{ left: "🐺 Wolf", right: "🐰 Rabbit" },
			{ left: "🦅 Eagle", right: "🐭 Mouse" },
		],
	},
	{
		id: "colors-emotions",
		title: "Colors & Emotions",
		theme: "rainbow",
		template: "matching",
		emoji: "🌈",
		icon: "😊",
		description: "Connect colors with feelings",
		color: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)",
		bgPattern: "🎨✨💫",
		items: [
			{ left: "🔴 Red", right: "❤️ Love" },
			{ left: "💙 Blue", right: "😌 Calm" },
			{ left: "💛 Yellow", right: "😊 Happy" },
			{ left: "💚 Green", right: "🌱 Fresh" },
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
			
			// Set initial canvas size with device pixel ratio support
			const canvas = canvasRef.current;
			const dpr = window.devicePixelRatio || 1;
			const displayWidth = window.innerWidth;
			const displayHeight = window.innerHeight;
			
			// Set actual canvas size for crisp rendering
			canvas.width = displayWidth * dpr;
			canvas.height = displayHeight * dpr;
			canvas.style.width = displayWidth + 'px';
			canvas.style.height = displayHeight + 'px';

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
			// Remove minHeight constraint to allow natural content flow
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
			color: '#1f2937',
			position: 'relative',
			// Ensure content can scroll freely
			overflowY: 'auto',
			overflowX: 'hidden',
			// Ensure smooth scrolling on iOS
			WebkitOverflowScrolling: 'touch',
			// Prevent bounce scrolling
			overscrollBehavior: 'none',
			// Add adequate padding for mobile
			paddingBottom: '4rem'
		},
		backgroundOrb1: {
			position: 'absolute',
			top: '-15rem',
			right: '-15rem',
			width: '30rem',
			height: '30rem',
			background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
			borderRadius: '50%',
			animation: 'float 8s ease-in-out infinite',
			zIndex: 1
		},
		backgroundOrb2: {
			position: 'absolute',
			bottom: '-15rem',
			left: '-15rem',
			width: '35rem',
			height: '35rem',
			background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
			borderRadius: '50%',
			animation: 'float 10s ease-in-out infinite reverse',
			zIndex: 1
		},
		backgroundOrb3: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: '40rem',
			height: '40rem',
			background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, transparent 100%)',
			borderRadius: '50%',
			animation: 'float 12s ease-in-out infinite',
			zIndex: 1
		},
		sparkles: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='9' cy='9' r='1'/%3E%3Ccircle cx='49' cy='49' r='1'/%3E%3Ccircle cx='35' cy='5' r='1'/%3E%3Ccircle cx='15' cy='45' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
			animation: 'sparkle 20s linear infinite',
			zIndex: 1,
			pointerEvents: 'none'
		},
		content: {
			position: 'relative',
			zIndex: 10
		},
		header: {
			textAlign: 'center',
			padding: '4rem 1rem 2rem',
			position: 'relative'
		},
		mainTitle: {
			fontSize: 'clamp(3rem, 8vw, 6rem)',
			fontWeight: '900',
			marginBottom: '1rem',
			letterSpacing: '-0.02em',
			animation: 'titleGlow 3s ease-in-out infinite alternate',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			flexWrap: 'wrap'
		},
		titleText: {
			background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			backgroundClip: 'text',
			textShadow: '0 4px 8px rgba(0,0,0,0.3)'
		},
		subtitle: {
			fontSize: '1.25rem',
			color: 'rgba(255,255,255,0.9)',
			maxWidth: '32rem',
			margin: '0 auto 2rem',
			lineHeight: '1.6',
			fontWeight: '400'
		},
		headerStats: {
			display: 'flex',
			justifyContent: 'center',
			gap: '2rem',
			marginTop: '2rem',
			flexWrap: 'wrap'
		},
		stat: {
			background: 'rgba(255,255,255,0.15)',
			backdropFilter: 'blur(10px)',
			padding: '1rem 2rem',
			borderRadius: '1rem',
			border: '1px solid rgba(255,255,255,0.2)',
			color: 'white',
			textAlign: 'center'
		},
		statNumber: {
			fontSize: '2rem',
			fontWeight: '700',
			display: 'block'
		},
		statLabel: {
			fontSize: '0.875rem',
			opacity: 0.9
		},
		sectionTitle: {
			fontSize: '2.5rem',
			fontWeight: '800',
			textAlign: 'center',
			color: 'white',
			marginBottom: '3rem',
			textShadow: '0 4px 8px rgba(0,0,0,0.3)',
			position: 'relative'
		},
		gameGrid: {
			display: 'grid',
			gap: '2rem',
			gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
			maxWidth: '90rem',
			margin: '0 auto',
			// Much more bottom padding for mobile scrolling
			padding: '0 1rem 8rem'
		},
		gameCard: {
			background: 'rgba(255,255,255,0.95)',
			borderRadius: '2rem',
			padding: '2rem',
			boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
			border: '1px solid rgba(255,255,255,0.3)',
			backdropFilter: 'blur(10px)',
			transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
			cursor: 'pointer',
			position: 'relative',
			overflow: 'hidden'
		},
		gameCardHover: {
			transform: 'translateY(-12px) scale(1.03)',
			boxShadow: '0 40px 80px rgba(0,0,0,0.25)',
			background: 'rgba(255,255,255,0.98)'
		},
		cardPattern: {
			position: 'absolute',
			top: '1rem',
			right: '1rem',
			fontSize: '1.5rem',
			opacity: 0.1,
			pointerEvents: 'none',
			letterSpacing: '0.5rem'
		},
		gameIcon: {
			position: 'absolute',
			top: '1rem',
			left: '1rem',
			fontSize: '1.5rem',
			background: 'rgba(99, 102, 241, 0.1)',
			padding: '0.5rem',
			borderRadius: '0.75rem',
			border: '1px solid rgba(99, 102, 241, 0.2)'
		},
		gameEmoji: {
			fontSize: '4rem',
			marginBottom: '1rem',
			display: 'block',
			textAlign: 'center',
			filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
			animation: 'bounce 2s ease-in-out infinite'
		},
		gameTitle: {
			fontSize: '1.5rem',
			fontWeight: '700',
			color: '#1f2937',
			marginBottom: '0.5rem',
			textAlign: 'center'
		},
		gameDescription: {
			fontSize: '0.9rem',
			color: '#6b7280',
			textAlign: 'center',
			marginBottom: '1.5rem',
			fontStyle: 'italic'
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
			background: 'rgba(99, 102, 241, 0.08)',
			borderRadius: '1rem',
			fontSize: '0.9rem',
			border: '1px solid rgba(99, 102, 241, 0.15)',
			transition: 'all 0.3s ease'
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
			padding: '1rem 1.25rem',
			background: 'linear-gradient(135deg, #10b981, #059669)',
			color: 'white',
			border: 'none',
			borderRadius: '1rem',
			fontWeight: '600',
			fontSize: '0.95rem',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem',
			position: 'relative',
			overflow: 'hidden'
		},
		editButton: {
			flex: 1,
			padding: '1rem 1.25rem',
			background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
			color: 'white',
			border: 'none',
			borderRadius: '1rem',
			fontWeight: '600',
			fontSize: '0.95rem',
			cursor: 'pointer',
			transition: 'all 0.3s ease',
			boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			gap: '0.5rem',
			position: 'relative',
			overflow: 'hidden'
		},
		buttonShine: {
			position: 'absolute',
			top: 0,
			left: '-100%',
			width: '100%',
			height: '100%',
			background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
			transition: 'left 0.6s ease'
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

	// Add responsive mobile viewport handling
	useEffect(() => {
		// Handle viewport height changes on mobile (address bar show/hide)
		const setVH = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};
		
		setVH();
		window.addEventListener('resize', setVH);
		window.addEventListener('orientationchange', setVH);
		
		return () => {
			window.removeEventListener('resize', setVH);
			window.removeEventListener('orientationchange', setVH);
		};
	}, []);

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
			<div style={styles.backgroundOrb3} />
			<div style={styles.sparkles} />
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
							<h1 style={styles.mainTitle}>
								<span style={{fontSize: '4rem', marginRight: '1rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'}}>🎮</span>
								<span style={styles.titleText}>Fun Learning Games</span>
							</h1>
							<p style={styles.subtitle}>
								Interactive educational games for learning and engagement through play
							</p>
							<div style={styles.headerStats}>
								<div style={styles.stat}>
									<span style={styles.statNumber}>{builtInGames.length}</span>
									<span style={styles.statLabel}>Games</span>
								</div>
								<div style={styles.stat}>
									<span style={styles.statNumber}>∞</span>
									<span style={styles.statLabel}>Custom</span>
								</div>
								<div style={styles.stat}>
									<span style={styles.statNumber}>📱</span>
									<span style={styles.statLabel}>Touch Ready</span>
								</div>
							</div>
						</header>
						<section>
							<h2 style={styles.sectionTitle}>
								<span style={{fontSize: '2rem', marginRight: '0.5rem'}}>✨</span>
								<span>Choose Your Adventure</span>
							</h2>
							<div style={styles.gameGrid}>
								{builtInGames.map((game) => (
									<div key={game.id}>
										<GameCard
											game={game}
											onPlay={() => {
												setSelectedGame(game);
												setView("play");
											}}
											onEdit={() => handleCustomize(game)}
											styles={styles}
										/>
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
			<div style={styles.cardPattern}>
				{game.bgPattern}
			</div>
			<div style={styles.gameIcon}>
				{game.icon}
			</div>
			
			<div style={styles.gameEmoji}>
				{game.emoji}
			</div>
			
			<h3 style={styles.gameTitle}>
				{game.title}
			</h3>

			<p style={styles.gameDescription}>
				{game.description}
			</p>
			
			<div style={styles.pairsList}>
				{game.items.slice(0, 2).map((pair, i) => (
					<div 
						key={i} 
						style={{
							...styles.pairItem,
							...(isHovered ? {
								background: 'rgba(99, 102, 241, 0.12)',
								transform: 'translateX(4px)'
							} : {})
						}}
					>
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
						padding: '0.5rem',
						background: 'rgba(156, 163, 175, 0.1)',
						borderRadius: '0.5rem',
						margin: '0.5rem 0'
					}}>
						✨ +{game.items.length - 2} more pairs to discover!
					</div>
				)}
			</div>
			
			<div style={styles.buttonGroup}>
				<button
					style={styles.playButton}
					onClick={onPlay}
					onMouseEnter={(e) => {
						e.target.style.transform = 'translateY(-3px) scale(1.05)';
						e.target.style.boxShadow = '0 12px 30px rgba(16, 185, 129, 0.6)';
						const shine = e.target.querySelector('.shine');
						if (shine) shine.style.left = '100%';
					}}
					onMouseLeave={(e) => {
						e.target.style.transform = 'translateY(0) scale(1)';
						e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
						const shine = e.target.querySelector('.shine');
						if (shine) shine.style.left = '-100%';
					}}
				>
					<div className="shine" style={styles.buttonShine}></div>
					<span>🎯</span> Play Now
				</button>
				<button
					style={styles.editButton}
					onClick={onEdit}
					onMouseEnter={(e) => {
						e.target.style.transform = 'translateY(-3px) scale(1.05)';
						e.target.style.boxShadow = '0 12px 30px rgba(139, 92, 246, 0.6)';
						const shine = e.target.querySelector('.shine');
						if (shine) shine.style.left = '100%';
					}}
					onMouseLeave={(e) => {
						e.target.style.transform = 'translateY(0) scale(1)';
						e.target.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.4)';
						const shine = e.target.querySelector('.shine');
						if (shine) shine.style.left = '-100%';
					}}
				>
					<div className="shine" style={styles.buttonShine}></div>
					<span>⚡</span> Customize
				</button>
			</div>
		</div>
	);
};

export default App;