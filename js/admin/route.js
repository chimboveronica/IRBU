var winAdminRoute;
var formAdminRoute;
var gridAdminRoute;
var gridStore;
Ext.onReady(function() {

    var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);
    Ext.define('DataPerson', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUsuario', type: 'int'},
            {name: 'cedula', type: 'string'},
            {name: 'nombres', type: 'string'},
            {name: 'apellidos', type: 'string'},
            {name: 'usuario', type: 'string'},
            {name: 'clave', type: 'string'},
            {name: 'imagePerson', type: 'string'}
        ]
    });
    gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataPerson',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/user/read.php',
                create: 'php/admin/user/create.php',
                update: 'php/admin/user/update.php',
                destroy: 'php/admin/user/destroy.php'
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
                onResetPerson();
                gridStore.reload();
                Ext.example.msg("Mensaje", operation._resultSet.message);
            }
        }
    });
    formAdminRoute = Ext.create('Ext.form.Panel', {
        padding: '10 10 10 10',
        region: 'center',
        bodyPadding: '10 10 10 10',
        margin: '0 0 0 0',
        items: [
            {xtype: 'form',
                defaults: {
//                    padding: '0 15 0 0',
                    baseCls: 'x-plain',
                    //defaultType: 'textfield',
                    defaults: {
                        labelWidth: 100
                    }
                },
//                bodyStyle: "background-image: url('img/user.gif'); background-repeat:no-repeat; width='10' height='10'",
                items: [{
                        items: [
                            {
                                xtype: 'fieldset',
                                title: '<b>Datos Rutas</b>',
                                collapsible: true,
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: 'Nombre',
                                        afterLabelTextTpl: required,
                                        name: 'nombre',
                                        width: 200,
                                        store: gridStore,
                                        valueField: 'idRoute',
                                        displayField: 'nombre',
                                        queryMode: 'local',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligaorio',
                                        emptyText: 'Seleccionar Opción...',
                                        listeners: {
                                            select: function(combo, records, eOpts) {
                                                console.log(records[0]);
                                                setActiveRecords(records[0] || null);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: 'Tipo',
                                        afterLabelTextTpl: required,
                                        name: 'tipo',
                                        width: 200,
                                        store: gridStore,
                                        valueField: 'tipo',
                                        displayField: 'text',
                                        queryMode: 'local',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligaorio',
                                        emptyText: 'Seleccionar Opción...',
                                    },
                                    {
                                        xtype: 'panel',
                                        layout: 'hbox',
                                        defaults: {
                                            margin: '0 5 0 0'
                                        },
                                        items: [{
                                                id: 'selector',
                                                xtype: 'numberfield',
                                                fieldLabel: 'Cant. Puntos',
                                                afterLabelTextTpl: required,
                                                name: 'countPointsRoute',
                                                allowBlank: false,
                                                minValue: 2,
                                                width: 200
                                            }, {
                                                id: 'btn-draw-edit-route',
                                                iconCls: 'icon-draw',
                                                xtype: 'button',
                                                value: 0,
                                                handler: function() {
//                            if (drawRoute === true) {
//                                drawLine.activate();
//                            } else {
//                                modifyLine.activate();
//                                modifyLine.activate();
//                                finishDrawRoute.show();
//                            }
//                            winAdminRoute.hide();
                                                }
                                            }]
                                    }

                                    , {
                                        xtype: 'fieldset',
                                        title: '<b>Paradas Asociadas</b>',
                                        defaultType: 'textfield',
                                        collapsible: true,
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '100%'
                                        },
                                        items: [
                                            {
                                                xtype: 'itemselector',
                                                name: 'listEvt',
//                                                 width: 300,
                                                height: 150,
                                                store: storeParadas1,
                                                displayField: 'nombre',
                                                valueField: 'value',
                                                allowBlank: false,
                                                msgTarget: 'side',
                                                fromTitle: 'Eventos',
                                                toTitle: 'Seleccionados'
                                            }



                                        ]}
                                ]}]
                    },
                ]

            }],
        listeners: {
            create: function(form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->',
                    {iconCls: 'icon-updat', itemId: 'update', text: 'Actualizar', scope: this, tooltip: 'Actualizar Datos', handler: onUpdatePerson},
                    {iconCls: 'icon-add', itemId: 'create', text: 'Crear', scope: this, tooltip: 'Crear Persona', handler: onCreatePerson},
                    {iconCls: 'icon-reset', itemId: 'delete', text: 'Eliminar', scope: this, tooltip: 'Eliminar Persona', handler: onDeletePerson},
                    {iconCls: 'limpiar', text: 'Limpiar', tooltip: 'Limpiar Campos', scope: this, handler: onResetPerson},
                    {iconCls: 'icon-cancel', tooltip: 'Cancelar', scope: this, handler: function() {
                            winAdminRoute.hide();
                        }}
                ]
            }]
    });
});
function showWinAdminRoute() {
    if (!winAdminRoute) {
        winAdminRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Rutas',
            iconCls: 'icon-person',
            resizable: false,
            width: 650,
            height: 430,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        formAdminRoute
                    ]
                }]
        });
    }
    onResetPerson();
    winAdminRoute.show();
}

function setActiveRecords(record) {
    formAdminRoute.activeRecord = record;
    if (record) {
        formAdminRoute.down('#update').enable();
        formAdminRoute.down('#create').disable();
        formAdminRoute.down('#delete').enable();
        formAdminRoute.getForm().loadRecord(record);
    } else {
        formAdminRoute.down('#update').disable();
        formAdminRoute.getForm().reset();
    }
}

function onUpdatePerson() {
    var active = formAdminRoute.activeRecord,
            form = formAdminRoute.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreatePerson() {
    var form = formAdminRoute.getForm();
    if (form.isValid()) {
        formAdminRoute.fireEvent('create', formAdminRoute, form.getValues());
        formAdminRoute.down('#update').disable();
        form.reset();
        gridStore.reload();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');
    }
}

function onResetPerson() {
    setActiveRecords(null);
    formAdminRoute.down('#delete').disable();
    formAdminRoute.down('#create').enable();
    formAdminRoute.getForm().reset();
    formAdminRoute.getForm().reset();
}

function onDeletePerson() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Persona', function(choice) {
        if (choice === 'yes') {
//            var selection = gridAdminPerson.getView().getSelectionModel().getSelection()[0];
            if (selection) {
//                gridAdminPerson.store.remove(selection);
//formAdminPerson.down('#delete').disable();
                formAdminRoute.down('#create').enable();
            }
        }
    });
}