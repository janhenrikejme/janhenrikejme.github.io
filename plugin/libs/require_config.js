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
    'bb_communicator': './bb_communicator',
    'bb_host_communicator': './bb_host_communicator'
  }
});