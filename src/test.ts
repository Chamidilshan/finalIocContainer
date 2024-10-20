import 'reflect-metadata';

export class IoC {
  private static container = new Map<string, any>();  // Stores initialized services
  private static proxies = new Map<string, any>();    // Stores proxies for unresolved dependencies

  // Register class without instantiating it yet
  public static register<T>(target: { new (...args: any[]): T }): void {
    IoC.container.set(target.name, null);  // Initialize container entry as null
  }

  // Resolve class dependencies and instantiate the class
  public static resolve<T>(target: { new (...args: any[]): T }): T {
    const key = target.name;

    // Step 1: If the instance already exists, return it
    if (IoC.container.has(key) && IoC.container.get(key)) {
      return IoC.container.get(key);
    }

    // Step 2: If the proxy exists, return it (for circular dependencies)
    if (IoC.proxies.has(key)) {
      return IoC.proxies.get(key);
    }

    // Step 3: Create proxies for unresolved dependencies
    const proxy = new Proxy(
      {},
      {
        get: (_, prop) => {
          const realInstance = IoC.container.get(key);
          if (!realInstance) {
            throw new Error(`${key} is not yet fully initialized.`);
          }
          return (realInstance as any)[prop];
        },
      }
    );
    IoC.proxies.set(key, proxy);  // Store the proxy for later use

    // Step 4: Resolve dependencies (constructor injection)
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const dependencies = paramTypes.map((param: any) => {
      // This is where the dependent service (like ServiceB) is resolved and could potentially return a proxy
      return IoC.resolve(param);
    });

    // Step 5: Instantiate the class with the resolved dependencies
    const instance = new target(...dependencies);

    // Step 6: Store the fully initialized instance and remove it from proxies map
    IoC.container.set(key, instance);
    IoC.proxies.delete(key);

    return instance;
  }

  // Initialize and resolve all the registered services
  public static init(classes: { new (...args: any[]): any }[]): void {
    classes.forEach((cls) => IoC.resolve(cls));  // Resolve all registered classes
    console.log('IoC container initialized.');
  }
}

// Decorator to mark a class as injectable
function Injectable(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('isInjectable', true, target);
    IoC.register(target);  // Register the class in IoC container
  };
}

// Service A depends on Service B
@Injectable()
class ServiceA {
  constructor(private serviceB: ServiceB) {
    console.log('ServiceA initialized.');
  }

  public callServiceB() {
    return this.serviceB.doSomething();
  }
}

// Service B depends on Service A
@Injectable()
class ServiceB {
  constructor(private serviceA: ServiceA) {
    console.log('ServiceB initialized.');
  }

  public doSomething() {
    return 'ServiceB doing something';
  }
}

// Initialize the IoC container
const allServices = [ServiceA, ServiceB];
IoC.init(allServices);

// Access ServiceA instance and call a method
const serviceA = IoC.resolve(ServiceA);
console.log(serviceA.callServiceB());
