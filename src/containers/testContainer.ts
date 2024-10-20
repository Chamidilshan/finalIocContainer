import 'reflect-metadata';

export class IoC {
  private static container = new Map<string, any>(); // Store instances of classes with unique keys
  private static inProgress = new Map<string, any>(); // Track instances that are in the process of being created
  private static proxies = new Map<string, any>(); // Store proxies for classes

  // Register a class in the IoC container
  public static register<T>(target: { new (...args: any[]): T }): void {
    const isInjectable = Reflect.getMetadata('isInjectable', target);
    if (isInjectable) {
      console.log(`Registering class: ${target.name}`);
      IoC.container.set(target.name, null); // Store the class name as key with a null instance initially
    }
  }

  // Method to resolve dependencies and create an instance with parameters
  public static resolve<T>(target: { new (...args: any[]): T }): T {
    const key = target.name;

    console.log(`Resolving dependencies for ${key}...`);

    // Check if an instance is already created or in-progress
    if (IoC.container.has(key)) {
      const existingInstance = IoC.container.get(key);
      if (existingInstance) {
        console.log(`Returning existing instance of: ${key}`);
        return existingInstance; // Return the existing instance if it exists
      }

      // If instance is being created, return a proxy to prevent circular dependency issues
      if (IoC.inProgress.has(key)) {
        console.log(`Returning proxy for in-progress: ${key}`);
        return IoC.inProgress.get(key); // Return the proxy if still in progress
      }
    }

    // Get the constructor parameter types (dependencies)
    const paramTypes = Reflect.getMetadata('design:paramtypes', target) || [];

    // First resolve dependencies and create proxies for them, without immediately resolving them
    const dependencies = paramTypes
      .filter((param: any) => param !== undefined) // Filter out undefined values
      .map((param: any) => {
        console.log(`${param.name} is a dependency for ${key}`);

        // Create a proxy for the dependency
        if (!IoC.container.has(param.name)) {
          console.log(`Creating proxy for dependency: ${param.name}`);
          const proxy = new Proxy(
            {},
            {
              get(_, propKey) {
                const realInstance = IoC.container.get(param.name);
                if (!realInstance) {
                  throw new Error(`Circular dependency detected: ${param.name} is not fully initialized yet.`);
                }
                console.log(`Proxy for ${param.name} is forwarding access to real instance property: ${String(propKey)}`);
                return (realInstance as any)[propKey];
              },
            }
          );
          IoC.inProgress.set(param.name, proxy); // Store the proxy for the dependency
          IoC.proxies.set(param.name, proxy); // Store the proxy separately for later updating
          console.log(`Proxy Created for ${param.name}`);
        }

        // Return the proxy without fully resolving the dependency yet
        return IoC.inProgress.get(param.name);
      });

    // Now, create the instance of the current class using the proxies
    console.log(`Creating new instance of: ${key} with proxies of dependencies.`);
    const newInstance = new target(...dependencies);
    IoC.container.set(key, newInstance); // Store the actual instance in the IoC container
    IoC.inProgress.delete(key); // Remove the proxy entry

    console.log(`${key} initialized and fully resolved.`);

    // After initializing the current class, update any proxies to point to the real instance
    if (IoC.proxies.has(key)) {
      console.log(`Updating proxy for ${key} to point to real instance`);
      IoC.proxies.set(key, newInstance); // Update the proxy to forward calls to the real instance
    }

    // After initializing the current class, resolve the dependencies fully
    dependencies.forEach((_dependency: any, index: string | number) => {
      const paramType = paramTypes[index];
      if (!IoC.container.get(paramType.name)) {
        console.log(`Resolving full instance for dependency: ${paramType.name} after initializing ${key}`);
        IoC.resolve(paramType); // Now fully resolve the dependency
      }
    });

    return newInstance;
  }

  // Automatically resolve and register all @Inject classes
  public static init(classes: { new (...args: any[]): any }[]): void {
    console.log('Starting IoC initialization...');
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
