sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, MessageBox, Fragment) {
        "use strict";
        var that;
        return BaseController.extend("com.softteck.proyectoempresa.controller.AdministradoresDetail", {

            onInit: function () {
                that = this;
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("AdministradoresDetail").attachPatternMatched(this._onPatternMatched, this);
            },


            _onPatternMatched: function (oEvent) {
                var sAdmin = oEvent.getParameter("arguments").IdAdmin;
                var oModel = this.getOwnerComponent().getModel();
                oModel.metadataLoaded().then(function () {
                    var that = this;
                    var sPath = `/AdminSet('${sAdmin}')`;
                    this.getView().bindElement({
                        path: sPath,
                        events: {
                            dataRequested: function () {
                                that.getView().setBusy(true);
                            },
                            dataReceived: function () {
                                that.getView().setBusy(false);
                            }
                        }
                    });
                }.bind(this));
            },


            /*****--------------------CRUD AREAS--------------------****/

            onCreateArea: function () {
                if (!this.oCreateFragment) {
                    this.oCreateFragment = Fragment.load({
                        name: "com.softteck.proyectoempresa.view.fragments.AddArea",
                        controller: this
                    }).then(function (oDialog) {
                        console.log(oDialog);
                        this.getView().addDependent(oDialog);
                        let oModel = new sap.ui.model.json.JSONModel({
                            "Nombre": "",
                            "Presupuesto": "",
                            "CantidadEmpleados": "", 
                            "DescripcionProyectos": ""
                        });
                        oModel.setDefaultBindingMode("TwoWay");
                        oDialog.setModel(oModel, "AddArea");
                        oDialog.attachAfterClose(that._afterCloseDialog);
                        return oDialog;
                    }.bind(this)).catch(function (error) {
                        MessageBox.error("Error al cargar el diálogo: " + error);
                    });
                }
                if (this.oCreateFragment) {
                    this.oCreateFragment.then(
                      function (oDialog) {
                        oDialog.open();
                      }.bind(that)
                    );
                  }
            },
            
            _afterCloseDialog: function (oEvent) {
                oEvent.getSource().destroy();
                that.oCreateFragment = null;
            },
         

            onCrearAreaPress: function (oEvent) {
                let oEntry = oEvent.getSource().getModel("AddArea").getData();
                oEntry.IdAdmin=this.getView().getBindingContext().getObject().IdAdmin;
                console.log(oEntry)
                var oDataModel = that.getView().getModel();
                console.log(oDataModel)
                oDataModel.create("/AreaSet", oEntry, {
                    success: function () {
                        MessageBox.success("Area creada correctamente");
                        that.getOwnerComponent().getModel().refresh(true, true);
                        that.onCerrarCrearAareaPress();

                    }.bind(this),
                    error: function () {
                        MessageBox.error("Se generó un error al intentar crear una nueva area");
                    }
                });

            }, 


            onCerrarCrearAreaPress: function () {
                if (this.oCreateFragment) {
                    this.oCreateFragment.then(function (oDialog) {
                        oDialog.close();
                    })}
            },

              onModificarArea: function (oEvent) {
            var oContext = oEvent.getSource().getBindingContext();
            var oArea = oContext.getObject();
    
            if (!this.oActualizarFragment) {
              this.oActualizarFragment = sap.ui.core.Fragment.load({
                name: "com.softteck.proyectoempresa.view.fragments.ActualizarArea",
                controller: that,
              }).then(
                function (oEntry) {
                  that.getView().addDependent(oEntry);
                  var oActualizarModelo = new sap.ui.model.json.JSONModel(oArea);
                  oEntry.setModel(oActualizarModelo, "ActualizarArea");
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
    
          onActualizarArea: function (oEvent) {
            var oEntry = oEvent
              .getSource()
              .getParent()
              .getModel("ActualizarArea")
              .getData();
              console.log(oEntry)
            var sIdAdmin = oEntry.IdAdmin;
            var sIdArea = oEntry.IdArea;
            var oDataModel = that.getView().getModel();
    
            oDataModel.update(`/AreaSet(IdArea='${sIdArea}',IdAdmin='${sIdAdmin}')`, oEntry, {
                
              success: function (oResponse) {
                sap.m.MessageBox.success(
               "Area actualizada satisfactoriamente"
                );
                that.getOwnerComponent().getModel().refresh(true, true);
                that.onCerrarActualizarArea();
              },
              error: function (oError) {
                sap.m.MessageBox.error(
                  "Error al actualizar Area"
                );
              },
            });
          },
    
          onCerrarActualizarArea: function () {
            this.oActualizarFragment.then(
              function (oEntry) {
                oEntry.close();
              }.bind(that)
            );
          },



        onEliminarArea: function(oEvent) {
            let sPath = oEvent.getSource().getBindingContext().getPath();
            var oDataModel = this.getOwnerComponent().getModel();
        
            MessageBox.confirm("¿Estás seguro de que quieres eliminar esta Area?", {
                title: "Confirmación",
                onClose: function(sAction) {
                    if (sAction === MessageBox.Action.OK) {
                       
                        oDataModel.remove(`${sPath}`, {
                            success: function() {
                                MessageBox.success("Area eliminada correctamente");
                                oDataModel.refresh(true, true);
                            },
                            error: function() {
                                MessageBox.error("Error");
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
                var sArea = oSelected.getBindingContext().getProperty("IdArea");
                
                var router = that.getOwnerComponent().getRouter();
                
                router.navTo("AdministradoresDetail", {
                    
                    IdArea: sArea
                    
                });
                

        },

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
