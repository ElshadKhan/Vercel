export const jwtConstants = {
  secret: process.env.ACCESS_JWT_SECRET || 'staging secret',
  refreshSecret: process.env.REFRESH_JWT_SECRET || 'staging secret',
};

export const basicConstants = {
  userName: process.env.SA_BASIC_USERNAME || 'sa',
  password: process.env.SA_BASIC_PASSWORD || '123',
};
