import 'reflect-metadata';

const IMPLEMENTS_KEY = 'implements:interface';

export function Implements(interfaceName: string): ClassDecorator {
	return (target) => {
		Reflect.defineMetadata(IMPLEMENTS_KEY, interfaceName, target);
	};
}
