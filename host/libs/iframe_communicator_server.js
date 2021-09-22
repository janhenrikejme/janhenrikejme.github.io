function init() {    
  const handlers = {};

  window.addEventListener("message", (e) => {
      if (handlers[e.data.messageHandler] == undefined) return;

        console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
        console.log(e);

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






