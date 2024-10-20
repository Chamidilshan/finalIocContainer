import 'reflect-metadata';
import { IoC } from '../containers/ioc.container';

export function Inject(): ClassDecorator {
  return (target: any) => {
    Reflect.defineMetadata('isInjectable', true, target);
    IoC.register(target);
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

