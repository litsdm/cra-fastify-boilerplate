import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import Fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import helmet from 'fastify-helmet';

import initialize from './initialize';
import api from './api/v1';

const fastify = Fastify({ logger: false });

const PORT = process.env.PORT || 8080;

initialize(() => {
  (async () => {
    try {
      fastify.register(helmet, {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'"],
            frameSrc: ["'self'"],
            childSrc: ["'self'"],
            scriptSrc: ["'self'", "'*'"],
            scriptSrcElem: ["'self'", "'*'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
            imgSrc: ["'self'"],
            baseUri: ["'self'"]
          }
        }
      });

      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
        const root = path.join(__dirname, 'build');
        fastify.register(fastifyStatic, {
          root,
          wildcard: false,
          redirect: false
        });
        fastify.get('/*', (req, res) => {
          res
            .type('text/html')
            .send(
              fs.createReadStream(path.join(__dirname, 'build', 'index.html'))
            );
        });
      }

      fastify.register(api, { prefix: '/api' });

      await fastify.listen(PORT, '0.0.0.0');
      console.log(`📡 Listening on port ${PORT} 🚀`);
    } catch (exception) {
      fastify.log.error(exception);
      process.exit(1);
    }
  })();
});

/**
 * directives: {
      defaultSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'self'"],
      childSrc: ["'self'"],
      scriptSrc: ["'self'", "'*'"],
      scriptSrcElem: ["'self'", "'*'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'"],
      imgSrc: ["'self'"],
      baseUri: ["'self'"]
    }
 */
