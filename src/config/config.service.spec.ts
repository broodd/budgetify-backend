import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';
import { ConfigMode } from './interfaces/config.interface';

const NODE_ENV = process.env.NODE_ENV;
const MOCK_ENV = {
  MOCK_BOOLEAN: 'false',
  MOCK_NUMBER: '123456',
  MOCK_STRING: 'string',
  MOCK_DEST: '/test/dest/',
};

describe('ConfigService - init', () => {
  let service: ConfigService;

  beforeAll(async () => {
    process.env = {
      ...process.env,
      ...MOCK_ENV,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  afterAll(() => {
    process.env.NODE_ENV = NODE_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be error', () => {
    process.env.NODE_ENV = 'BROKEN';
    try {
      new ConfigService();
    } catch (e) {
      expect(e.code).toEqual('ENOENT');
    }
  });
});

describe('ConfigService - Methods', () => {
  let service: ConfigService;

  beforeAll(async () => {
    process.env = {
      ...process.env,
      ...MOCK_ENV,
    };

    if (!process.env.PWD) {
      process.env.PWD = process.cwd();
      process.env.MOCK_DEST = MOCK_ENV.MOCK_DEST.replace(/\//g, '\\');
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  describe('getDest', () => {
    it('should be return destination', () => {
      const dest = `${process.env['PWD']}${process.env['MOCK_DEST']}`;
      expect(service.getDest('MOCK_DEST')).toBe(dest);
    });

    it('should be return type error', () => {
      expect(() => service.getDest('MOCK_TYPEERROR')).toThrow(TypeError);
    });
  });

  describe('getMode', () => {
    it('should be return boolean value', () => {
      expect(service.getMode(ConfigMode.test)).toBe(true);
    });
  });

  describe('get', () => {
    it('should be return boolean value', () => {
      expect(service.get('MOCK_BOOLEAN')).toBe(false);
    });

    it('should be return number value', () => {
      expect(service.get('MOCK_NUMBER')).toBe(123456);
    });

    it('should be return string value', () => {
      expect(service.get('MOCK_STRING')).toBe('string');
    });

    it('should be return type error', () => {
      expect(() => service.get('MOCK_TYPE_ERROR')).toThrow(TypeError);
    });
  });
});
