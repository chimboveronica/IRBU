var formShowWinsearchDateRoute;
var winShowWinsearchDateRoute;
var cbxShowWinsearchDateRoute;
var cbxDateRoute;
var empresa = 1;
var tipo = '';
Ext.onReady(function() {
    var cbxHorarios = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Rutas',
        name: 'id_Horario',
        store: storeHorarios,
        valueField: 'id',
        displayField: 'text',
        forceSelection: true,
        queryMode: 'local',
        emptyText: 'Seleccionar Ruta...',
        allowBlank: false,
    });

    cbxShowWinsearchDateRoute = Ext.create('Ext.form.ComboBox', {
        fieldLabel: 'Rutas',
        name: 'id_RutaHora',
        store: storeHorariosRutas,
        valueField: 'id',
        displayField: 'text',
        forceSelection: true,
        queryMode: 'local',
        emptyText: 'Seleccionar Ruta...',
        allowBlank: false,
    });

    var timeIni = Ext.create('Ext.form.field.Time', {
        fieldLabel: '<b>Tiempo/hora<b>',
        afterLabelTextTpl: required,
        name: 'hora',
        allowBlank: false,
        blankText: 'Este campo es obligatorio',
        format: 'H:i:s',
        invalidText: 'La hora es inválida',
        value: new Date(),
        minValue: '05:45:00',
        maxValue: '22:30:00',
        emptyText: '00:00:00'
    });

    formShowWinsearchDateRoute = Ext.create('Ext.form.Panel', {
        bodyPadding: '10 10 0 10',
        fieldDefaults: {
            labelAlign: 'left',
            anchor: '100%'
        },
        items: [{
                xtype: 'fieldset',
                title: '<b>Horarios</b>',
                items: [cbxHorarios]}, {
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
//                                var hora = timeIni.getRawValue();
                                var hora = cbxHorarios.getRawValue();
                                switch (parseInt(newValue['rb'])) {
                                    case 1:
                                        cbxShowWinsearchDateRoute.enable();
                                        tipo = 'R';
                                        storeHorariosRutas.removeAll();
                                        storeHorariosRutas.load({
                                            params: {
                                                hora: hora,
                                                tipo: tipo
                                            }
                                        });

                                        break;
                                    case 2:
                                        cbxShowWinsearchDateRoute.enable();
                                        tipo = 'B';
                                        storeHorariosRutas.removeAll();

                                        storeHorariosRutas.load({
                                            params: {
                                                hora: hora,
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                    case 3:
                                        cbxShowWinsearchDateRoute.enable();
                                        tipo = 'BR';
                                        storeHorariosRutas.removeAll();

                                        storeHorariosRutas.load({
                                            params: {
                                                hora: hora,
                                                tipo: tipo
                                            }
                                        });
                                        break;
                                }

                            }
                        }
                    },
                    cbxShowWinsearchDateRoute
                ]
            }], buttons: [{
                text: 'Obtener',
                iconCls: 'icon-obtener',
                handler: function() {
                    id_Ruta = cbxShowWinsearchDateRoute.getValue();
                    console.log(id_Ruta);
                    var form = formShowWinsearchDateRoute.getForm();
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
                                winShowWinsearchDateRoute.hide();

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
                    winShowWinsearchDateRoute.hide();
                }
            }]

    })
});
function showWinsearchDateRoute() {
    if (!winShowWinsearchDateRoute) {
        winShowWinsearchDateRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Paradas por Horas y Sector ',
            iconCls: 'icon-company',
            resizable: false,
            width: 450,
            height: 300,
            closeAction: 'hide',
            plain: false,
            items: formShowWinsearchDateRoute
        });
    }
    formShowWinsearchDateRoute.getForm().reset();
    cbxShowWinsearchDateRoute.disable();
    winShowWinsearchDateRoute.show();
}
