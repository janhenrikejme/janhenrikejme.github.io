var plugins = ["https://janhenrikejme.github.io/plugin/"];

var onCommunicatorLoaded = function (iframeCommunicatorServer) {
	console.log("-----");

  iframeCommunicatorServer.bind("on", (request, response) => {
    $(document).on(request.event, request.selector, function(ev) {
      response({"gutta": "er kule"});
    });
  });



  iframeCommunicatorServer.bind("addButton", (request, response) => {
    var btnTemplate = "<li class=\"ic-app-header__menu-list-item\">\n" +
    "           <div id=\"dummybtn\" role=\"button\" class=\"ic-app-header__menu-list-link\" data-track-category=\"help system\" data-track-label=\"help button\">\n" +
    "              <div class=\"menu-item-icon-container\" role=\"presentation\">\n" +
    "                   " + request.icon + " \n" +
    "\n" +
    "                <span class=\"menu-item__badge\"></span>\n" +
    "              </div>\n" +
    "              <div class=\"menu-item__text\">\n" +
    "                " + request.title + "\n" +
    "              </div>\n" +
    "</div>          </li>";

    $("#menu").append(btnTemplate);

    $(document).on("click", "#dummybtn", function(ev) {
      response({"gutta": "er kule"});
    });
  });


  console.log("born to be alive!");


  // load plugins that cab use endpoints
  plugins.forEach(function(pluginPath) {
    console.log(pluginPath);
    $.get(pluginPath + "config.json", function(pluginConfig) {
      //var pluginConfig = JSON.parse(res);
      $("body").append("<iframe id='frm' src='" + pluginPath + pluginConfig.url + "'></iframe>");
      console.log(pluginConfig.url);      
    });
  });



};	


function loadScript(src, async) {
  var e2 = document.createElement('script');
  e2.src = src;
  e2.async = async;
  e2.type = 'text/javascript';

  var s2 = document.getElementsByTagName('script')[0];
  s2.parentNode.insertBefore(e2, s2);
}

loadScript("https://janhenrikejme.github.io/host/libs/iframe_communicator_server.js", false);	
