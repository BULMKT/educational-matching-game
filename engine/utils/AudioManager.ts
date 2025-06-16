export class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};

  constructor() {
    this.sounds['dog'] = new Audio('dog.mp3');
    this.sounds['cat'] = new Audio('cat.mp3');
    this.sounds['correct'] = new Audio('correct.mp3');
    this.sounds['win'] = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_115b9e4b3e.mp3');
  }

  play(name: string) {
    const sound = this.sounds[name];
    if (sound) {
      sound.currentTime = 0;
      sound.play();
    } else if (this.sounds['correct']) {
      this.sounds['correct'].currentTime = 0;
      this.sounds['correct'].play();
    }
  }
}
