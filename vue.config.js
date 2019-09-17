module.exports = {
  devServer: {
    proxy: {
      '/api': {
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        target: 'http://smartsapp.homologacao.uds.com.br/',
      },
      '/Arquivos': {
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        target: 'http://smartsapp.homologacao.uds.com.br/',
      },
      '/arquivos': {
        secure: false,
        changeOrigin: true,
        logLevel: 'debug',
        target: 'http://smartsapp.homologacao.uds.com.br/',
      },
    },
  },
};
