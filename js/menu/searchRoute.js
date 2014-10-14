var winShowWinsearchRoute;
var formShowWinsearchRoute;
var gridsearchRoute;
var tipo = '';
var id_Ruta;
Ext.onReady(function() {
    tipo = 'R';
    storeRutas.load({
        params: {
            tipo: tipo
        }
    });
    gridsearchRoute = Ext.create('Ext.grid.Panel', {
        store: storeRutas,
        stripeRows: true,
        width: '55%',
        margins: '0 2 0 0',
        region: 'center',
        title: 'Resultados',
        features: [filters],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {text: 'Ruta', width: 450, dataIndex: 'text', align: 'center', filterable: true},
        ],
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    id_Ruta = selected[0].data.id;
                    console.log(selected[0].data.id);


                }
            }
        }
    });
    formShowWinsearchRoute = Ext.create('Ext.form.Panel', {
        region: 'north',
        activeRecord: null,
        bodyPadding: '10 10 10 10',
        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [
            {
                xtype: 'fieldset',
                title: '<b>Criterios de Búsqueda</b>',
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
                                        tipo = 'R';
                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });

                                        break;
                                    case 2:
                                        tipo = 'B';

                                        storeRutas.load({
                                            params: {
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                    case 3:
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
                    }
                ]
            }
        ],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
            }
        },
        buttons: [{
                text: 'Trazar',
                iconCls: 'icon-obtener',
                handler: function() {
                    if (id_Ruta != null) {
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
                    else {
                        Ext.example.msg("Mensaje", 'Dede seleccionar una Ruta');

                    }
                }
            }
            , {
                text: 'Cancelar',
                iconCls: 'icon-cancel',
                handler: function() {
                    winShowWinsearchRoute.hide();
                }
            }]
    });
});




function showWinsearchRoute() {
    if (!winShowWinsearchRoute) {
        winShowWinsearchRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Búsqueda de Rutas',
            iconCls: 'icon-company',
            resizable: false,
            width: 500,
            height: 360,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridsearchRoute,
                        formShowWinsearchRoute,
                    ]
                }]
        });
    }

    winShowWinsearchRoute.show();
}

