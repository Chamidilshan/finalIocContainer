import { CD, Inject } from '../decorators/inject.decorator';
// import { CircularDepend } from '../test';
import { ServiceThree } from './service.three';
import { ServiceTwo } from './service.two';

@Inject() 
@CD
export class ServiceOne { 
  constructor(private serviceTwo: ServiceTwo) {
    console.log('ServiceOne initialized with ServiceTwo');
  }

  public init() {
    console.log(this.serviceTwo.callServiceOne());
  }

  public printMessage() {
    return 'Hello from ServiceOne!';
  }

  public callServiceTwo() {
    return this.serviceTwo.printMessage();
  }
}