import ping from './actions/dev/ping';

export default async fastify => {
  fastify.get('/ping', ping.options, ping.handler);
};
