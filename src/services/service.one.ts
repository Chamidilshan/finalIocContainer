import { ParamTypes } from '../containers/testContainer';
import { CD, forwardRef, Inject, InjectDependency } from '../decorators/inject.decorator';
// import { CircularDepend } from '../test';
import { ServiceThree } from './service.three';
import { ServiceTwo } from './service.two';

@Inject() 
// @ParamTypes(ServiceTwo)
export class ServiceOne { 
  constructor(
    @InjectDependency(forwardRef(() => ServiceTwo)) private serviceTwo: ServiceTwo
  ) {
    console.log('ServiceOne initialized with ServiceTwo');
  }

  public printMessage() {
    return 'Hello from ServiceOne!';
  }

  public callServiceTwo() {
    return this.serviceTwo.printMessage();
  }
}