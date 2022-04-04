import { instanceToPlain, plainToInstance } from 'class-transformer';

import { FindOneOptionsDto } from './find-one-options.dto';

describe('FindOneOptionsDto', () => {
  it('should be defined', () => {
    expect(new FindOneOptionsDto()).toBeDefined();
  });

  describe('select', () => {
    it('should be return array select fields', () => {
      const plain = { selection: ['id'] };
      const classDto = plainToInstance(FindOneOptionsDto, plain);
      const instanceDto = instanceToPlain(classDto);
      expect(instanceDto).toMatchObject(plain);
    });
  });
});
