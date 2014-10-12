/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.Action',
    'Ext.tab.*',
    'Ext.button.*',
    'Ext.form.*',
    'Ext.layout.container.Card',
    'Ext.layout.container.Border',
    'Ext.ux.PreviewPlugin',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'Ext.ux.CheckColumn',
    'Ext.ux.Spotlight'
]);

Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();
    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [
            {
                xtype: 'label',
                html: '<iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1" frameborder="0"   width= "100" height="15" allowTransparency="true"></iframe>'
            }, '-', {
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/user.gif',
                text: 'Salir',
                handler: function() {
                    location.href = 'index.php';


                }}
        ]
    });
    var barraHerramientas = {
        id: 'content-panel',
        region: 'north', // this is what makes this panel into a region
        // within the containing layout
        layout: 'card',
        margins: '0 0 0 0',
        activeItem: 0,
        border: false,
        tbar: [{
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/buscar.png',
                text: 'Parada mas Cercana',
//            handler: function(){
//                capturarPuntoReferencia();
//            }
            }, '-', {
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/buscar1.png',
                text: 'Buscar ruta',
                handler: showWinsearchRoute
            }, '-', {
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/buscar2.png',
                text: 'Paradas por hora y sector',
                handler: showWinsearchDateRoute
            }, '-', {
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/limpiar.png',
                text: 'Limpiar Mapa',
//            handler: function(){
//                limpiarCapas();
//            }
            }, '-', {
                xtype: 'button',
                cls: 'x-btn-text-icon',
                icon: 'img/ayuda.png',
                text: 'Ayuda',
                handler: function() {
                    window.open("img/ayuda.pdf", "Ayuda KRADAC...");
                }
            }, '-', barraMenu]

    };



    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        deferreRender: false,
        activeTab: 0,
        items: [{
                layout: 'hbox',
                bodyStyle: {
                    background: '#add2ed'
                },
                items: [{
                        xtype: 'label',
                        html: '<a href="http://www.kradac.com" target="_blank"><img src="img/icon_kbus.png" width="40" height="40"></a>'
                    }, {
                        xtype: 'label',
                        padding: '15 5 5 5',
                        style: {
                            color: '#157fcc'
                        },
                        html: '<section id="panelNorte">' +
                                '<center><strong id="titulo">UTPL - IRBU</strong></center>' +
                                '<strong id="subtitulo">Bienvenid@ al Sistema: ' + person + '</strong>' +
                                '</section>'
                    }]
            },
            barraHerramientas]
    });





    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            panelMenu
                    , {
                        region: 'east',
                        xtype: 'toolbar',
                        vertical: true,
                        items: [{
                                iconCls: 'icon-admin',
                                text: 'Administración',
                                tooltip: 'Administración',
                                menu: [{
                                        text: 'Usuarios',
                                        iconCls: 'icon-person',
                                        handler: showWinAdminPerson
                                    },
                                    {
                                        text: 'Paradas',
                                        iconCls: 'icon-route',
                                        handler: ventanaParadas
                                    },
                                ]
                            }]
                    }, {
                region: 'center',
                frame: true,
                html: '<div id="map-canvas"><div>'
            }]
    });
});