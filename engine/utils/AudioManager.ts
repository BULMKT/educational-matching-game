export class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private current: HTMLAudioElement | null = null;

  constructor() {
    this.sounds['dog'] = new Audio('dog.mp3');
    this.sounds['cat'] = new Audio('cat.mp3');
    this.sounds['correct'] = new Audio('correct.mp3');
    this.sounds['win'] = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e4b3e.mp3');
    // Preload all sounds for iOS compatibility
    Object.values(this.sounds).forEach(audio => {
      audio.load();
    });
  }

  stopAll() {
    Object.values(this.sounds).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.current = null;
  }

  play(name: string, onEnded?: () => void) {
    this.stopAll();
    const sound = this.sounds[name];
    if (sound) {
      this.current = sound;
      sound.currentTime = 0;
      if (onEnded) {
        sound.onended = () => {
          sound.onended = null;
          onEnded();
        };
      } else {
        sound.onended = null;
      }
      sound.play();
    }
  }

  isPlaying() {
    return this.current && !this.current.paused;
  }

  unlockAll() {
    // For iOS: call this on first user interaction to unlock audio
    Object.values(this.sounds).forEach(audio => {
      audio.play().catch(() => {});
      audio.pause();
      audio.currentTime = 0;
    });
  }
}
