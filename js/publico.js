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
var filters = {
    ftype: 'filters',
    // encode and local configuration options defined previously for easier reuse
    encode: false, // json encode the filter query
    local: true, // defaults to false (remote filtering)

    // Filters are most naturally placed in the column definition, but can also be
    // added here.
    filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
};
Ext.onReady(function() {
    Ext.tip.QuickTipManager.init();


    var menu = Ext.create('Ext.button.Button', {
        text: 'Menu',
        iconCls: 'icon-menu',
        menu: [
            {
                cls: 'x-btn-text-icon',
                icon: 'img/buscar.png',
                text: 'Parada mas Cercana',
                handler: function() {
                    dibujarParadasMasCercanas();
                }

            }, '-', {
                cls: 'x-btn-text-icon',
                icon: 'img/buscar1.png',
                text: 'Buscar ruta',
                handler: showWinsearchRoute
            }, '-', {
                cls: 'x-btn-text-icon',
                icon: 'img/buscar2.png',
                text: 'Paradas por horarios',
                handler: showWinsearchDateRoute
            }, '-', {
                cls: 'x-btn-text-icon',
                icon: 'img/limpiar.png',
                text: 'Limpiar Mapa',
//            handler: function(){
//                limpiarCapas();
//            }
            }, '-', {
                cls: 'x-btn-text-icon',
                icon: 'img/ayuda.png',
                text: 'Ayuda',
                handler: function() {
                    window.open("img/ayuda.pdf", "Ayuda KRADAC...");
                }
            }
        ]
    });
    var iniciarSesion = Ext.create('Ext.button.Button', {
        icon: 'img/user.gif',
        text: 'Iniciar Sesión',
        handler: ventanaLogeo,
        scope: this,
    });


    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [menu, iniciarSesion]});

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
                                '<strong id="subtitulo">Bienvenid@ al Sistema: ' + '</strong>' +
                                '</section>'
                    }]
            },
            barraMenu]
    });


    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [
            panelMenu
                    , {
                        region: 'center',
                        frame: true,
                        html: '<div id="map-canvas"><div>'
                    }]
    });
});