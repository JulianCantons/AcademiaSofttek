sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"
], function (Controller, MessageBox, Fragment) {
    "use strict";
    var that;
    return Controller.extend("com.softteck.proyectoempresa.controller.Administradores", {
        onInit: function () {
            
            that = this;
        },

        onCreateAdministrador: function () {

            if (!this.oCreateFragment) {
                this.oCreateFragment = Fragment.load({
                    name: "com.softteck.proyectoempresa.view.fragments.AddAdmin",
                    controller: this
                }).then(function (oDialog) {
                    that.getView().addDependent(oDialog);
                    let oModel = new sap.ui.model.json.JSONModel({
                        "Nombre": "",
                        "Apellido": "",
                        "Email": ""
                    });
                    oModel.setDefaultBindingMode("TwoWay");
                    oDialog.setModel(oModel, "AddAdmin");
                    return oDialog;
                }).catch(function (error) {
                    MessageBox.error("Error al cargar el diálogo: " + error);
                });
            }


            this.oCreateFragment.then(function (oDialog) {
                oDialog.open();
            }).catch(function (error) {
                MessageBox.error("Error al abrir el diálogo: " + error);
            });
        },


       onCrearAdminPress : function (oEvent) {
            let oEntry = oEvent.getSource().getModel("AddAdmin").getData();
            console.log(oEntry)
            var oDataModel = that.getView().getModel();
            console.log(oDataModel)
            oDataModel.create("/AdminSet", oEntry, {
                success: function () {
                    MessageBox.success("Se creó un administrador de manera correcta");
                    oDataModel.refresh(true, true);
                    that.onCerrarCrearAdminPress();

                }.bind(this),
                error: function () {
                    MessageBox.error("Se generó un error al intentar crear un nuevo administrador");
                }
            });

          
        },

        _afterCloseDialog: function (oEvent) {
            oEvent.getSource().destroy();
            that.oCreateFragment = null;
        },

        onCerrarCrearAdminPress: function () {
            if (this.oCreateFragment) {
                this.oCreateFragment.then(function (oDialog) {
                    oDialog.close();
                }).catch(function (error) {
                    MessageBox.error("Error al cerrar el diálogo: " + error);
                });
            } else {
                MessageBox.error("El fragmento no se ha cargado correctamente.");
            }
        },


        onModificarAdmin: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oAdmin = oContext.getObject();
    
            if (!this.oActualizarFragment) {
              this.oActualizarFragment = sap.ui.core.Fragment.load({
                name: "com.softteck.proyectoempresa.view.fragments.ActualizarAdmin",
                controller: that,
              }).then(
                function (oEntry) {
                  that.getView().addDependent(oEntry);
                  var oActualizarModelo = new sap.ui.model.json.JSONModel(oAdmin);
                  oEntry.setModel(oActualizarModelo, "ActualizarAdmin");
                  oEntry.attachAfterClose(that._afterCloseActualizarDialogo);
                  return oEntry;
                }.bind(that)
              );
            }
            if (this.oActualizarFragment) {
              this.oActualizarFragment.then(
                function (oEntry) {
                  oEntry.open();
                }.bind(that)
              );
            }
          },
    
          _afterCloseActualizarDialogo: function (oEvent) {
            oEvent.getSource().destroy();
            that.oActualizarFragment = null;
          },
    
          onActualizarAdmin: function (oEvent) {
            var oEntry = oEvent
              .getSource()
              .getParent()
              .getModel("ActualizarAdmin")
              .getData();
            var sIdAdmin = oEntry.IdAdmin;
            var oDataModel = this.getView().getModel();
    
            oDataModel.update(`/AdminSet('${sIdAdmin}')`, oEntry, {
              success: function (oResponse) {
                sap.m.MessageBox.success(
               "Administrador actualizado satisfactoriamente"
                );
                that.getOwnerComponent().getModel().refresh(true, true);
                that.onCerrarActualizarAdmin();
              },
              error: function (oError) {
                sap.m.MessageBox.error(
                  "Error al actualizar el Administrador"
                );
              },
            });
          },
    
          onCerrarActualizarAdmin: function () {
            this.oActualizarFragment.then(
              function (oEntry) {
                oEntry.close();
              }.bind(that)
            );
          },



        onEliminarAdmin: function(oEvent) {
            let sPath = oEvent.getSource().getBindingContext().getPath();
            
            var oDataModel = this.getOwnerComponent().getModel();
            console.log(oDataModel)
            MessageBox.confirm("¿Estás seguro de que quieres eliminar este administrador?", {
                title: "Confirmación",
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                       
                        oDataModel.remove(`${sPath}`, {
                            success: function() {
                                MessageBox.success("Se eliminó correctamente el administrador");
                                oDataModel.refresh(true, true);
                            },
                            error: function() {
                                MessageBox.error("Error al eliminar el administrador");
                            }
                        });
                    } else {
                        
                    }
                }
            });
        },
        
        onSelectionChange: function (oEvent) {
                let oTable = oEvent.getSource();
                var oSelected = oTable.getSelectedItem();
                var sAdmin = oSelected.getBindingContext().getProperty("IdAdmin");
                
                var router = that.getOwnerComponent().getRouter();
                
                router.navTo("AdministradoresDetail", {
                    
                    IdAdmin: sAdmin
                    
                });
            
        },

/* 
         onVistaPrueba: function(oEvent) {
            console.log(oEvent);
            var router = this.getOwnerComponent().getRouter();
            router.navTo("VistaPrueba");
        },
         */

         

        onSearch: function (oEvent) {
            var aFilters = [],
            sNombre,
            sApellido                
            ;
            var aSelectionSet = oEvent.getParameter("selectionSet");
            aSelectionSet.forEach(x => {
                switch(x.getName()){
                    case "Nombre":
                        sNombre = x.getValue();     
                        break;
                    case "Apellido":
                        sApellido = x.getValue();
                        break;
                    default:
                }
            });
            if (sNombre) {
                let oFilterNombre = new sap.ui.model.Filter({
                    path: 'Nombre',
                    operator: 'EQ',
                    value1: sNombre
                });
                aFilters.push(oFilterNombre);
            }
            if (sApellido) {
                let oFilterApellido = new sap.ui.model.Filter({
                    path: 'Apellido',
                    operator: 'EQ',
                    value1: sApellido
                });
                aFilters.push(oFilterApellido);
            }

            this.getView().byId("adminTable").getBinding("items").filter(aFilters);

        },
    });
});
