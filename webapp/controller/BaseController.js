sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History"
], function (Controller, History) {
    "use strict";

    return Controller.extend("com.softteck.proyectoempresa.controller.BaseController", {
        /**
         * Obtiene el enrutador asociado al componente propietario del controlador
         * @returns {sap.ui.core.routing.Router} Enrutador
         */
        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        /**
         * Navega hacia atrás en el historial del navegador o a la pantalla de inicio
         */
        onBack: function () {
            var oHistory = History.getInstance();
            var oPrevHash = oHistory.getPreviousHash();
            if (oPrevHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("Main"); 
            }
        }
    });
});
