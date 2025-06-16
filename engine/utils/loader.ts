export class Loader {
  static loadGameData(): any {
    return {
      template: 'matching',
      theme: 'jungle',
      items: [
        { left: 'Dog', right: 'Barks' },
        { left: 'Cat', right: 'Meows' }
      ]
    };
  }
}
