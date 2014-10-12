var winAdminPerson;
var formAdminPerson;
var gridAdminPerson;
var labelDatos;

Ext.onReady(function() {

    var edadDate = Ext.Date.subtract(new Date(), Ext.Date.YEAR, 18);

    Ext.define('DataPerson', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUsuario', type: 'int'},
            {name: 'documentPerson', type: 'string'},
            {name: 'namePerson', type: 'string'},
            {name: 'surnamePerson', type: 'string'},
            {name: 'dateOfBirthPerson', type: 'date', dateFormat: 'c'},
            {name: 'userPerson', type: 'string'},
            {name: 'passwordPerson', type: 'string'},
            {name: 'imagePerson', type: 'string'},
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
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
                storePerson.reload();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });


    formAdminPerson = Ext.create('Ext.form.Panel', {
        padding: '10 10 10 10',
        region: 'center',
        width: '60%',
//        title: 'Ingresar Datos del Vehículo',
        bodyPadding: '10 10 10 10',
        margin: '0 0 3 0',
        layout: 'hbox',
        items: [
            {xtype: 'form',
                defaults: {
//                    padding: '0 15 0 0',
                    baseCls: 'x-plain',
                    layout: 'vbox',
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
                                title: '<b>Datos Personales</b>',
                                collapsible: true,
                                layout: 'anchor',
                                defaults: {
                                    anchor: '100%'
                                },
                                items: [
                                    {
                                        xtype: 'combobox',
                                        fieldLabel: 'Cedula',
                                        afterLabelTextTpl: required,
                                        name: 'documentPerson',
                                        store: gridStore,
                                        valueField: 'id',
                                        displayField: 'documentPerson',
                                        queryMode: 'local',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligaorio',
                                        emptyText: 'Seleccionar Opción...'
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Nombres',
                                        afterLabelTextTpl: required,
                                        name: 'namePerson',
                                        vtype: 'alphanum',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligatorio',
                                        emptyText: 'Ingresar Nombres...'

                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: 'Apellidos',
                                        afterLabelTextTpl: required,
                                        name: 'surnamePerson',
                                        vtype: 'alphanum',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligatorio',
                                        emptyText: 'Ingresar Apellidos...'

                                    }
                                    , {
                                        xtype: 'datefield',
                                        afterLabelTextTpl: required,
                                        fieldLabel: 'Fecha de Nacimiento',
                                        name: 'dateOfBirthPerson',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligatorio',
                                        maxValue: edadDate,
                                        value: edadDate,
                                        minValue: '1950-01-01',
                                        invalidText: 'Fecha de nacimienro inválida',
                                        format: 'Y-m-d',
                                        emptyText: 'Ingresar Fecha...'
                                    }, {
                                        xtype: 'fieldset',
                                        title: '<b>Usuario</b>',
                                        defaultType: 'textfield',
                                        collapsible: true,
                                        layout: 'anchor',
                                        defaults: {
                                            anchor: '30%'
                                        },
                                        items: [
                                            {
                                                fieldLabel: 'Usuario',
                                                afterLabelTextTpl: required,
                                                name: 'userPerson',
                                                vtype: 'alphanum',
                                                allowBlank: false,
                                                blankText: 'Este campo es obligatorio',
                                                emptyText: 'Ingresar Usuario...'

                                            }, {
                                                xtype: 'fieldset',
                                                title: '<b>Editar Contraseña</b>',
                                                collapsible: true,
                                                defaultType: 'textfield',
                                                layout: 'anchor',
                                                defaults: {
                                                    anchor: '100%'
                                                },
                                                items: [{
                                                        xtype: 'radiogroup',
                                                        columns: 2,
                                                        vertical: true,
                                                        padding: '0 0 10 50',
                                                        items: [
                                                            {boxLabel: 'No', name: 'rbpass', inputValue: 1},
                                                            {boxLabel: 'Si', name: 'rbpass', inputValue: 2, checked: true}
                                                        ],
                                                        listeners: {
                                                            change: function(field, newValue, oldValue) {
                                                                switch (newValue['rbpass']) {
                                                                    case 1:
                                                                        Ext.getCmp('txt-pass-user').disable();
                                                                        Ext.getCmp('txt-confirm-pass-user').disable();
                                                                        break;
                                                                    case 2:
                                                                        Ext.getCmp('txt-pass-user').enable();
                                                                        Ext.getCmp('txt-confirm-pass-user').enable();
                                                                        break;
                                                                }
                                                            }
                                                        }
                                                    }, , {
                                                        id: 'txt-pass-user',
                                                        fieldLabel: 'Contraseña',
                                                        afterLabelTextTpl: required,
                                                        name: 'passwordPerson',
                                                        vtype: 'alphanum',
                                                        itemId: 'pass',
                                                        allowBlank: false,
                                                        disabled: true,
                                                        blankText: 'Este campo es obligatorio',
                                                        inputType: 'password',
                                                        emptyText: 'Ingresar Contraseña...',
                                                        minLength: 3,
                                                        minLengthText: 'La longitud mínima de la contraseña es de 3 caracteres',
                                                        maxLength: 45,
                                                        maxLengthText: 'La longitud máxima de la contraseña es de 45 caracteres'
                                                    }, {
                                                        id: 'txt-confirm-pass-user',
                                                        fieldLabel: 'Confirmar Contraseña',
                                                        afterLabelTextTpl: required,
                                                        name: 'passwordPerson',
                                                        allowBlank: false,
                                                        disabled: true,
                                                        blankText: 'Este campo es obligatorio',
                                                        inputType: 'password',
                                                        emptyText: 'Ingresar Contraseña Nuevamente...',
                                                        vtype: 'password',
                                                        initialPassField: 'pass'
                                                    }]
                                            }

                                        ]}
                                ]}]
                    }, {
                        xtype: 'form',
                        layout: 'anchor',
                        margin: '0 0 0 8',
                        items: [{
                                xtype: 'filefield',
                                name: 'imageFile',
                                emptyText: "Máximo 2MB",
                                fieldLabel: "Foto",
                                width: 250,
                                buttonConfig: {
                                    iconCls: 'icon-upload',
                                    text: '',
                                    tooltip: 'Escoger imagen'
                                },
                                listeners: {
                                    change: function(thisObj, value, eOpts) {
                                        var form = this.up('form').getForm();
                                        form.submit({
                                            url: 'php/upload/uploadUsuario.php',
                                            success: function(form, action) {
                                                formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + action.result['img']);
                                                //formAdminPerson.down('[name=imagePerson]').setValue(action.result['img']);
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
                    }
                ]

            }],
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Ingresar',
                        tooltip: 'Ingresar',
                        handler: function() {

                            var form = formAdminPerson.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: 'php/admin/user/create.php',
                                    waitTitle: 'Procesando...',
                                    waitMsg: 'Obteniendo Información',
                                    success: function(form, action) {
                                        console.log("true");
                                        // window.open('index_admin.php');
                                        location.href = 'index_admin.php';

                                    },
                                    failure: function(form, action) {
                                        console.log("action");
                                        Ext.MessageBox.show({
                                            title: 'Información',
                                            msg: action.result.msg,
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });

                                    }
                                });

                            }
                        }



                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        text: 'Cancelar',
                        handler: function() {
                            winusuario.hide();
                        }
                    }]
            }]



    });





//    var formAdminPerson1 = Ext.create('Ext.form.Panel', {
//        items: [
//            {xtype: 'form',
////                bodyStyle: "background-image: url('img/user.gif'); background-repeat:no-repeat; width='10' height='10'",
//
//                region: 'center',
//                width: '60%',
////        title: 'Ingresar Datos del Vehículo',
//                activeRecord: null,
//                bodyPadding: '10 10 10 10',
//                margin: '0 0 3 0',
//                layout: 'hbox',
//                defaults: {
////                    padding: '0 15 0 0',
//                    baseCls: 'x-plain',
//                    layout: 'vbox',
//                    //defaultType: 'textfield',
//                    defaults: {
//                        labelWidth: 100
//                    }
//                },
//                items: [{
//                        items: [
//                            {
//                                xtype: 'fieldset',
//                                title: '<b>Datos Personales</b>',
//                                collapsible: true,
//                                layout: 'anchor',
//                                defaults: {
//                                    anchor: '100%'
//                                },
//                                items: [
//                                    {
//                                        xtype: 'combobox',
//                                        fieldLabel: 'Cedula',
//                                        afterLabelTextTpl: required,
//                                        name: 'documentPerson',
//                                        store: gridStore,
//                                        valueField: 'id',
//                                        displayField: 'documentPerson',
//                                        queryMode: 'local',
//                                        allowBlank: false,
//                                        blankText: 'Este campo es obligaorio',
//                                        emptyText: 'Seleccionar Opción...'
//                                    },
//                                    {
//                                        xtype: 'textfield',
//                                        fieldLabel: 'Nombres',
//                                        afterLabelTextTpl: required,
//                                        name: 'namePerson',
//                                        vtype: 'alphanum',
//                                        allowBlank: false,
//                                        blankText: 'Este campo es obligatorio',
//                                        emptyText: 'Ingresar Nombres...'
//
//                                    }, {
//                                        xtype: 'textfield',
//                                        fieldLabel: 'Apellidos',
//                                        afterLabelTextTpl: required,
//                                        name: 'surnamePerson',
//                                        vtype: 'alphanum',
//                                        allowBlank: false,
//                                        blankText: 'Este campo es obligatorio',
//                                        emptyText: 'Ingresar Apellidos...'
//
//                                    }
//                                    , {
//                                        xtype: 'datefield',
//                                        afterLabelTextTpl: required,
//                                        fieldLabel: 'Fecha de Nacimiento',
//                                        name: 'dateOfBirthPerson',
//                                        allowBlank: false,
//                                        blankText: 'Este campo es obligatorio',
//                                        maxValue: edadDate,
//                                        value: edadDate,
//                                        minValue: '1950-01-01',
//                                        invalidText: 'Fecha de nacimienro inválida',
//                                        format: 'Y-m-d',
//                                        emptyText: 'Ingresar Fecha...'
//                                    }, {
//                                        xtype: 'fieldset',
//                                        title: '<b>Usuario</b>',
//                                        defaultType: 'textfield',
//                                        collapsible: true,
//                                        layout: 'anchor',
//                                        defaults: {
//                                            anchor: '30%'
//                                        },
//                                        items: [
//                                            {
//                                                fieldLabel: 'Usuario',
//                                                afterLabelTextTpl: required,
//                                                name: 'userPerson',
//                                                vtype: 'alphanum',
//                                                allowBlank: false,
//                                                blankText: 'Este campo es obligatorio',
//                                                emptyText: 'Ingresar Usuario...'
//
//                                            }, {
//                                                xtype: 'fieldset',
//                                                title: '<b>Editar Contraseña</b>',
//                                                collapsible: true,
//                                                defaultType: 'textfield',
//                                                layout: 'anchor',
//                                                defaults: {
//                                                    anchor: '100%'
//                                                },
//                                                items: [{
//                                                        xtype: 'radiogroup',
//                                                        columns: 2,
//                                                        vertical: true,
//                                                        padding: '0 0 10 50',
//                                                        items: [
//                                                            {boxLabel: 'No', name: 'rbpass', inputValue: 1},
//                                                            {boxLabel: 'Si', name: 'rbpass', inputValue: 2, checked: true}
//                                                        ],
//                                                        listeners: {
//                                                            change: function(field, newValue, oldValue) {
//                                                                switch (newValue['rbpass']) {
//                                                                    case 1:
//                                                                        Ext.getCmp('txt-pass-user').disable();
//                                                                        Ext.getCmp('txt-confirm-pass-user').disable();
//                                                                        break;
//                                                                    case 2:
//                                                                        Ext.getCmp('txt-pass-user').enable();
//                                                                        Ext.getCmp('txt-confirm-pass-user').enable();
//                                                                        break;
//                                                                }
//                                                            }
//                                                        }
//                                                    }, , {
//                                                        id: 'txt-pass-user',
//                                                        fieldLabel: 'Contraseña',
//                                                        afterLabelTextTpl: required,
//                                                        name: 'passwordPerson',
//                                                        vtype: 'alphanum',
//                                                        itemId: 'pass',
//                                                        allowBlank: false,
//                                                        disabled: true,
//                                                        blankText: 'Este campo es obligatorio',
//                                                        inputType: 'password',
//                                                        emptyText: 'Ingresar Contraseña...',
//                                                        minLength: 3,
//                                                        minLengthText: 'La longitud mínima de la contraseña es de 3 caracteres',
//                                                        maxLength: 45,
//                                                        maxLengthText: 'La longitud máxima de la contraseña es de 45 caracteres'
//                                                    }, {
//                                                        id: 'txt-confirm-pass-user',
//                                                        fieldLabel: 'Confirmar Contraseña',
//                                                        afterLabelTextTpl: required,
//                                                        name: 'passwordPerson',
//                                                        allowBlank: false,
//                                                        disabled: true,
//                                                        blankText: 'Este campo es obligatorio',
//                                                        inputType: 'password',
//                                                        emptyText: 'Ingresar Contraseña Nuevamente...',
//                                                        vtype: 'password',
//                                                        initialPassField: 'pass'
//                                                    }]
//                                            }
//
//                                        ]}
//                                ]}]
//                    }, {
//                        xtype: 'form',
//                        layout: 'anchor',
//                        margin: '0 0 0 8',
//                        items: [{
//                                xtype: 'filefield',
//                                name: 'imageFile',
//                                emptyText: "Máximo 2MB",
//                                fieldLabel: "Foto",
//                                width: 250,
//                                buttonConfig: {
//                                    iconCls: 'icon-upload',
//                                    text: '',
//                                    tooltip: 'Escoger imagen'
//                                },
//                                listeners: {
//                                    change: function(thisObj, value, eOpts) {
//                                        var form = this.up('form').getForm();
//                                        form.submit({
//                                            url: 'php/upload/uploadUsuario.php',
//                                            success: function(form, action) {
//                                                formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + action.result['img']);
//                                                //formAdminPerson.down('[name=imagePerson]').setValue(action.result['img']);
//                                                thisObj.setValue(action.result['img']);
//                                            },
//                                            failure: function(form, action) {
//                                                Ext.Msg.alert('Error', 'No se pudo subir la imagen');
//                                            }
//                                        });
//                                    }
//                                }
//                            }, {
//                                xtype: 'image',
//                                name: 'labelImage',
//                                src: 'img/sin_img.png',
//                                height: 100,
//                                border: 2,
//                                margin: '0 0 0 105',
//                                anchor: '60%',
//                                style: {
//                                    borderColor: '#157fcc',
//                                    borderStyle: 'solid'
//                                }
//                            }
//                        ]
//                    }
//                ]}],
//        dockedItems: [{
//                xtype: 'toolbar',
//                dock: 'bottom',
//                ui: 'footer',
//                items: ['->', {
//                        iconCls: 'icon-update',
//                        itemId: 'update',
//                        text: 'Ingresar',
//                        tooltip: 'Ingresar',
//                        handler: function() {
//
//                            var form = formAdminPerson.getForm();
//                            if (form.isValid()) {
//                                form.submit({
//                                    url: 'php/admin/user/create.php',
//                                    waitTitle: 'Procesando...',
//                                    waitMsg: 'Obteniendo Información',
//                                    success: function(form, action) {
//                                        console.log("true");
//                                        // window.open('index_admin.php');
//                                        location.href = 'index_admin.php';
//
//                                    },
//                                    failure: function(form, action) {
//                                        console.log("action");
//                                        Ext.MessageBox.show({
//                                            title: 'Información',
//                                            msg: action.result.msg,
//                                            buttons: Ext.MessageBox.OK,
//                                            icon: Ext.MessageBox.INFO
//                                        });
//
//                                    }
//                                });
//
//                            }
//                        }
//
//
//
//                    }, {
//                        iconCls: 'icon-cancel',
//                        tooltip: 'Cancelar',
//                        text: 'Cancelar',
//                        handler: function() {
//                            winusuario.hide();
//                        }
//                    }]
//            }],
////        dockedItems: [{
////                xtype: 'toolbar',
////                dock: 'bottom',
////                ui: 'footer',
////                items: ['->', {
////                        iconCls: 'icon-update',
////                        itemId: 'update',
////                        text: 'Actualizar',
////                        disabled: true,
////                        tooltip: 'Actualizar',
////                        handler: onUpdatePerson
////                    }, {
////                        iconCls: 'icon-add',
////                        text: 'Crear',
////                        itemId: 'create',
////                        tooltip: 'Crear',
////                        handler: function() {
////                            var form = formAdminPerson.getForm();
////                            if (form.isValid()) {
////                                form.submit({
////                                    url: 'php/admin/user/create.php',
////                                    success: function(form, action) {
////                                        Ext.Msg.alert('Error', 'Persona Guardada');
////
////                                    },
////                                    failure: function(form, action) {
////                                        Ext.Msg.alert('Error', 'No se pudo guardar');
////                                    }
////                                });
////                            }
////                        }
////                    }, {
////                        iconCls: 'icon-delete',
////                        text: 'Eliminar',
////                        disabled: true,
////                        itemId: 'delete',
////                        tooltip: 'Eliminar Persona',
////                        handler: onDeletePerson
////                    }, {
////                        iconCls: 'icon-reset',
////                        text: 'Limpiar',
////                        tooltip: 'Limpiar Campos',
////                        handler: onResetPerson
////                    }, {
////                        iconCls: 'icon-cancel',
////                        tooltip: 'Cancelar',
////                        handler: function() {
////                            winAdminPerson.hide();
////                        }
////                    }]
////            }]
//    });
});
function showWinAdminPerson() {
    if (!winAdminPerson) {
        winAdminPerson = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Personal',
            iconCls: 'icon-person',
            resizable: false,
            width: 450,
            height: 650,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
//                        gridAdminPerson,
                        formAdminPerson
                    ]
                }]
        });
    }
    onResetPerson();
    winAdminPerson.show();
}

function setActiveRecordPerson(record) {
    formAdminPerson.activeRecord = record;
    formAdminPerson.down('#update').enable();
    formAdminPerson.down('#create').disable();
    formAdminPerson.getForm().loadRecord(record);
}

function onUpdatePerson() {
    var active = formAdminPerson.activeRecord,
            form = formAdminPerson.getForm();
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
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        formAdminPerson.fireEvent('create', formAdminPerson, form.getValues());
        formAdminPerson.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetPerson() {
    formAdminPerson.getForm().reset();
//    gridAdminPerson.getView().deselect(gridAdminPerson.getSelection());
}

function onDeletePerson() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Persona', function(choice) {
        if (choice === 'yes') {
//            var selection = gridAdminPerson.getView().getSelectionModel().getSelection()[0];
            if (selection) {
//                gridAdminPerson.store.remove(selection);
                //formAdminPerson.down('#delete').disable();
                formAdminPerson.down('#create').enable();
            }
        }
    });
}