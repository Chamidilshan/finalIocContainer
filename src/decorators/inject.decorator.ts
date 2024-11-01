import 'reflect-metadata';
import { IoC } from '../containers/ioc.container';

export function Inject(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('isInjectable', true, target);
    IoC.register(target);
  };
}

export function InjectDependency(typeOrForwardRef: any): ParameterDecorator {
  return (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => {
    // We are checking if propertyKey is undefined, which means the decorator is applied to a constructor parameter.
    if (typeof propertyKey === 'undefined') {
      const existingDependencies = Reflect.getMetadata('design:paramtypes', target) || [];

      // If forwardRef is passed, resolve it now
      const dependency = typeOrForwardRef.forwardRefFn ? typeOrForwardRef.forwardRefFn() : typeOrForwardRef;

      // Assign the dependency to the correct index of the constructor parameters
      existingDependencies[parameterIndex] = dependency;
      Reflect.defineMetadata('design:paramtypes', existingDependencies, target);
    }
  };
}



export function CD(target: any) {
  Reflect.defineMetadata('isCircularDependency', true, target);
}

export interface OnModuleInit {
  onModuleInit?(): void; // Optional method for post-initialization
}

// Decorator for marking circular dependencies
export function CircularDepend(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('isCircularDepend', true, target);
    IoC.register(target);
  };
}

export function forwardRef(forwardRefFn: () => any) {
  return {
    forwardRefFn
  };
}




