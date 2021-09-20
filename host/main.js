(function() {
  	function loadScript(src, async) {
      var e2 = document.createElement('script');
      e2.src = src;
      e2.async = async;
      e2.type = 'text/javascript';

      var s2 = document.getElementsByTagName('script')[0];
      s2.parentNode.insertBefore(e2, s2);
	}
  loadScript("https://janhenrikejme.github.io/host/libs/require.js");
  console.log("born to be alive!");
} ());
