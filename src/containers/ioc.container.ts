import 'reflect-metadata';

export class IoC {
  private static container = new Map<string, any>(); // Store instances of classes with unique keys
  private static proxies = new Map<string, any>(); // Store proxies for circular dependencies

  // Register a class in the IoC container only if it has @Inject decorator
  public static register<T>(target: { new (...args: any[]): T }): void {
    const isInjectable = Reflect.getMetadata('isInjectable', target);
    if (isInjectable) {
      IoC.container.set(target.name, null); // Store the class name as key with a null instance initially
    }
  }
 
  // Create a proxy object to handle circular dependencies
  private static createProxy<T>(target: { new (...args: any[]): T }): T {
    console.log(`Creating proxy for class: ${target.name}`);

    // Create a proxy for the class instance
    const proxy = new Proxy(target, {

      construct(target, args) {
        const actualInstance = IoC.container.get(target.name);
        console.log('Proxy construct', target.name, args);
        console.log('Actual instance inside construct', actualInstance);

        if (!actualInstance) {
            throw new Error(`Circular dependency detected for ${target.name}`);
        }

        return actualInstance; // Return the actual instance
    },

        get(_, property) {
            const actualInstance = IoC.container.get(target.name);
            console.log('Proxy ', target.name, property);
            console.log('Actual instance', actualInstance);

            if (!actualInstance) {
                throw new Error(`Circular dependency detected for ${target.name}`);
            }

            // If the property is a function, bind it to the actual instance
            const value = actualInstance[property];
            console.log('Value', value);
            console.log('Type of value', typeof value);
            console.log('Property', property);

            if (typeof value === 'function') {
              console.log('Binding function to actual instance');
              console.log('Actual instance', actualInstance);
              console.log('Value', value.bind(actualInstance));
                // Bind the method to the actual instance
                return value.bind(actualInstance);
            }

            console.log(`Accessed property ${String(property)}:`, value);
            return value; // Return the value directly
        },
    }) as T;

    // Immediately instantiate the target class to ensure it holds the proper structure
    const instance = new target();
    IoC.container.set(target.name, instance); // Store the actual instance

    console.log(`Proxy created for class: ${target.name}`);
    console.log('Created proxy:', proxy); // Log the created proxy
    return proxy;
}


  // Method to resolve dependencies and create an instance with parameters
  public static resolve<T>(target: { new (...args: any[]): T }): T {
    const key = target.name;

    console.log('Resolving', key);
    
    // Check if the class is already in the proxies
    if (IoC.proxies.has(key)) {
        console.log('Using existing proxy for', key);
        console.log('Proxy get', IoC.proxies.get(key));
        return IoC.proxies.get(key);
    }

    // Check if the class is already in the container
    if (IoC.container.has(key)) {
        const existingInstance = IoC.container.get(key);
        if (existingInstance) {
            return existingInstance; // Return the existing instance if it exists
        }
    }

    // Resolve the dependencies of the class
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];
    const dependencies = paramTypes
        .filter((param: any) => param !== undefined)
        .map((param: any) => {
            // Before resolving a dependency, check for circular dependencies
            const isCircularDependency = Reflect.getMetadata('isCircularDependency', param);
            if (isCircularDependency) {
                // Create a proxy for circular dependency detection
                const proxy = IoC.createProxy(param);
                IoC.proxies.set(param.name, proxy); // Store the proxy temporarily
                console.log('Proxy created for ', param.name , ' of ', target.name);
                console.log('Proxy is', proxy);
                return proxy; // Return the proxy instead of resolving the dependency
            }
            return IoC.resolve(param); // Resolve dependencies recursively
        });

    // Create the new instance with resolved dependencies
    const newInstance = new target(...dependencies);
    IoC.container.set(key, newInstance); // Store the actual instance
    if (IoC.proxies.has(key)) {
        IoC.proxies.delete(key); // Remove the proxy now that the instance is resolved
        console.log('Proxy deleted for', key);
    }

    return newInstance;
}


  // Automatically resolve and register all @Inject classes
  public static init(classes: { new (...args: any[]): any }[]): void {
    classes.forEach((cls) => {
      const isInjectable = Reflect.getMetadata('isInjectable', cls);
      if (isInjectable) {
        IoC.resolve(cls); // Resolve all @Inject classes
      } else {
        console.log(`Skipping ${cls.name}, as it doesn't use @Inject.`);
      }
    });
    console.log('IoC initialized: All dependencies resolved.');
  }
}