<?php
//
include("php/login/isLogin.php");
if (isset($_SESSION["USUARIO"])) {
    $rutaPrincipal = $_SESSION["NAMESESION"];
//      header("Location: $rutaPrincipal");
}
?>
<html>
    <head>
        <title>IRBU</title>

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="shortcut icon" href="img/icon_kbus.png" type="image/x-icon">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="css/data-view.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">

        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/options-toolbar.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>

        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3&sensor=false"></script>
        <script type="text/javascript" src="js/publico.js"></script>
        <script type="text/javascript" src="js/inicioSesion.js"></script>
        <script src="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=drawing"></script>

        <script type="text/javascript" src="js/menu/searchRoute.js"></script>
        <script type="text/javascript" src="js/admin/ventana.js"></script>
        <script type="text/javascript" src="js/menu/searchDateRoute.js"></script>
        <script type="text/javascript" src="js/stores.js"></script>
        <script type="text/javascript" src="js/google-maps.js"></script>
    </head>
    <body>
    </body>
</html>
