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
    "                  <svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ic-icon-svg menu-item__icon svg-icon-help\" version=\"1.1\" x=\"0\" y=\"0\" viewBox=\"0 0 200 200\" enable-background=\"new 0 0 200 200\" xml:space=\"preserve\" fill=\"currentColor\"><path d=\"M100,127.88A11.15,11.15,0,1,0,111.16,139,11.16,11.16,0,0,0,100,127.88Zm8.82-88.08a33.19,33.19,0,0,1,23.5,23.5,33.54,33.54,0,0,1-24,41.23,3.4,3.4,0,0,0-2.74,3.15v9.06H94.42v-9.06a14.57,14.57,0,0,1,11.13-14,22.43,22.43,0,0,0,13.66-10.27,22.73,22.73,0,0,0,2.31-17.37A21.92,21.92,0,0,0,106,50.59a22.67,22.67,0,0,0-19.68,3.88,22.18,22.18,0,0,0-8.65,17.64H66.54a33.25,33.25,0,0,1,13-26.47A33.72,33.72,0,0,1,108.82,39.8ZM100,5.2A94.8,94.8,0,1,0,194.8,100,94.91,94.91,0,0,0,100,5.2m0,178.45A83.65,83.65,0,1,1,183.65,100,83.73,83.73,0,0,1,100,183.65\" transform=\"translate(-5.2 -5.2)\"></path></svg>\n" +
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



/*
  communicator.registerHandler("get", function(data, respond) {
    respond({username: "testusers"});
  });

  communicator.registerHandler("showsidebar", function(data, respond) {
    $("body").append("<iframe id='helpfrm' src='" + data.sidebarurl + "'></iframe>");
    respond({status: "ok"});
  });

  communicator.registerHandler("element_is", function(data, respond) {
    respond({result: $('[data-element-ref="' + data.elementRef + '"]').is(data.selector)});
  });

  communicator.registerHandler("on", function(data, respond) {
    $(document).on(data.event, data.selector, function(ev) {
        respond(communicator.eventToObject(ev));
    });
  });


  $("#showhelp").click(function() {
    if(communicator.canHandleAction("showhelp")) {
      communicator.handleAction("showhelp");
    } else {
      alert("default handler");
    }
  });
*/
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
