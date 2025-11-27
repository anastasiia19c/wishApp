import { Test, TestingModule } from '@nestjs/testing';
import { WishGateway } from './wish.gateway';

describe('WishGateway', () => {
  let gateway: WishGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishGateway],
    }).compile();

    gateway = module.get<WishGateway>(WishGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
