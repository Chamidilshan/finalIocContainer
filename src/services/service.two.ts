import { ParamTypes } from '../containers/testContainer';
import { CD, forwardRef, Inject, InjectDependency } from '../decorators/inject.decorator';
import { ServiceOne } from './service.one'; 
import { ServiceThree } from './service.three';

@Inject()
// @CD
// @ParamTypes(ServiceOne)
export class ServiceTwo {
  private index = 10;
  constructor(
    @InjectDependency(forwardRef(() => ServiceThree)) private serviceThree: ServiceThree
  ) {
    console.log('ServiceTwo initialized with ServiceOne ');
  }

  public callServiceThree() {
    return this.serviceThree.getMessage();
  }  

  public printMessage() { 
    this.index = this.index + 1;
    return 'Hello from ServiceTwo! ' + this.index;
  }
}
