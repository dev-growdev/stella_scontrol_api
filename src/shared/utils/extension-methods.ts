declare global {
  interface String {
    removeSpecialCharacters(): string;
  }
}

String.prototype.removeSpecialCharacters = function (): string {
  return this.replace(/\W/g, '');
};

export {};
