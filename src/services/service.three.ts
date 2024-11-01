import { ParamTypes } from '../containers/testContainer';
import { CD, forwardRef, Inject, InjectDependency } from '../decorators/inject.decorator';
import { ServiceOne } from './service.one';
import { ServiceTwo } from './service.two';

@Inject()
// @ParamTypes(ServiceOne)
export class ServiceThree {
    private index = 0;
   
  constructor(
    @InjectDependency(forwardRef(() => ServiceTwo)) private serviceTwo: ServiceTwo
  ) {
    console.log('ServiceThree initialized with ServiceOne');
  }

  public getMessage() {
    this.index = this.index + 1;
    return 'Hello from ServiceThree! ' +  this.index;
  }

  public callServiceTwo() {
    return this.serviceTwo.printMessage();
  }
} 
