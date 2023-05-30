const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
    // Untuk mengatasi masalah cors
    routes: {
      cors: {
        origin: ['*'], // Izinkan semua origin yang lain untuk mangakses data dari server
      },
    },
  });

  // gunakan route config
  server.route(routes);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
