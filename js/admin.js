/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

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
        Ext.apply(Ext.form.field.VTypes, {
        daterange: function(val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            return true;
        },
        daterangeText: 'Start date must be less than end date',
        placaValida: function(val, field) {
            var partes = val.split("");
            if (partes.length === 7) {
                if (!/^[F]{1}[A]{1}[C]{1}[T]{1}[U]{1}[R]{1}[A]{1}$/.test(val.toUpperCase())) {
                    return false;
                } else {
                    return true;
                }
                if (!/^[A-Z]{3}[0-9]{4}$/.test(val.toUpperCase())) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!/^[A-Z]{3}[0-9]{3}$/.test(val.toUpperCase())) {
                    return false;
                } else {
                    return true;
                }

            }
        },
        placaValidaText: 'Ingrese un numero de placa valido <br>\n\
                           Ej:(LAB3532) 3 letras 4 numeros',
        digitos: function(val, field) {
            if (!/^[0-9]{1,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        digitosnombresApeText: 'Solo carateres numéricos',
        nombresApe: function(val, field) {
            if (!/^[.A-Z.a-z.áéíóúñ()\s*]{1,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        nombresApeText: 'No se permite caracteres númericos.',
        password: function(val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Las Contraseñas no coinciden',
        cedulaValida: function(val, field) {
            if (val.length !== 10) {
                return false;
            }
            if (val.length === 10) {
                if (check_cedula(val)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        cedulaValidaText: 'Numero de Cedula Invalida',
        numeroTelefono: function(val, field) {
            var partes = val.split("");
            if (partes.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            } else {
                if (!/^[0]{1}[7]{1}[0-9]{7}$/.test(val)) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        numeroTelefonoText: 'Ingresar solo caracteres numéricos válidos <br>que empiezen con [09] movil tamaño de (10)dígitos<br> 0 [072] convencional tamaño de (9)dígitos ',
        emailNuevo: function(val, field) {
            if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return false;
            }
            return true;
        },
        emailNuevoText: 'Debe ingresar segun el formato kradac@kradac.com <br>sin caracteres especiales',
        campos: function(val, field) {
            if (!/^[-0-9.A-Z.a-z./áéíóúñÑ\s*]{2,45}$/.test(val)) {
                return false;

            }

            return true;
            Ext.Msg.alert('Error', 'Solo carateres alfa numéricos');
        },
        camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 45 carateres',
        usuario: function(val, field) {
            if (!/^[0-9.A-Z.a-z.áéíóúñÑ\s]{2,45}$/.test(val)) {
                return false;

            }

            return true;
            Ext.Msg.alert('Error', 'Solo carateres alfa numéricos');
        },
        usuarioText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 45 carateres',
        numeroChip: function(val, field) {
            if (!/^[-.0-9]{4,45}$/.test(val)) {
                return false;

            }
            return true;
            Ext.Msg.alert('Error', 'Solo carateres numéricos');
        },
        numeroChipText: 'Solo carateres numéricos<br> Tamaño min de 4 y un máx de 40 carateres',
//para direccion
        direccion: function(val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ()\s*]{2,150}$/.test(val)) {
                return false;
            }
            return true;
        },
        direccionText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 150 carateres',
//Metodo utilizado para controlar caracteres alfanuericos y el tamano del campo "Reg. Municipal"
//del archivo administracion de buses (vehicle.js)
        camposVehicleMax10: function(val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposVehicleMax10Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 10 carateres',
//Metodo utilizado para controlar caracteres alfanuericos y el tamano de los campos
//del archivo administracion de buses (vehicle.js) que requieren un tamano de entre 2 y 45 caracteres
        camposVehicleMax45: function(val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{5,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposVehicleMax45Text: 'Solo carateres alfa numéricos<br> Tamaño min de 5 y un máx de 45 carateres',
        camposAcronimo: function(val, field) {
            if (!/^[A-Z.a-z]{1}[-0-9.A-Z.a-z.áéíóúñ\s*]{3}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposAcronimoText: 'El primer caracter deberá ser una LETRA <br> Solo caracteres alfanumericas <br>  el tamaño deberá ser de 4 caracteres',
        camposEmpresa: function(val, field) {
            if (!/^[A-Z.a-z]{1}[-0-9.A-Z.a-z.áéíóúñ\s*]{3,30}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposEmpresaText: 'El primer caracter deberá ser una LETRA <br> Solo caracteres alfanumericas <br> tamaño minimo de 4 caracteres ',
        campos1: function(val, field) {
            if (!/^[-0-9.A-Z.a-z.áéíóúñ\s*]{2,80}$/.test(val)) {
                return false;
            }
            return true;
        },
        campos1Text: 'Solo carateres alfa numéricos<br> Tamaño min de 1 y un máx de 80 carateres',
        camposMin: function(val, field) {
            if (!/^[0-9A-Za-zñ\s*]{2,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposMinText: 'Solo carateres alfa numéricos<br> Tamaño min de 2 y un máx de 10 carateres',
//solo mayus
        mayus: function(val, field) {
            if (!/^[0-9A-Z]{1,5}$/.test(val)) {
                return false;
            }
            return true;
        },
        mayusText: 'Solo carateres Mayusculas',
//Para datos combos vehiculos y personas
        alphanum0: function(val, field) {
            if (!/^[0-9A-Za-záéíóúñ\s*]{3,80}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum0Text: 'Solo carateres alfa numéricos',
        alphanum1: function(val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ\s*]{3,30}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum1Text: 'Solo carateres alfa numéricos',
//para puntos
        puntos: function(val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ/\s*]{2,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        puntosText: 'Solo datos numéricos,mínimo 2 y máximo de 4 numeros',
///para rutas
        alphanum2: function(val, field) {
            if (!/^[0-9\s.A-Z.\sa-záéíóúñ.()-:\s*]{3,100}$/.test(val)) {
                return false;
            }
            return true;
        },
        alphanum2Text: 'Solo carateres alfa numéricos',
//para geocercas
        geo: function(val, field) {
            if (!/^[0-9]{2,4}$/.test(val)) {
                return false;
            }
            return true;
        },
        geoText: 'Solo carateres numéricos mínimo 2 y máximo 4 numeros',
        num1: function(val, field) {
            if (!/^[0-9]{3,4}$/.test(val)) {
                return false;
            }
            return true;
        },
        num1Texto: 'Solo carateres numéricos',
//para numeros 3-45
        num2: function(val, field) {
            if (!/^[0-9]{3,45}$/.test(val)) {
                return false;
            }
            return true;
        },
        num2Text: 'Solo carateres numéricos mínimo 3 y un máximo de 45',
        camposRegMun: function(val, field) {
            if (!/^[-0-9A-Za-z]{3,10}$/.test(val)) {
                return false;
            }
            return true;
        },
        camposRegMunText: 'Solo carateres alfa numéricos,y guiones <br> Tamaño min de 5 y un máx de 10 carateres'

    });
    
    
    
    
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
                                    },{
                                        text: 'Rutas',
                                        iconCls: 'icon-route',
                                        handler: showWinAdminRoute
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
