sap.ui.define([
    "com/softteck/proyectoempresa/controller/BaseController", 
    "sap/ui/core/UIComponent"
], function (BaseController, UIComponent) {
    "use strict";

    return BaseController.extend("com.softteck.proyectoempresa.controller.Main", {
        onInit: function() {
            
        },

        onMenuItemPress: function(oEvent) {
            var sKey = oEvent.getParameter("key");
            this.getRouter().navTo(sKey);
        }
        
       
    });
});
