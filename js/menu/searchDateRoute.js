var winShowsearchDateRoute;
var formShowsearchDateRoute;
var gridsearchDateRoute;
var tipo = '';
var id_Ruta;
var hora;
var gridHoras;
var storeHorarios;
Ext.onReady(function() {
    storeHorarios = Ext.create('Ext.data.JsonStore', {
        autoLoad: true,
        proxy: {
            type: 'ajax',
            url: 'php/combobox/comboboxHorarios.php',
            reader: {
                type: 'json',
                root: 'data'
            }
        },
        fields: ['text']
    });
    gridsearchDateRoute = Ext.create('Ext.grid.Panel', {
        frame: true,
        width: '80%',
        title: '',
        store: storeRutas,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        region: 'west',
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {text: 'Rutas', width: 450, dataIndex: 'text', align: 'center', filterable: true},
        ],
        listeners: {
            itemclick: function(thisObj, record, item, index, e, eOpts) {
                //Id del despacho que se esta realizando
                id_Ruta = record.get('id');
                storeHorarios.load({
                    params: {
                        id_ruta: id_Ruta
                    }
                });
            }}

    });

    gridHoras = Ext.create('Ext.grid.Panel', {
        region: 'center',
        frame: true,
        width: '20%',
        title: '',
        store: storeHorarios,
        features: [filters],
        multiSelect: true,
        viewConfig: {
            emptyText: 'No hay datos que Mostrar'
        },
        columns: [
            {text: 'Horarios', width: 100, dataIndex: 'text', align: 'center', filterable: true},
        ]

    });
    formShowsearchDateRoute = Ext.create('Ext.form.Panel', {
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
                        var form = formShowsearchDateRoute.getForm();
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
                                    winShowsearchDateRoute.hide();
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
                    winShowsearchDateRoute.hide();
                }
            }]
    });
});
function showWinsearchDateRoute() {
    if (!winShowsearchDateRoute) {
        winShowsearchDateRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Paradas por horarios',
            iconCls: 'icon-company',
            resizable: false,
            width: 600,
            height: 460,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        formShowsearchDateRoute,
                        gridsearchDateRoute,
                        gridHoras,
                    ]
                }]
        });
    }

    winShowsearchDateRoute.show();
}

