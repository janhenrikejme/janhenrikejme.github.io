define(['jquery', 'iframe_communicator_client'], function ($, iframe_communicator_client) {

    function hideBottomBar() {
        iframe_communicator_client.invoke("hideElement", { selector: "#fixed_bottom" });
    }

    function addButton(title, icon, eventHandler) {
        iframe_communicator_client.invoke("addButton", { 
            title: title,
            icon: icon
         }, eventHandler);
    }
    

    return {
        hideBottomBar: hideBottomBar,
        addButton: addButton
    };
  
});
