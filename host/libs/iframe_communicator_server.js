function init() {    
  const handlers = {};

  window.addEventListener("message", (e) => {
      if (handlers[e.data.messageHandler] == undefined) return;

        console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-2");
        console.log(e.source);
        console.log($(e.sourceElement));

        var iframes = document.getElementsByTagName('IFRAME');
        for (var i = 0, iframe, win; i < iframes.length; i++) {
          iframe = iframes[i];
      
          // Cross-browser way to get iframe's window object
          win = iframe.contentWindow || iframe.contentDocument.defaultView;
      
          // Comparison
          console.log(iframe.src +
            (win === event.source ? ' MATCHES.\n' : ' is not our IFrame.\n'))
        }



      handlers[e.data.messageHandler](e.data, (response) => {
          if (e.source && !(e.source instanceof MessagePort) && !(e.source instanceof ServiceWorker)) {
              e.source.postMessage({ messageId: e.data.messageId, response: response }, "*");
          }
      });
  }, false);

  return {
      bind: (handlerKey, handler) => {
          handlers[handlerKey] = handler;
      }
  };
}

onCommunicatorLoaded(init());
console.log("loaded");






