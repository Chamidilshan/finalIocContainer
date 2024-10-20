import { CD, Inject } from '../decorators/inject.decorator';
import { ServiceOne } from './service.one'; 
import { ServiceThree } from './service.three';

@Inject()
@CD
export class ServiceTwo {
  constructor(
    private serviceOne: ServiceOne
  ) {
    console.log('ServiceTwo initialized with ServiceOne ');
  }

  public callServiceOne() {
    return this.serviceOne.printMessage();
  }  

  public printMessage() {
    return 'Hello from ServiceTwo!';
  }
}
