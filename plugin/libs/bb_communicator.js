define(['jquery'], function($) {
    var responseHandlers = {}; 

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    };

    function get(url, callback) {
      post({messageHandler: 'get', message: url}, callback);
    }

    function trigger(handler, obj, callback) {
      obj.messageHandler = handler;
      post(obj, callback);
    }
    
    function on(event, selector, callback) {
      post({messageHandler: 'on', event: event, selector: selector}, callback);
    }

    function action(name, callback) {
      post({messageHandler: 'action', name: name}, callback);
    }


    function element_is(elementRef, selector, callback) {
      post({messageHandler: 'element_is', elementRef: elementRef, selector: selector}, callback);
    }
    
    function post(obj, callback) {
      var msgId = uuidv4();
      responseHandlers[msgId] = callback;
      obj.messageId = msgId;
      window.parent.postMessage(obj, '*');
    }

    $(window).on("message", function(e) {
      responseHandlers[e.originalEvent.data.messageId](e.originalEvent.data.response);
    });

    return {
      get: get,
      on: on,
      element_is: element_is,
      action: action,
      trigger: trigger
    };  
});