import { Inject } from '../decorators/inject.decorator';
import { ServiceTwo } from './service.two';
import { ServiceThree } from './service.three';

@Inject()
export class ServiceFour {
  constructor(
    private serviceTwo: ServiceTwo,
    private serviceThree: ServiceThree
  ) {
    console.log('ServiceFour initialized with ServiceTwo and ServiceThree');
  }

  public execute() {
    return `${this.serviceTwo.callServiceOne()} and ${this.serviceThree.getMessage()}`;
  }
}
