(function() {
  function loadScript(src, async) {
      var e2 = document.createElement('script');
      e2.src = src;
      e2.async = async;
      e2.type = 'text/javascript';

      var s2 = document.getElementsByTagName('script')[0];
      s2.parentNode.insertBefore(e2, s2);
  }
	
	
var tst = require(["https://janhenrikejme.github.io/host/libs/bb_host_communicator"]);
	console.log(tst);
 /* loadScript("https://janhenrikejme.github.io/host/libs/require.js", false);
  loadScript("https://janhenrikejme.github.io/host/libs/require_config.js", false);	*/
  require(['bb_host_communicator'], function(communicator) {			
	  console.log("jauda");
            $("#main").html("running");
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

              $("#launchtool").click(function() {
                $("body").append("<iframe id='frm' src='frame.html'></iframe>");
              });

              $("#showhelp").click(function() {
                if(communicator.canHandleAction("showhelp")) {
                  communicator.handleAction("showhelp");
                } else {
                  alert("default handler");
                }
              });

  });	
	
	
  console.log("born to be alive!");
} ());
