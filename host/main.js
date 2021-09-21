var plugins = ["https://janhenrikejme.github.io/plugin/"];

var onCommunicatorLoaded = function (iframeCommunicatorServer) {
	console.log("-----");

  iframeCommunicatorServer.bind("on", (request, response) => {
    $(document).on(request.event, request.selector, function(ev) {
      response({"gutta": "er kule"});
    });
  });

  iframeCommunicatorServer.bind("rest.get", (request, response) => {
    $.get(request.url, response);
  });


  iframeCommunicatorServer.bind("hideElement", (request, response) => {
    $(request.selector).hide();
  });

  iframeCommunicatorServer.bind("showPanel", (request, response) => {
    var trayTemplate = "<div id=\"nav-tray-portal\" style=\"position: relative; z-index: 99;\"><span dir=\"ltr\" style=\"--fLzZc-smallWidth:28em;\"><span class=\"fLzZc_bGBk fLzZc_fSpQ fLzZc_doqw fLzZc_bxia eJkkQ_eOlt\" style=\"--fLzZc-smallWidth:28em;\"><div role=\"dialog\" aria-label=\"Admin tray\"><div class=\"fLzZc_caGd\"><div class=\"navigation-tray-container accounts-tray\"><span class=\"ejhDx_bGBk ejhDx_bQpq ejhDx_coHh\"><button cursor=\"pointer\" type=\"button\" tabindex=\"0\" class=\"fOyUs_bGBk fOyUs_fKyb fOyUs_cuDs fOyUs_cBHs fOyUs_eWbJ fOyUs_fmDy fOyUs_eeJl fOyUs_cBtr fOyUs_fuTR fOyUs_cnfU fQfxa_bGBk\" style=\"margin: 0px; padding: 0px; border-radius: 0.25rem; border-width: 0px; width: auto; cursor: pointer;\"><span class=\"fQfxa_caGd fQfxa_VCXp fQfxa_buuG fQfxa_EMjX fQfxa_bCUx fQfxa_bVmg fQfxa_bIHL\"><span direction=\"row\" wrap=\"no-wrap\" class=\"fOyUs_bGBk fOyUs_desw bDzpk_bGBk bDzpk_eRIA bDzpk_fZWR bDzpk_qOas\" style=\"width: 100%; height: 100%;\"><span class=\"fOyUs_bGBk dJCgj_bGBk\"><span class=\"fQfxa_eoCh\"><svg name=\"IconX\" viewBox=\"0 0 1920 1920\" rotate=\"0\" width=\"1em\" height=\"1em\" aria-hidden=\"true\" role=\"presentation\" focusable=\"false\" class=\"esvoZ_bGBk esvoZ_drOs esvoZ_eXrk cGqzL_bGBk\" style=\"width: 1em; height: 1em;\"><g role=\"presentation\"><path d=\"M797.319865 985.881673L344.771525 1438.43001 533.333333 1626.99182 985.881673 1174.44348 1438.43001 1626.99182 1626.99182 1438.43001 1174.44348 985.881673 1626.99182 533.333333 1438.43001 344.771525 985.881673 797.319865 533.333333 344.771525 344.771525 533.333333z\" fill-rule=\"nonzero\" stroke=\"none\" stroke-width=\"1\"></path></g></svg></span><span class=\"ergWt_bGBk\">Close</span></span></span></span></button></span><div class=\"tray-with-space-for-global-nav\"><div class=\"fOyUs_bGBk\" style=\"padding: 1.5rem;\"><h2 class=\"fOyUs_bGBk blnAQ_bGBk blnAQ_dnfM blnAQ_drOs\">" + request.title + "</h2><hr role=\"presentation\"><ul class=\"fOyUs_bGBk fOyUs_UeJS fClCc_bGBk fClCc_fLbg\" style=\"margin: 0.75rem 0px;\"><li class=\"fOyUs_bGBk jpyTq_bGBk jpyTq_ycrn jpyTq_bCcs\" style=\"padding: 0px; max-width: 100%;\">HERHERHER</li></ul></div></div></div></div></div></span></span></div>";
    $("body").append(trayTemplate);
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
