var storeParadas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/getparadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img', 'rp_orden']
});
var storeParadas1 = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img']
});

var storeRutas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxRutas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text']
});


var storeHorariosRutas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxHorariosRutas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text']
});





var storeParadasAsignadas = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadasAsignadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img']
});
var storeParadasTotales = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxParadas.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'nombre', 'lon', 'lat', 'referencia', 'direccion', 'dir_img']
});