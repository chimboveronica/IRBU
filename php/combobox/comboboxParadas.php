<?php

include ('../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_parada,direccion,lat,lon,referencia,dir_img,nombre FROM irbudata.paradas";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["id_parada"] . ","
                    . "direccion:'" . $myrow["direccion"] . "',"
                    . "lat:" . $myrow["lat"] . ","
                    . "lon:" . $myrow["lon"] . ","
                    . "referencia:'" . $myrow["referencia"] . "',"
                    . "dir_img:'" . $myrow["dir_img"] . "',"
                    . "nombre:'" . $myrow["nombre"] . "'},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

  