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
    fields: ['id', 'lon', 'lat', 'referencia', 'direccion', 'dir_img', 'rp_orden']
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

var storeHorarios = Ext.create('Ext.data.JsonStore', {
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/combobox/comboboxHorarios.php',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: ['id', 'text']
});