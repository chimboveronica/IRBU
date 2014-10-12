<?php

include ('../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT RP.ID_PARADA,P.NOMBRE, LON,LAT,DIRECCION,REFERENCIA, DIR_IMG, RP.ORDEN
    FROM RUTA_PARADA RP, RUTAS R, PARADAS P
    WHERE RP.ID_RUTA = R.ID_RUTA
    AND RP.ID_PARADA = P.ID_PARADA";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $objJson = "{data: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{"
                    . "id:" . $myrow["ID_PARADA"] . ","
                    . "nombre:'" . $myrow["NOMBRE"] . "',"
                    . "lon:" . $myrow["LON"] . ","
                    . "lat:" . $myrow["LAT"] . ","
                    . "referencia:'" . utf8_encode($myrow["REFERENCIA"]) . "',"
                    . "direccion:'" . utf8_encode($myrow["DIRECCION"]) . "',"
                    . "dir_img:'" . $myrow["DIR_IMG"] . "',"
                    . "rp_orden:" . $myrow["ORDEN"] . "},";
        }

        $objJson .="]}";
        echo $objJson;
    } else {
        echo "{success:false, msg: 'No hay datos que obtener'}";
    }
}

  