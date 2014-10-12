var formShowWinsearchRoute;
var winShowWinsearchRoute;
var cbxShowWinsearchRoute;
var empresa = 1;
var tipo = '';
Ext.onReady(function() {

    cbxShowWinsearchRoute = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Rutas',
        name: 'id_Ruta',
        store: storeRutas,
        valueField: 'id',
        displayField: 'text',
        forceSelection: true,
        queryMode: 'local',
        emptyText: 'Seleccionar Ruta...',
        allowBlank: false,
    });

    formShowWinsearchRoute = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Datos</b>',
                items: [
                    {
                        xtype: 'radiogroup',
//                        fieldLabel: '         ',
                        // Arrange radio buttons into two columns, distributed vertically
                        columns: 2,
                        horizonta: true,
                        items: [
                            {boxLabel: 'Baja de la UTPL ', name: 'rb', inputValue: '1', checked: true},
                            {boxLabel: 'Sube a la UTPL', name: 'rb', inputValue: '2'},
                            {boxLabel: 'Sube y baja de la UTPL', name: 'rb', inputValue: '3'}
                        ],
                        listeners: {
                            change: function(field, newValue, oldValue) {
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        cbxShowWinsearchRoute.enable();
                                        tipo = 'R';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });

                                        break;
                                    case 2:
                                        cbxShowWinsearchRoute.enable();
                                        tipo = 'B';

                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                    case 3:
                                        cbxShowWinsearchRoute.enable();
                                        tipo = 'BR';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                }

                            }
                        }
                    },
                    cbxShowWinsearchRoute
                ]
            }], buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    id_Ruta = cbxShowWinsearchRoute.getValue();
                    console.log(id_Ruta);
                    var form = formShowWinsearchRoute.getForm();
                    if (form.isValid()) {
                        form.submit({
                            url: 'php/getCordenadas.php',
                            waitTitle: 'Procesando...',
                            waitMsg: 'Obteniendo Información',
                            params: {
                                id_Ruta: id_Ruta
                            },
                            success: function(form, action) {
                                calcRoute(action.result.data);

                                form.submit({
                                    url: 'php/getParadasRutas.php',
                                    method: 'POST',
                                    params: {
                                        tipo: tipo,
                                        id_ruta: id_Ruta
                                    },
                                    success: function(form, action) {
//                                        console.log(action.result.data);
                                        paradasRutas(action.result.data);
                                    },
                                    failure: function(form, action) {


                                    }
                                });
                                winShowWinsearchRoute.hide();

                            },
                            failure: function(form, action) {


                            }
                        });






                    }
                }

            }, {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    winShowWinsearchRoute.hide();
                }
            }]

    })
});
function showWinsearchRoute() {
    if (!winShowWinsearchRoute) {
        winShowWinsearchRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Buscar Rutas',
            iconCls: 'icon-company',
            resizable: false,
            width: 450,
            height: 200,
            closeAction: 'hide',
            plain: false,
            items: formShowWinsearchRoute
        });
    }
    formShowWinsearchRoute.getForm().reset();
    cbxShowWinsearchRoute.disable();
    winShowWinsearchRoute.show();
}
function caragarParadas() {

    Ext.Ajax.request({
        url: 'php/getParadasRutas.php',
        method: 'POST',
        params: {
            tipo: tipo,
            id_ruta: id_Ruta
        },
        success: function(form, action) {
            console.log(action.data);
//            console.log(result.length);

//            for (var i = 0; i < storeParadasRutas.data.length; i++) {}
        },
        failure: function(form, action) {


        }

    });


    paradasRutas();
}