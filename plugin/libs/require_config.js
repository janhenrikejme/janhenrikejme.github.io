requirejs.onError = function (err) {
  console.log(err.requireType);
  console.log('modules: ' + err.requireModules);
  throw err;
};

require.config({
 // urlArgs: "_=" + new Date().getTime(),
  baseUrl: './libs',
  paths: {
    'jquery': './jquery-3.3.1.min',
    'iframe_communicator_client': './iframe_communicator_client',
    'canvas_api': 'https://eesy.github.io/shared/plugins/v1/libs/canvas_api.js',
    'resources': './resources',
  }
});
