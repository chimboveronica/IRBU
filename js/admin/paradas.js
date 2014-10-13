var formParadas;
var winParadas;
var id;
var nombre;
var image;
var direccion;
var referencia;
var latitud;
var longitud;

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
                        items: [
                            {
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
                                store: storeParadas1,
                                valueField: 'id',
                                displayField: 'nombre',
                                queryMode: 'local',
                                allowBlank: false,
                                blankText: 'Este campo es obligaorio',
                                emptyText: 'Seleccionar Opción...',
                                listeners: {
                                    select: function(combo, records, eOpts) {
                                        id = records[0].data.id;
                                        if (id !== ' ') {
                                            formParadas.down('#create').enable();
                                            formParadas.down('#clear').enable();
                                            formParadas.down('#update').disable();
                                            formParadas.down('#destroy').enable();
                                            formParadas.down('[name=image]').setValue(records[0].data.dir_img);
                                            formParadas.down('[name=direccion]').setValue(records[0].data.direccion);
                                            formParadas.down('[name=referencia]').setValue(records[0].data.referencia);
                                            formParadas.down('[name=latitud]').setValue(records[0].data.lat);
                                            formParadas.down('[name=longitud]').setValue(records[0].data.lon);
                                            formParadas.down('[name=labelImage]').setSrc('img/datap/' + records[0].data.dir_img);

                                        }
                                    }
                                }
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
                        itemId: 'create',
                        text: 'crear',
                        tooltip: 'Crear Parada',
                        handler: function() {
                            nombre = formParadas.down('[name=nombre]').getValue();
                            image = formParadas.down('[name=image]').getValue();
                            referencia = formParadas.down('[name=referencia]').getValue();
                            latitud = formParadas.down('[name=latitud]').getValue();
                            longitud = formParadas.down('[name=longitud]').getValue();

                            Ext.Ajax.request({
                                url: 'php/admin/station/create.php',
                                params: {
                                    nombre: nombre,
                                    image: image,
                                    direccion: direccion,
                                    referencia: referencia,
                                    latitud: latitud,
                                    longitud: longitud
                                },
                                method: 'POST',
                                failure: function(form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Error...',
                                        msg: 'No se pudo guardar',
                                        buttons: Ext.MessageBox.ERROR,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                },
                                success: function(form, action) {
                                    storeParadas1.reload();
                                    Ext.example.msg("Mensaje", 'Datos insertados correctamente');
                                    formParadas.getForm().reset();
                                    formParadas.down('#create').enable();
                                    formParadas.down('#clear').enable();
                                    formParadas.down('#update').disable();
                                    formParadas.down('#destroy').disable();
                                }
                            });
                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        itemId: 'update',
                        text: 'Actualizar',
                        handler: function() {
                            if (id !== ' ') {
                                nombre = formParadas.down('[name=nombre]').getValue();
                                image = formParadas.down('[name=image]').getValue();
                                direccion = formParadas.down('[name=direccion]').getValue();
                                referencia = formParadas.down('[name=referencia]').getValue();
                                latitud = formParadas.down('[name=latitud]').getValue();
                                longitud = formParadas.down('[name=longitud]').getValue();

                                Ext.Ajax.request({
                                    url: 'php/admin/station/update.php',
                                    params: {
                                        id: id,
                                        nombre: nombre,
                                        image: image,
                                        direccion: direccion,
                                        referencia: referencia,
                                        latitud: latitud,
                                        longitud: longitud
                                    },
                                    method: 'POST',
                                    failure: function(form, action) {
                                        Ext.MessageBox.show({
                                            title: 'Error...',
                                            msg: 'No fue posible Actualizar Estado',
                                            buttons: Ext.MessageBox.ERROR,
                                            icon: Ext.MessageBox.ERROR
                                        });
                                    },
                                    success: function(form, action) {
                                        Ext.example.msg("Mensaje", 'Estado Modificado Correctamente...');
                                        storeParadas1.reload();
                                        formParadas.getForm().reset();
                                        formParadas.down('#create').enable();
                                        formParadas.down('#clear').enable();
                                        formParadas.down('#update').disable();
                                        formParadas.down('#destroy').disable();
                                    }
                                });
                            }
                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Eliminar',
                        itemId: 'destroy',
//                        text: 'Eliminar',
                        handler: function() {
                            Ext.Ajax.request({
                                url: 'php/admin/station/destroy.php',
                                params: {
                                    id: id,
                                },
                                method: 'POST',
                                failure: function(form, action) {
                                    Ext.MessageBox.show({
                                        title: 'Error...',
                                        msg: 'No se pudo guardar',
                                        buttons: Ext.MessageBox.ERROR,
                                        icon: Ext.MessageBox.ERROR
                                    });
                                },
                                success: function(form, action) {
                                    Ext.example.msg("Mensaje", 'Datos eliminados correctamente');
                                    storeParadas1.reload();
                                    formParadas.down('[name=labelImage]').setSrc('img/datap/' + 'sin_img.png');
                                    formParadas.getForm().reset();
                                    formParadas.down('#create').enable();
                                    formParadas.down('#clear').enable();
                                    formParadas.down('#update').disable();
                                    formParadas.down('#destroy').disable();

                                }
                            });




                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Limpiar',
                        itemId: 'clear',
//                        text: 'Limpiar',
                        handler: function() {
                            formParadas.getForm().reset();
                            formParadas.down('#create').enable();
                            formParadas.down('#clear').enable();
                            formParadas.down('#update').disable();
                            formParadas.down('#destroy').disable();
                        }
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
//                        text: 'Cancelar',
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
    formParadas.down('#create').enable();
    formParadas.down('#clear').enable();
    formParadas.down('#update').disable();
    formParadas.down('#destroy').disable();

    winParadas.show();
}