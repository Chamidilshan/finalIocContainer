export class MyService {
    private index = 0;
    constructor(private name: string) {}
    greet() {
        this.index = this.index + 1;
      return `Hello, ${this.name} ${this.index}`;
    }
  }