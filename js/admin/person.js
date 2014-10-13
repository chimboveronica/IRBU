var winAdminPerson;
var formAdminPerson;
var gridAdminPerson;
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


    formAdminPerson = Ext.create('Ext.form.Panel', {
        padding: '10 10 10 10',
        region: 'center',
        width: '60%',
        bodyPadding: '10 10 10 10',
        margin: '0 0 3 0',
        layout: 'hbox',
        items: [
            {xtype: 'form',
                defaults: {
                    baseCls: 'x-plain',
                    layout: 'vbox',
                    defaults: {
                        labelWidth: 100
                    }
                },
                items: [
                      {
                        fieldLabel: 'Img',
                        xtype: 'textfield',
                        name: 'imagePerson',
                        id: 'imagePerson',
                        hidden: true
                    },
                    {
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
                                        name: 'cedula',
                                        store: gridStore,
                                        valueField: 'idUsuario',
                                        displayField: 'cedula',
                                        queryMode: 'local',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligaorio',
                                        emptyText: 'Seleccionar Opción...',
                                        listeners: {
                                            select: function(combo, records, eOpts) {
                                                console.log(records[0]);
                                                setActiveRecords(records[0] || null);
                                                formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + records[0].data.imagePerson);
                                                formAdminPerson.down('[name=imageFile]').setRawValue(records[0].data.imagePerson);
                                            }
                                        }
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: 'Nombres',
                                        afterLabelTextTpl: required,
                                        name: 'nombres',
//                                        vtype: 'alphanum',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligatorio',
                                        emptyText: 'Ingresar Nombres...'

                                    }, {
                                        xtype: 'textfield',
                                        fieldLabel: 'Apellidos',
                                        afterLabelTextTpl: required,
                                        name: 'apellidos',
//                                        vtype: 'alphanum',
                                        allowBlank: false,
                                        blankText: 'Este campo es obligatorio',
                                        emptyText: 'Ingresar Apellidos...'

                                    },
                                    {
                                        xtype: 'datefield',
                                        fieldLabel: '<b>Fecha de Nacimiento</b>',
                                        afterLabelTextTpl: required,
                                        blankText: 'Este campo es obligatorio',
                                        editable: false,
                                        value: edadDate,
                                        maxValue: edadDate,
                                        name: 'fechaNacimiento',
                                        format: 'y-m-d',
                                        emptyText: 'Ingresar Fecha...',
                                        minValue: '1950-01-01',
                                    }
                                    , {
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
                                                name: 'usuario',
                                                vtype: 'alphanum',
                                                allowBlank: false,
                                                blankText: 'Este campo es obligatorio',
                                                emptyText: 'Ingresar Usuario...'
                                            },
                                            {
                                                xtype: 'textfield',
                                                fieldLabel: '<b>Contraseña</b>',
                                                afterLabelTextTpl: required,
                                                blankText: 'Este campo es Obligatorio',
                                                name: 'clave',
                                                itemId: 'pass',
                                                allowBlank: false,
                                                inputType: 'password',
                                                emptyText: 'Ingresar Contraseña...',
                                            }, {
                                                xtype: 'textfield',
                                                fieldLabel: '<b>Confirmar Contraseña</b>',
                                                afterLabelTextTpl: required,
                                                blankText: 'Este campo es Obligatorio',
                                                name: 'clave',
                                                allowBlank: false,
                                                inputType: 'password',
                                                emptyText: 'Ingresar Contraseña Nuevamente...',
                                                vtype: 'password',
                                                initialPassField: 'pass'
                                            }
                                        ]}
                                ]}]
                    },
                    {
                        xtype: 'form',
                        layout: 'anchor',
                        margin: '0 0 0 8',
                        items: [
                            {
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
                                                formAdminPerson.down('[name=imagePerson]').setRawValue(action.result['img']);
                                                thisObj.setValue(action.result['img']);
                                            },
                                            failure: function(form, action) {
                                                Ext.Msg.alert('Error', 'No se pudo subir la imagen');
                                            }
                                        });
                                    }
                                }
                            },
                            {
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
                            winAdminPerson.hide();
                        }}
                ]
            }]
    });
});
function showWinAdminPerson() {
    if (!winAdminPerson) {
        winAdminPerson = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Personal',
            iconCls: 'icon-person',
            resizable: false,
            width: 450,
            height: 545,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        formAdminPerson
                    ]
                }]
        });
    }
    onResetPerson();
    winAdminPerson.show();
}

function setActiveRecords(record) {
    formAdminPerson.activeRecord = record;
    if (record) {
        formAdminPerson.down('#update').enable();
        formAdminPerson.down('#create').disable();
        formAdminPerson.down('#delete').enable();
        formAdminPerson.getForm().loadRecord(record);
    } else {
        formAdminPerson.down('#update').disable();
        formAdminPerson.getForm().reset();
    }
}

function onUpdatePerson() {
    var active = formAdminPerson.activeRecord,
            form = formAdminPerson.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
   formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + 'sin_img.png');
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreatePerson() {
    var form = formAdminPerson.getForm();
    if (form.isValid()) {
        formAdminPerson.fireEvent('create', formAdminPerson, form.getValues());
        formAdminPerson.down('#update').disable();
        form.reset();
        gridStore.reload();
        formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + 'sin_img.png');
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente ');

    }
}

function onResetPerson() {
    setActiveRecords(null);
    formAdminPerson.down('#delete').disable();
    formAdminPerson.down('#create').enable();
    formAdminPerson.getForm().reset();
    formAdminPerson.getForm().reset();
     formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + 'sin_img.png');
}

function onDeletePerson() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar la Persona', function(choice) {
        if (choice === 'yes') {
//            var selection = gridAdminPerson.getView().getSelectionModel().getSelection()[0];
            if (selection) {
//                gridAdminPerson.store.remove(selection);
                //formAdminPerson.down('#delete').disable();
                formAdminPerson.down('#create').enable();
                 formAdminPerson.down('[name=labelImage]').setSrc('img/usuario/' + 'sin_img.png');
            }
        }
    });
}