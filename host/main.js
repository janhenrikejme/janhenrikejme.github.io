var plugins = ["https://janhenrikejme.github.io/plugin/"];

var onCommunicatorLoaded = function (iframeCommunicatorServer) {
	console.log("-----");

  iframeCommunicatorServer.bind("on", (request, response) => {
    $(document).on(request.event, request.selector, function(ev) {
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
