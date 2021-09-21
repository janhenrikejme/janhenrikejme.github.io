define(['jquery', 'iframe_communicator_client'], function ($, iframe_communicator_client) {

    function hideBottomBar() {
        iframe_communicator_client.invoke("hideElement", { selector: "#fixed_bottom" });
    }

    function addButton(title, buttonId, icon, eventHandler) {
        iframe_communicator_client.invoke("addButton", { 
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

    return {
        hideBottomBar: hideBottomBar,
        addButton: addButton,
        showPanel: showPanel,
        rest: {
            get: restGet
        }
    };
  
});
