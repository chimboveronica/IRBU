/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var winAdminWall;
var formAdminWall;

Ext.onReady(function() {
    Ext.define('DataWall', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idWall', type: 'int'},
            {name: 'tipeWall', type: 'int'},
            {name: 'dimensionWall', type: 'int'},
            {name: 'comentarioWall', type: 'string'},
            {name: 'latitudWall', type: 'string'},
            {name: 'longituddWall', type: 'string'},
            {name: 'linealWall', type: 'int'},
            {name: 'imagenWall', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        //autoLoad: true,
        //autoSync: true,
        model: 'DataWall',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/Wall/read.php',
                create: 'php/admin/Wall/create.php',
                update: 'php/admin/Wall/update.php',
                destroy: 'php/admin/Wall/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'data',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function(proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function(store, operation, eOpts) {
                onResetWall();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    formAdminWall = Ext.create('Ext.form.Panel', {
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
        items: [{
                xtype: 'combobox',
                fieldLabel: 'Tipo de <br> Muro',
                afterLabelTextTpl: required,
                id: 'tipeWall',
                name: 'tipeWall',
                forceSelection: true,
                //store: storePerson,
                valueField: 'id',
                displayField: 'textDocument',
                queryMode: 'local',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Seleccionar Opción...',
                listConfig: {
                    minWidth: 320
                }
            }, {
                xtype: 'numberfield',
                fieldLabel: 'Dimension',
                afterLabelTextTpl: required,
                name: 'dimensionWall',
                //store: storeRolWall,
                valueField: 'id',
                displayField: 'text',
                queryMode: 'local',
                allowBlank: false,
                editable: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese la dimensión del muro'
            }, {
                fieldLabel: 'Sector',
                afterLabelTextTpl: required,
                name: 'sectorWall',
                //vtype: 'alphanum',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese el Sector de Ubicación'

            }, {
                fieldLabel: 'Metros Lineales',
                afterLabelTextTpl: required,
                name: 'passwordWall',
                //vtype: 'alphanum',
                itemId: 'pass',
                blankText: 'Este campo es obligatorio',
                emptyText: 'Longitud en metros lineales',
                minLength: 3,
                minLengthText: 'La longitud mínima de la contraseña es de 3 caracteres',
                maxLength: 45,
                maxLengthText: 'La longitud máxima de la contraseña es de 45 caracteres'
            }, {
                fieldLabel: 'Metros Cuadrados',
                afterLabelTextTpl: required,
                name: 'passwordWall',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                inputType: 'password',
                emptyText: 'Longitud en metros cuadrados',
                vtype: 'password',
                initialPassField: 'pass'
            },
             {
                        id: 'latPoint',
                        xtype: 'numberfield',
                        name: 'latitudPoint',
                        decimalPrecision: 8,
                        fieldLabel: 'Latitud',
                        blankText: 'Este campo es obligatorio',
                        afterLabelTextTpl: required,
                        allowBlank: false,
                        emptyText: '-3.97984783'
                    }, {
                        id: 'lonPoint',
                        xtype: 'numberfield',
                        name: 'longitudPoint',
                        decimalPrecision: 8,
                        fieldLabel: 'Longitud',
                        blankText: 'Este campo es obligatorio',
                        afterLabelTextTpl: required,
                        allowBlank: false,
                        emptyText: '-78.90451616'
                    }, {
                        xtype: 'toolbar',
                        items: ['->', {
                                xtype: 'button',
                                text: 'Obtener posición',
                                tooltip: 'Obtener posición a través de un "click", en el Mapa.',
                                iconCls: 'icon-map',
                                handler: function() {
                                    if (connectionMap()) {
                                        winAdminPoint.hide();
                                        positionPoint = true;
                                    }
                                }
                            }]
                    },
                     {
                        xtype: 'filefield',
                        name: 'imageFile',
                        emptyText: "Suba una fotografia del muro",
                        fieldLabel: "Imagen",
                        buttonConfig: {
                            iconCls: 'icon-upload',
                            text: '',
                            tooltip: 'Escoger imagen'
                        },
                        listeners: {
                            change: function(thisObj, value, eOpts) {
                                var form = formAdminPerson.getForm();
                                form.submit({
                                    url: 'php/uploads/uploadFormatos.php',
                                    success: function(form, action) {
                                        formAdminPerson.down('[name=labelImage]').setSrc('img/fotos/' + action.result['img']);
                                        formAdminPerson.down('[name=imagePerson]').setValue(action.result['img']);
                                        thisObj.setRawValue(action.result['img']);
                                    },
                                    failure: function(form, action) {
                                        Ext.Msg.alert('Error', 'El formtao de la imagen es inválida');
                                    }
                                });
                            }
                        }
                    }],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateWall
                    }, {
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetWall
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminWall.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminWall() {
    if (!winAdminWall) {
        winAdminWall = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administracion de Muros',
            iconCls: 'icon-wall',
            resizable: false,
            width: 500,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [formAdminWall]
        });
    }
    onResetWall();
    winAdminWall.show();
}

function setActiveRecordWall(record) {
    formAdminWall.activeRecord = record;
    formAdminWall.down('#update').enable();
    formAdminWall.down('#create').disable();
    formAdminWall.getForm().loadRecord(record);
}

function onUpdateWall() {
    var active = formAdminWall.activeRecord,
            form = formAdminWall.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateWall() {
    var form = formAdminWall.getForm();
    if (form.isValid()) {
        formAdminWall.fireEvent('create', formAdminWall, form.getValues());
        formAdminWall.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetWall() {
    formAdminWall.getForm().reset();
}