<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $consultaSql = "SELECT id_ruta,tipo,nombre FROM irbudata.rutas";

    $result = $mysqli->query($consultaSql);

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $idRoute = $myrow["id_ruta"];
        $consultaLineSql = "select pr.orden, pr.latitud, pr.longitud, r.color "
                . "from linea_rutas pr, rutas r "
                . "where pr.id_ruta = r.id_ruta "
                . "and pr.id_ruta = $idRoute "
                . "order by pr.orden";

        $resultLine = $mysqli->query($consultaLineSql);

        $verticesRoute = "";
        if ($resultLine->num_rows > 0) {
            while ($myrowline = $resultLine->fetch_assoc()) {
                $verticesRoute .= $myrowline["latitud"] . "," . $myrowline["longitud"] . ";";
            }
        }

        $objJson .= "{"
                . "idRoute:" .$myrow["id_ruta"] . ","
                . "tipoRoute:'" . $myrow["tipo"] . "',"
                . "nombreRoute:'" . utf8_encode($myrow["nombre"]) . "',"
                . "verticesRoute:'" . substr($verticesRoute, 0, -1) . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
    $mysqli->close();
}