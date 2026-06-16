import { Test, TestingModule } from '@nestjs/testing';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { ConfigService } from '@nestjs/config';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  // 1. Mock the ConfigService since the Strategy depends on it
  const mockConfigService = {
    getOrThrow: jest.fn((key: string) => {
      if (key === 'JWT_SECRET' || key === 'JWT_REFRESH_SECRET') return 'test_refresh_secret';
      return null;
    }),
  };

  beforeEach(async () => {
    // 2. Set up the testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        // Override the real ConfigService with our mock
        { provide: ConfigService, useValue: mockConfigService }, 
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate and extract the refresh token from the Authorization header', async () => {
    // Arrange: Create fake inputs that passport-jwt normally provides
    const mockPayload = { sub: 'user-123', email: 'test@example.com', role: 'USER' };
    
    // The request object in Express/Nest has a .get() method for headers
    const mockReq = {
      get: jest.fn().mockReturnValue('Bearer fake-refresh-token-123'),
    };

    // Act: Call the validate method manually
    const result = await strategy.validate(mockReq, mockPayload);

    // Assert: Verify the logic behaved correctly
    expect(mockReq.get).toHaveBeenCalledWith('Authorization');
    expect(result).toEqual({
      userId: 'user-123',
      email: 'test@example.com',
      role: 'USER',
      refreshToken: 'fake-refresh-token-123',
    });
  });
});
