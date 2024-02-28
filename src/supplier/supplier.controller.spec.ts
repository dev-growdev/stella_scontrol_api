import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { truncatePrisma } from 'test/setup/truncate-database';

describe('SupplierController', () => {
  let app;
  const path = 'supplier';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const nestApp = module.createNestApplication();
    await nestApp.init();

    app = nestApp.getHttpServer();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await truncatePrisma();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });
});
