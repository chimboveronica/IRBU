var panel1;
var winusuario;

Ext.onReady(function() {

    panel1 = Ext.create('Ext.form.Panel', {
        items: [
            {xtype: 'form',
                padding: '10 10 10 10',
//                bodyStyle: "background-image: url('img/user.gif'); background-repeat:no-repeat; width='10' height='10'",
                items: [
                    {
                        xtype: 'fieldset',
                        title: '<b>Logeo</b>',
                        items: [{
                                fieldLabel: 'Usuario',
                                xtype: 'textfield',
                                afterLabelTextTpl: required,
                                name: 'us',
                                emptyText: 'Ingresar Usuario',
                                allowBlank: false,
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Contraseña',
                                afterLabelTextTpl: required,
                                name: 'ps',
                                emptyText: 'Ingrese Contraseña',
                                allowBlank: false,
                            }]},
                ]}],
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

                            var form = panel1.getForm();
                            if (form.isValid()) {
                                form.submit({
                                    url: 'php/login/login.php',
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
});

function ventanaLogeo() {
    if (!winusuario) {
        winusuario = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Acceso al Sistema',
            iconCls: 'user',
            resizable: false,
            width: 350,
            height: 200,
            closeAction: 'hide',
            items: [panel1]
        });
    }
    panel1.getForm().reset();
    winusuario.show();
}