// import { IoC } from './containers/ioc.container';
import { IoC } from './containers/testContainer';
import { ServiceOne } from './services/service.one';
import { ServiceTwo } from './services/service.two';
// import { ServiceThree } from './services/service.three';
import { ServiceFour } from './services/service.four';
import { UserService } from './services/person';
import { MyService } from './services/service';
import { ServiceThree } from './services/service.three';
// import { ServiceFive } from './services/service.five';

function main() {
  const allServices = [
    ServiceOne, 
    ServiceTwo, 
    // ServiceThree
  ];

  console.log('Starting IoC initialization');

  // Initialize the IoC container with services
  IoC.init(allServices);

//   console.log(Reflect.getMetadata('design:paramtypes', UserService)); 

// const userTest = new UserService('Alice  Test');
// console.log(userTest.getName());  


//   // Fetch the UserService instance


//   const user1 = IoC.resolve(UserService, 'Alice'); // Create instance for Alice
//   console.log(user1.getName()); // Output: Alice

//   const user2 = IoC.resolve(UserService, 'Bob'); // Create instance for Bob
//   console.log(user2.getName()); // Output: Bob
  

    // const serviceTwo = IoC.resolve(ServiceTwo);
//   if (serviceTwo) {
//     console.log(serviceTwo.callServiceOne());
//   }


const serviceOne = IoC.resolve(ServiceOne);	
// console.log(serviceOne.printMessage());
console.log(serviceOne.callServiceTwo());
// serviceOne.init(); 

// const serviceTwo = IoC.resolve(ServiceTwo);
// console.log(serviceTwo.printMessage());

// console.log(serviceOne.printMessage());

// const serviceThree = new ServiceThree();

// const serviceTest = new ServiceOne(serviceThree);
// console.log(serviceTest.printMessage());

// const serviceOneSecond = IoC.resolve(ServiceOne);
// console.log(serviceOneSecond.printMessage());
// console.log(serviceOneSecond.printMessage());

// const serviceThree = IoC.resolve(ServiceThree);
// console.log(serviceThree.getMessage());


//   Fetch ServiceFour which has nested dependencies
//   const serviceFour = IoC.resolve(ServiceFour);
//   if (serviceFour) { 
//     console.log(serviceFour.execute());
//   }

// const instance = IoC.resolve(MyService, "Alice");
// console.log(instance.greet());
// console.log(instance.greet());
// console.log(instance.greet());

// const intanceTwo = IoC.resolve(MyService, "Alice");
// console.log(intanceTwo.greet());
// console.log(intanceTwo.greet());
// console.log(intanceTwo.greet());


// const intanceThree = IoC.resolve(MyService, "Bob");
// console.log(intanceThree.greet());
// console.log(intanceThree.greet());
// console.log(intanceThree.greet());
//   // Attempt to resolve ServiceFive which should not be processed (and should not throw an error)
//   const serviceFive = IoC.resolve(ServiceFive);
//   if (serviceFive) {
//     console.log(serviceFive.getMessage());
//   }
}

main();
