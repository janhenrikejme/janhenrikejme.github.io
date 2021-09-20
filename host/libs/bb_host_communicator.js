function tst() {    
var responseHandlers = {}; 
    var handlers = { actions: {} };

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    };

    function elementToObject(element) {
      var result = {
        functionResult: {
            text: $(element).text().trim().replace(/\s+/g, ' ')
        }
      };

      $.each(element.attributes, function() {
        if (this.specified) {
            result[this.name] = this.value;
            console.log(this.name, this.value);
        }
      });

      return result;
    }

    window.addEventListener("message", function(e) {
      if(e.data.messageHandler == "action") {
        handlers.actions[e.data.name] = function() {
          frm.contentWindow.postMessage({ messageId: e.data.messageId }, '*');  
        }
        return;
      }


      if(handlers[e.data.messageHandler] == undefined)
        return;

        handlers[e.data.messageHandler](e.data, function (response) {
          frm.contentWindow.postMessage({ messageId: e.data.messageId, response: response }, '*');  
        });
    }, false);


    function registerHandler(handlerKey, handler) {
      handlers[handlerKey] = handler;
    }

    function elementRef(element) {
      if($(element).data("element-ref") == undefined) 
        $(element).attr("data-element-ref", uuidv4());

      return $(element).data("element-ref");
    }

    function eventToObject(event) {
      return { event: event.type, 
               target: {
                 reference: elementRef(event.target),
                 element: elementToObject(event.target)
               }
             }
    }

    function canHandleAction(name) {
      return handlers.actions[name] !== undefined;
    }

    function handleAction(name) {
      handlers.actions[name]();
    }

    return {
      registerHandler: registerHandler,
      uuidv4: uuidv4,
      elementToObject: elementToObject,
      eventToObject: eventToObject,
      elementRef: elementRef,
      canHandleAction: canHandleAction,
      handleAction: handleAction
    };  
}

tst();
window.vvv = tst();




