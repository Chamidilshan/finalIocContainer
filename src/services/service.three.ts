import { Inject } from '../decorators/inject.decorator';
import { ServiceOne } from './service.one';
import { ServiceTwo } from './service.two';

@Inject()
export class ServiceThree {
    private index = 0;
   
  constructor(
     private serviceOne: ServiceOne
  ) {
    console.log('ServiceThree initialized');
  }

  public getMessage() {
    // console.log(this.serviceOne.printMessage);
    //this.index = this.index + 1;
    return 'Hello from ServiceThree! ' +  this.index;
  }
} 
