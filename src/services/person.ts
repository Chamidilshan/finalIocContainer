import { Inject } from "../decorators/inject.decorator";

@Inject()
export class UserService {
  constructor(public name: string) { 
    console.log(`UserService initialized for ${name}`);
  }

  public getName() {
    return this.name;
  }
} 
 