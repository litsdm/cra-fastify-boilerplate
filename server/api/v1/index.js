import dev from './dev';

const { APP_ENV } = process.env;

export default async fastify => {
  if (APP_ENV === 'development') fastify.register(dev, { prefix: '/dev' });
};
