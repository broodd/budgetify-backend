import { User } from './user.decorator';

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

export function getParamDecoratorFactory(
  decorator: Function, // eslint-disable-line @typescript-eslint/ban-types
): (data: any, request: any) => any {
  class Test {
    public test(@decorator() value: string): string {
      return value;
    }
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return (data: any, request: any) =>
    args[Object.keys(args)[0]].factory(data, {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    });
}

export class MockReturnClassDecorator {
  public readonly id: number = 1;
}

describe('UserDecorator', () => {
  const user = new MockReturnClassDecorator();
  const decorator = getParamDecoratorFactory(User);

  it('should be defined', () => {
    expect(decorator).toBeDefined();
  });

  it('should be return mock user entity', () => {
    const received = decorator(null, { user });
    expect(received).toBeInstanceOf(MockReturnClassDecorator);
  });

  it('should be return field of mock user entity', () => {
    const received = decorator('id', { user });
    expect(received).toEqual(user.id);
  });
});
