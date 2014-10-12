var winAdminRoute;
var formAdminRoute;
var gridAdminRoute;
var drawRoute;

Ext.onReady(function() {
    Ext.define('DataRoute', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idRoute', type: 'int'},
            {name: 'codeRoute', type: 'string'},
            {name: 'routeRoute', type: 'string'},
            {name: 'lineRoute', type: 'int'},
            {name: 'timePenaltyRoute', type: 'date', dateFormat: 'H:i:s'},
            {name: 'iconRoute', type: 'string'},
            {name: 'colorRoute', type: 'string'},
            {name: 'distanciaRoute', type: 'number'},
            {name: 'verticesRoute', type: 'string'}
        ]
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataRoute',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/admin/route/read.php',
                create: 'php/admin/route/create.php',
                update: 'php/admin/route/update.php',
                destroy: 'php/admin/route/destroy.php'
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
                onResetRoute();
                Ext.example.msg("Mensaje", operation.getResultSet().message);
            }
        }
    });

    gridAdminRoute = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Cod. Ruta", width: 100, sortable: true, dataIndex: 'codeRoute', filter: {type: 'string'}, align: 'center'},
            {header: "Ruta", width: 200, sortable: true, dataIndex: 'routeRoute', filter: {type: 'string'}},
            {header: "Tiempo de Sanción", xtype: 'datecolumn', format: 'H:i:s', width: 150, sortable: true, dataIndex: 'timePenaltyRoute', align: 'center'},
            {header: "Distancia", width: 150, sortable: true, dataIndex: 'distanciaRoute', align: 'center'}
        ],
        stripeRows: true,
        region: 'west',
        width: '50%',
        title: 'Registros',
        features: [filters],
        tbar: [{
                xtype: 'button',
                iconCls: 'icon-excel',
                text: 'Exportar a Excel',
                handler: function() {

                    if (gridStore.getCount() > 0) {
                        if (getNavigator() === 'img/chrome.png') {
                            var a = document.createElement('a');
                            //getting data from our div that contains the HTML table
                            var data_type = 'data:application/vnd.ms-excel';
                            //var table_div = document.getElementById('exportar');
                            //var table_html = table_div.outerHTML.replace(/ /g, '%20');
                            var tiLetra = 'Calibri';
                            var table_div = "<meta charset='UTF-8'><body>" +
                                    "<font face='" + tiLetra + "'><table>" +
                                    "<tr><th colspan='7'>RUTAS" + "</th></tr>" +
                                    "<tr></tr>";
                            table_div += "<tr>";
                            table_div += "<th align=left>CODIGO DE RUTA</th>";
                            table_div += "<th align=left>NOMBRE DE LA RUTA </th>";
                            table_div += "<th align=left>LINEA</th>";
                            table_div += "<th align=left>DISTANCIA </th>";
                            table_div += "<th align=left>TIEMPO DE SANCION</th>";
                            table_div += "<th align=left>COLOR</th>";
                            table_div += "<th align=left>ICONO DE RUTA</th>";

                            table_div += "</tr>";
                            for (var i = 0; i < gridStore.data.length; i++) {

                                table_div += "<tr>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.codeRoute + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.routeRoute + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.lineRoute + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.distanciaRoute + "</td>";
                                table_div += "<td align=lef>" + Ext.Date.format(gridStore.data.items[i].data.timePenaltyRoute, 'H:i:s') + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.colorRoute + "</td>";
                                table_div += "<td align=lef>" + gridStore.data.items[i].data.iconRoute + "</td>";
                                table_div += "</tr>";
                            }
                            table_div += "</table></font></body>";
                            var table_html = table_div.replace(/ /g, '%20');
                            a.href = data_type + ', ' + table_html;
                            //setting the file name
                            a.download = 'Rutas' + '.xls';
                            //triggering the function
                            a.click();
                        } else {
                            Ext.MessageBox.show({
                                title: 'Error',
                                msg: '<center> El Servicio para este navegador no esta disponible <br> Use un navegador como Google Chrome </center>',
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            });

                        }
                    } else {
                        Ext.MessageBox.show({
                            title: 'Error...',
                            msg: 'No hay datos en la Lista a Exportar',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                }
            }],
        listeners: {
            selectionchange: function(thisObject, selected, eOpts) {
                if (selected.length > 0) {
                    setActiveRecordRuta(selected[0]);
                    formAdminRoute.down('[name=labelImage]').setSrc('img/' + selected[0].data.iconRoute);
                    formAdminRoute.down('[name=imageFile]').setRawValue(selected[0].data.iconRoute);

                    if (connectionMap()) {
                        lines.destroyFeatures();

                        drawLineAdminRoute(selected[0].data);
                        drawRoute = false;
                        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                        Ext.getCmp('btn-delete-route').enable();
                        Ext.getCmp('spl-duplicate-route').enable();
                        Ext.getCmp('btn-draw-route-by-point').enable();

                        Ext.example.msg('Mensaje', 'Ruta trazada correctamente en el Mapa.');
                    }
                } else {
                    formAdminRoute.down('#update').disable();
                    formAdminRoute.down('#create').enable();
                }
            }
        }
    });

    formAdminRoute = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar datos de la ruta',
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
        items: [{
                name: 'iconRoute',
                hidden: true
            }, {
                name: 'verticesRoute',
                hidden: true
            }, {
                fieldLabel: 'Código Ruta',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                name: 'codeRoute',
                vtype: 'mayus',
                allowBlank: false,
                emptyText: 'A, B, C, D, E,...',
                minLength: 1,
                maxLength: 5
            }, {
                fieldLabel: 'Nombre de Ruta',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                name: 'routeRoute',
                vtype: 'alphanum2',
                allowBlank: false,
                emptyText: 'Ingrese nombre de Ruta...',
                minLength: 2,
                maxLength: 100
            }, {
                xtype: 'numberfield',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                fieldLabel: 'Linea',
                name: 'lineRoute',
                allowBlank: false,
                emptyText: '1, 2, 3, 4, 5,...',
                minValue: 0,
                maxValue: 100
            }, {
                xtype: 'timefield',
                fieldLabel: 'Tiempo de sanción',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                name: 'timePenaltyRoute',
                allowBlank: false,
                format: 'H:i:s',
                invalidText: 'Formato ingresado incorrecto',
                value: '00:00:00',
                minValue: '00:00:00',
                maxValue: '00:59:00',
                emptyText: '00:02:00'
            }, {
                xtype: 'numberfield',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                fieldLabel: 'Distancia (Km)',
                name: 'distanciaRoute',
                allowBlank: false,
                minValue: 0,
                decimalPrecision: 2
            }, {
                fieldLabel: 'Color de Ruta',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                name: 'colorRoute',
                allowBlank: false,
                inputType: 'color',
                anchor: '55%'
            }, {
                xtype: 'filefield',
                afterLabelTextTpl: required,
                blankText: 'Este campo es obligatorio',
                name: 'imageFile',
                allowBlank: false,
                emptyText: "Máximo 2MB",
                fieldLabel: "Icono de Ruta",
                buttonConfig: {
                    iconCls: 'icon-upload',
                    text: '',
                    tooltip: 'Escoger imagen'
                },
                listeners: {
                    change: function(thisObj, value, eOpts) {
                        var form = formAdminRoute.getForm();
                        form.submit({
                            url: 'php/uploads/uploadPersonal.php',
                            success: function(form, action) {
                                formAdminRoute.down('[name=labelImage]').setSrc('img/' + action.result['img']);
                                formAdminRoute.down('[name=iconRoute]').setValue(action.result['img']);
                                thisObj.setRawValue(action.result['img']);
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
                src: 'img/bus.png',
                height: 25,
                border: 2,
                margin: '0 0 0 145',
                anchor: '50%',
                style: {
                    borderColor: '#157fcc',
                    borderStyle: 'solid'
                }
            }, {
                xtype: 'panel',
                layout: 'hbox',
                defaults: {
                    margin: '0 5 0 0'
                },
                items: [{
                        id: 'numberfield-point-route',
                        xtype: 'numberfield',
                        fieldLabel: 'Cant. Puntos',
                        afterLabelTextTpl: required,
                        disabled: true,
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
                            if (drawRoute === true) {
                                drawLine.activate();
                            } else {
                                modifyLine.activate();
                                modifyLine.activate();
                                finishDrawRoute.show();
                            }
                            winAdminRoute.hide();
                        }
                    }, {
                        id: 'btn-delete-route',
                        iconCls: 'icon-eraser',
                        tooltip: 'Eliminar Trazado de Ruta',
                        xtype: 'button',
                        disabled: true,
                        handler: function() {
                            if (connectionMap()) {
                                lines.destroyFeatures();
                                Ext.getCmp('numberfield-point-route').reset();
                                Ext.getCmp('btn-delete-route').disable();
                                Ext.getCmp('btn-draw-edit-route').setIconCls("icon-draw");
                                drawRoute = true;
                            }
                        }
                    }, {
                        id: 'btn-draw-route-by-point',
                        iconCls: 'icon-tree-point-control',
                        xtype: 'button',
                        disabled: true,
                        tooltip: 'Trazar en base a los puntos de la Ruta.',
                        handler: function() {
                            if (connectionMap()) {
                                var form = Ext.create('Ext.form.Panel');
                                form.getForm().submit({
                                    url: 'php/admin/route/getRouteByPoint.php',
                                    params: {
                                        idRoute: gridAdminRoute.getSelection()[0].data.id
                                    },
                                    failure: function(form, action) {
                                        Ext.MessageBox.show({
                                            title: 'Mensaje',
                                            msg: action.result.message,
                                            buttons: Ext.MessageBox.OK,
                                            icon: Ext.MessageBox.INFO
                                        });
                                    },
                                    success: function(form, action) {
                                        var resultado = action.result;
                                        lines.destroyFeatures();
                                        drawLineAdminRouteByPoint(resultado.dataLine, false);
                                        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                                        Ext.getCmp('btn-delete-route').enable();
                                        drawRoute = false;
                                    }
                                });
                            }
                        }
                    }, {
                        xtype: 'splitbutton',
                        id: 'spl-duplicate-route',
                        iconCls: 'icon-by-destination',
                        tooltip: 'Duplicar Trazado de Ruta',
                        menu: [{
                                xtype: 'panel',
                                layout: 'form',
                                items: [{
                                        xtype: 'combobox',
                                        id: 'cbx-duplicate-route',
                                        store: storeRoute,
                                        forceSelection: true,
                                        editable: false,
                                        valueField: 'id',
                                        displayField: 'text',
                                        queryMode: 'local',
                                        emptyText: 'Seleccionar Ruta...',
                                        listConfig: {
                                            minWidth: 300
                                        },
                                        listeners: {
                                            select: function(combo, records, eOpts, action) {
                                                if (connectionMap()) {
                                                    lines.destroyFeatures();
                                                    drawLineAdminRoute(gridStore.getById(records[0].id).data, false);
                                                    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                                                    Ext.getCmp('btn-delete-route').enable();
                                                    Ext.getCmp('btn-duplicate-route').enable();
                                                    Ext.getCmp('btn-invert-duplicate-route').enable();
                                                    Ext.getCmp('btn-invert-duplicate-point-route').enable();
                                                    drawRoute = false;
                                                }
                                            }
                                        }
                                    }],
                                dockedItems: [{
                                        xtype: 'toolbar',
                                        dock: 'bottom',
                                        ui: 'footer',
                                        items: [{
                                                id: 'btn-duplicate-route',
                                                iconCls: 'icon-tree-point-control',
                                                tooltip: 'Trazar en base a los puntos de la Ruta.',
                                                disabled: true,
                                                handler: function() {
                                                    if (connectionMap()) {
                                                        var form = Ext.create('Ext.form.Panel');
                                                        form.getForm().submit({
                                                            url: 'php/admin/route/getRouteByPoint.php',
                                                            params: {
                                                                idRoute: Ext.getCmp('cbx-duplicate-route').getValue()
                                                            },
                                                            failure: function(form, action) {
                                                                Ext.MessageBox.show({
                                                                    title: 'Mensaje',
                                                                    msg: action.result.message,
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO
                                                                });
                                                            },
                                                            success: function(form, action) {
                                                                var resultado = action.result;
                                                                lines.destroyFeatures();
                                                                drawLineAdminRouteByPoint(resultado.dataLine, false);
                                                                Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                                                                Ext.getCmp('btn-delete-route').enable();
                                                                drawRoute = false;
                                                            }
                                                        });
                                                    }
                                                }
                                            }, '->', {
                                                id: 'btn-invert-duplicate-route',
                                                iconCls: 'icon-invert',
                                                tooltip: 'Invertir Ruta seleccionada.',
                                                disabled: true,
                                                handler: function() {
                                                    if (connectionMap()) {
                                                        lines.destroyFeatures();
                                                        drawLineAdminRoute(gridStore.getById(Ext.getCmp('cbx-duplicate-route').getValue()).data, true);
                                                        Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                                                        Ext.getCmp('btn-delete-route').enable();
                                                        drawRoute = false;
                                                    }
                                                }
                                            }, {
                                                id: 'btn-invert-duplicate-point-route',
                                                iconCls: 'icon-invert-points',
                                                tooltip: 'Invertir Ruta seleccionada en base a los puntos.',
                                                disabled: true,
                                                handler: function() {
                                                    if (connectionMap()) {
                                                        var form = Ext.create('Ext.form.Panel');
                                                        form.getForm().submit({
                                                            url: 'php/admin/route/getRouteByPoint.php',
                                                            params: {
                                                                idRoute: Ext.getCmp('cbx-duplicate-route').getValue()
                                                            },
                                                            failure: function(form, action) {
                                                                Ext.MessageBox.show({
                                                                    title: 'Mensaje',
                                                                    msg: action.result.message,
                                                                    buttons: Ext.MessageBox.OK,
                                                                    icon: Ext.MessageBox.INFO
                                                                });
                                                            },
                                                            success: function(form, action) {
                                                                var resultado = action.result;
                                                                lines.destroyFeatures();
                                                                drawLineAdminRouteByPoint(resultado.dataLine, true);
                                                                Ext.getCmp('btn-draw-edit-route').setIconCls("icon-edit");
                                                                Ext.getCmp('btn-delete-route').enable();
                                                                drawRoute = false;
                                                            }
                                                        });
                                                    }
                                                }
                                            }]
                                    }]
                            }],
                        handler: function() {
                            this.showMenu();
                        }
                    }]
            }
        ],
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
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar Datos',
                        handler: onUpdataRoute
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateRoute
                    }, /*{
                     iconCls: 'icon-delete',
                     text: 'Eliminar',
                     disabled: true,
                     itemId: 'delete',
                     scope: this,
                     tooltip : 'Eliminar Ruta',
                     handler: onDeleteClickRuta
                     },*/{
                        iconCls: 'icon-reset',
                        tooltip: 'Limpiar Campos',
                        handler: onResetRoute
                    }, {
                        iconCls: 'icon-cancel',
                        tooltip: 'Cancelar',
                        handler: function() {
                            lines.destroyFeatures();
                            winAdminRoute.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminRoute() {
    if (!winAdminRoute) {
        winAdminRoute = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de Rutas',
            iconCls: 'icon-by-destination',
            resizable: false,
            width: 750,
            height: 475,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminRoute,
                        formAdminRoute
                    ]
                }],
            listeners: {
                close: function(panel, eOpts) {
                    if (connectionMap()) {
                        lines.destroyFeatures();
                    }
                }
            }
        });
    }
    onResetRoute();
    winAdminRoute.show();
}

function setActiveRecordRuta(record) {
    formAdminRoute.activeRecord = record;
    formAdminRoute.down('#update').enable();
    formAdminRoute.down('#create').disable();
    formAdminRoute.getForm().loadRecord(record);
}

function onUpdataRoute() {
    var listPoint = lines.features[0].geometry.getVertices();
    getDataRouteOfFeature(listPoint);

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

function onCreateRoute() {
    if (connectionMap()) {
        var listPoint = lines.features[0].geometry.getVertices();
        getDataRouteOfFeature(listPoint);
    }

    var form = formAdminRoute.getForm();
    if (form.isValid()) {
        formAdminRoute.fireEvent('create', formAdminRoute, form.getValues());
        formAdminRoute.down('#update').disable();
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos obligatorios.');
    }
}

function onResetRoute() {
    if (connectionMap()) {
        lines.destroyFeatures();
    }
    formAdminRoute.getForm().reset();
    gridAdminRoute.getView().deselect(gridAdminRoute.getSelection());

    Ext.getCmp('btn-draw-route-by-point').disable();
    Ext.getCmp('btn-delete-route').disable();
    Ext.getCmp('btn-duplicate-route').disable();
    Ext.getCmp('btn-invert-duplicate-route').disable();
    Ext.getCmp('btn-invert-duplicate-point-route').disable();
    Ext.getCmp('btn-draw-edit-route').setIconCls("icon-draw");
    drawRoute = true;
}

function onDeleteClickRuta() {
    var selection = gridAdminRoute.getView().getSelectionModel().getSelection()[0];
    if (selection) {
        gridAdminRoute.store.remove(selection);
        //formAdminRoute.down('#delete').disable();
    }
}
