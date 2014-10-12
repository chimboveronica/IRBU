var formParadas;
var winParadas;


Ext.onReady(function() {

    formParadas = Ext.create('Ext.form.Panel', {
        items: [
            {xtype: 'form',
                padding: '10 10 10 10',
//                bodyStyle: "background-image: url('img/user.gif'); background-repeat:no-repeat; width='10' height='10'",
                items: [
                    {
                        xtype: 'fieldset',
                        title: '<b>Datos Paradas</b>',
                        collapsible: true,
                        layout: 'anchor',
                        items: [{
                                fieldLabel: 'Img',
                                xtype: 'textfield',
                                name: 'image',
                                id: 'img'
                            },
                            {
                                xtype: 'combobox',
                                fieldLabel: 'Nombre',
                                afterLabelTextTpl: required,
                                name: 'nombre',
//                                store: gridStore,
                                valueField: 'id',
                                displayField: 'nombre',
                                queryMode: 'local',
                                allowBlank: false,
                                blankText: 'Este campo es obligaorio',
                                emptyText: 'Seleccionar Opción...'
                            },
                            {
                                xtype: 'form',
//                                layout: 'anchor',
//                                margin: '0 0 0 8',
                                items: [{
                                        xtype: 'filefield',
                                        name: 'imageFile',
                                        emptyText: "Máximo 2MB",
                                        fieldLabel: "Foto",
//                                        width: 250,
                                        buttonConfig: {
                                            iconCls: 'icon-upload',
                                            text: '',
                                            tooltip: 'Escoger imagen'
                                        },
                                        listeners: {
                                            change: function(thisObj, value, eOpts) {
                                                var form = this.up('form').getForm();
                                                form.submit({
                                                    url: 'php/upload/uploadParadas.php',
                                                    success: function(form, action) {
                                                        formParadas.down('[name=labelImage]').setSrc('img/datap/' + action.result['img']);
                                                        formParadas.down('[name=image]').setValue(action.result['img']);
                                                        thisObj.setValue(action.result['img']);
                                                    },
                                                    failure: function(form, action) {
                                                        Ext.Msg.alert('Error', 'No se pudo subir la imagen');
                                                    }
                                                });
                                            }
                                        }
                                    }, {
                                        xtype: 'image',
                                        name: 'labelImage',
                                        src: 'img/sin_img.png',
                                        height: 100,
                                        border: 2,
                                        margin: '0 0 0 105',
                                        anchor: '60%',
                                        style: {
                                            borderColor: '#157fcc',
                                            borderStyle: 'solid'
                                        }
                                    }
                                ]
                            },
                            {
                                fieldLabel: 'Dirección',
                                xtype: 'textfield',
                                afterLabelTextTpl: required,
                                name: 'direccion',
                                emptyText: 'Ingresar Dirección',
                                allowBlank: false,
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Referencia',
                                afterLabelTextTpl: required,
                                name: 'referencia',
                                emptyText: 'Ingrese v',
                                allowBlank: false,
                            },
                            {
                                xtype: 'numberfield',
                                id: 'latitud',
                                fieldLabel: 'Latitud',
                                afterLabelTextTpl: required,
                                name: 'latitud',
                                blankText: 'Este campo es obligatorio',
                                emptyText: 'Ingrese la latitud'
                            }, {
                                xtype: 'numberfield',
                                fieldLabel: 'Longitud',
                                afterLabelTextTpl: required,
                                name: 'longitud',
                                id: 'longitud',
                                blankText: 'Este campo es obligatorio',
                                emptyText: 'Ingrese la dimensión del muro'
                            },
                            {
                                xtype: 'toolbar',
                                items: ['->', {
                                        xtype: 'button',
                                        text: 'Obtener posición',
                                        tooltip: 'Obtener posición a través de un "click", en el Mapa.',
                                        iconCls: 'icon-map',
                                        handler: function() {
                                            obtenerLongLat();
                                            winParadas.hide();
                                        }
                                    }]
                            }
                        ]},
                ]}],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'crear',
                        tooltip: 'Crear Parada',
                        handler: function() {
                            var form = formParadas.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: 'php/admin/station/create.php',
                                    waitTitle: 'Procesando...',
                                    waitMsg: 'Obteniendo Información',
                                    failure: function(form, action) {
                                        console.log(action);
                                        console.log(action.result.state);
                                        console.log(action.result);

                                        Ext.example.msg("Mensaje", 'Parada creada correctamente...');

                                    },
                                    success: function(form, action) {
                                        console.log('No');

                                        Ext.example.msg("Mensaje", 'Datos Incorrectos...');


                                    }
                                });

                            }
                        }



                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        text: 'Actualizar',
                        handler: function() {
                            winParadas.hide();
                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        text: 'Eliminar',
                        handler: function() {





                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        text: 'Limpiar',
                        handler: function() {
                            formParadas.getForm().reset();
                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        text: 'Cancelar',
                        handler: function() {
                            winParadas.hide();
                        }
                    }]
            }]



    });
});

function ventanaParadas() {
    if (!winParadas) {
        winParadas = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Paradas',
            iconCls: 'user',
            resizable: false,
            width: 400,
            height: 450,
            closeAction: 'hide',
            items: [formParadas]
        });
    }
    formParadas.getForm().reset();
    Ext.getCmp('img').hide();

    winParadas.show();
}