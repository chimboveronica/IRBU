var winAdminUser;
var formAdminUser;
var gridAdminUser;

Ext.onReady(function() {
    Ext.define('DataUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUser', type: 'int'},
            {name: 'idRolUser', type: 'int'},
            {name: 'idCompanyUser', type: 'int'},
            {name: 'idPersonUser', type: 'int'},
            {name: 'userUser', type: 'string'},
            {name: 'passwordUser', type: 'string'},
            {name: 'activeUser', type: 'int'},
            {name: 'documentPersonUser', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataUser',
        proxy: {
            type: 'ajax',
            api: {
//                read: 'php/admin/user/read.php',
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
                onResetUser();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    gridAdminUser = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        tbar: [
//            {
//                xtype: 'button',
//                iconCls: 'icon-excel',
//                text: 'Exportar a Excel',
//                handler: function() {
//
//                    if (gridStore.getCount() > 0) {
//                        if (getNavigator() === 'img/chrome.png') {
//                            var a = document.createElement('a');
//                            //getting data from our div that contains the HTML table
//                            var data_type = 'data:application/vnd.ms-excel';
//                            //var table_div = document.getElementById('exportar');
//                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
//                            var tiLetra = 'Calibri';
//                            var table_div = "<meta charset='UTF-2'><body>" +
//                                    "<font face='" + tiLetra + "'><table>" +
//                                    "<tr><th colspan='7'>USUARIOS" + "</th></tr>" +
//                                    "<tr></tr>";
//                            table_div += "<tr>";
//                            table_div += "<th align=left>CEDULA</th>";
//                            table_div += "<th align=left>PERSONA</th>";
//                            table_div += "<th align=left>USUARIO</th>";
//                            table_div += "<th align=left>ROL DE USUARIO</th>";
//                            table_div += "<th align=left>EMPRESA</th>";
//                            table_div += "<th align=left>ESTADO</th>";
//                            table_div += "</tr>";
//                            for (var i = 0; i < gridStore.data.length; i++) {
//                                table_div += "<tr>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.documentPersonUser + "</td>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.personUser + "</td>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.userUser + "</td>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.rolUser, +"</td>";
//                                table_div += "<td align=lef>" + formatCompany(gridStore.data.items[i].data.idCompanyUser) + "</td>";
//                                table_div += "<td align=lef>" + gridStore.data.items[i].data.activeUser + "</td>";
//                                table_div += "</tr>";
//                            }
//                            table_div += "</table></font></body>";
//                            var table_html = table_div.replace(/ /g, '%20');
//                            a.href = data_type + ', ' + table_html;
//                            //setting the file name
//                            a.download = 'Usuarios' + '.xls';
//                            //triggering the function
//                            a.click();
//                        } else {
//                            Ext.MessageBox.show({
//                                title: 'Error',
//                                msg: '<center> El Servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
//                                buttons: Ext.MessageBox.OK,
//                                icon: Ext.MessageBox.ERROR
//                            });
//
//                        }
//                    } else {
//                        Ext.MessageBox.show({
//                            title: 'Error...',
//                            msg: 'No hay datos en la Lista a Exportar',
//                            buttons: Ext.MessageBox.OK,
//                            icon: Ext.MessageBox.ERROR
//                        });
//                    }
//                }
//            }
            
            , {
                text: '<b>Habilitar</b>',
                iconCls: 'icon-lock',
                itemId: 'habilitar',
                tooltip: 'Habilitar el acceso al Sistema.',
                disabled: true,
                handler: function() {
                    gridAdminUser.getSelection()[0].set('activeUser', 1);
                }
            }, {
                itemId: 'deshabilitar',
                tooltip: 'Bloquear el acceso al Sistema.',
                text: '<b>Bloquear</b>',
                iconCls: 'icon-unlock',
                disabled: true,
                handler: function() {
                    gridAdminUser.getSelection()[0].set('activeUser', 0);
                }
            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Cédula", width: 100, sortable: true, dataIndex: 'documentPersonUser', filter: {type: 'string'}},
            {header: "Persona", width: 200, sortable: true, dataIndex: 'idPersonUser', filter: {type: 'string'}},
            {header: "Usuario", width: 125, sortable: true, dataIndex: 'userUser', filter: {type: 'string'}},
        ],
        stripeRows: true,
        width: '55%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
//        features: [filters],
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    setActiveRecordUser(selected[0]);
                    if (selected[0].get('activeUser') === 1) {
                        gridAdminUser.down('#deshabilitar').enable();
                        gridAdminUser.down('#habilitar').disable();
                    } else {
                        gridAdminUser.down('#habilitar').enable();
                        gridAdminUser.down('#deshabilitar').disable();
                    }
                } else {
                    gridAdminUser.down('#habilitar').disable();
                    gridAdminUser.down('#deshabilitar').disable();
                    formAdminUser.down('#update').disable();
                    formAdminUser.down('#create').enable();
                }
            }
        }
    });

    formAdminUser = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos del Usuario',
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
        items: [ {
                xtype: 'combobox',
                fieldLabel: 'Persona',
                afterLabelTextTpl: required,
                id: 'idPersonUser',
                name: 'idPersonUser',
                forceSelection: true,
//                store: storePerson,
                valueField: 'id',
                displayField: 'textDocument',
                queryMode: 'local',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Seleccionar Opción...',
                listConfig: {
                    minWidth: 320
                }
            },  {
                fieldLabel: 'Usuario',
                afterLabelTextTpl: required,
                name: 'userUser',
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
                            {boxLabel: 'No', name: 'rbpass', inputValue: 1, checked: true},
                            {boxLabel: 'Si', name: 'rbpass', inputValue: 2}
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
                        name: 'passwordUser',
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
                        name: 'passwordUser',
                        allowBlank: false,
                        disabled: true,
                        blankText: 'Este campo es obligatorio',
                        inputType: 'password',
                        emptyText: 'Ingresar Contraseña Nuevamente...',
                        vtype: 'password',
                        initialPassField: 'pass'
                    }]
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
                items: [{
                        iconCls: 'icon-person',
                        tooltip: 'Ingresar Nueva Persona',
                        handler: showWinAdminPerson
                    }, '->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar',
                        handler: onUpdateUser
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateUser
                    }, /*{
                     iconCls: 'icon-delete',
                     disabled: true,
                     itemId: 'delete',
                     tooltip: 'Eliminar',
                     handler: onDeleteUser
                     }, */{
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetUser
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function() {
                            winAdminUser.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminUser() {
    if (!winAdminUser) {
        winAdminUser = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Usuarios',
            iconCls: 'icon-user',
            resizable: false,
            width: 790,
            height: 400,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminUser,
                        formAdminUser
                    ]
                }]
        });
    }
    onResetUser();
    winAdminUser.show();
}

function setActiveRecordUser(record) {
    formAdminUser.activeRecord = record;
    formAdminUser.down('#update').enable();
    formAdminUser.down('#create').disable();
    formAdminUser.getForm().loadRecord(record);
}

function onUpdateUser() {
    var active = formAdminUser.activeRecord,
            form = formAdminUser.getForm();
    if (!active) {
        return;
    }
    if (form.isValid()) {
        form.updateRecord(active);
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onCreateUser() {
    var form = formAdminUser.getForm();
    if (form.isValid()) {
        formAdminUser.fireEvent('create', formAdminUser, form.getValues());
        formAdminUser.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetUser() {
    formAdminUser.getForm().reset();
    gridAdminUser.getView().deselect(gridAdminUser.getSelection());
    //formAdminUser.down('#delete').disable();
}

function onDeleteUser() {
    Ext.MessageBox.confirm('Atención!', 'Desea Eliminar el Usuario', function(choice) {
        if (choice === 'yes') {
            var selection = gridAdminUser.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminUser.store.remove(selection);
                formAdminUser.down('#update').disable();
                //formAdminUser.down('#delete').disable();
                formAdminUser.down('#create').enable();
            }
        }
    });
}