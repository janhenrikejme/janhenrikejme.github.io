define(['jquery', 'iframe_communicator_client'], function ($, iframe_communicator_client) {

    function hideBottomBar() {
        iframe_communicator_client.invoke("hideElement", { selector: "#fixed_bottom" });
    }

    function addButton(title, buttonId, icon, eventHandler) {
        iframe_communicator_client.invoke("nav.addButton", { 
            title: title,
            icon: icon,
            buttonId: buttonId
         }, eventHandler);
    }
    
    function restGet(url, responseHandler) {
        iframe_communicator_client.invoke("rest.get", { url: url }, responseHandler);
    }

    function showPanel(title, content) {
        iframe_communicator_client.invoke("showPanel", { title: title, content: content });
    }

    function on(event, selector, responseHandler) {
        iframe_communicator_client.invoke("on", { event: event, selector: selector }, responseHandler);
    }

    return {
        hideBottomBar: hideBottomBar,
        showPanel: showPanel,
        on: on,
        nav: {
            addButton: addButton,
        },
        rest: {
            get: restGet
        }
    };
  
});
