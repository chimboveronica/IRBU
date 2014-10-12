<?php

include ('../dll/config.php');
extract($_POST);
if (!$mysqli = getConectionDb()) {
    echo "{success:false, msg: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {


    if ($tipo != '') {
        $consultaSql = "SELECT RP.ID_PARADA, LON,LAT,DIRECCION,REFERENCIA, DIR_IMG, RP.ORDEN
    FROM RUTA_PARADA RP, RUTAS R, PARADAS P
    WHERE RP.ID_RUTA = R.ID_RUTA
    AND RP.ID_PARADA = P.ID_PARADA 
    AND RP.ID_RUTA='$id_ruta' AND R.TIPO = '$tipo'";
    } else {
        $consultaSql = "SELECT RP.ID_PARADA, LON,LAT,DIRECCION,REFERENCIA, DIR_IMG, RP.ORDEN
    FROM RUTA_PARADA RP, RUTAS R, PARADAS P
    WHERE RP.ID_RUTA = R.ID_RUTA
    AND RP.ID_PARADA = P.ID_PARADA 
    AND RP.ID_RUTA='1' AND R.TIPO = '1'";
    }


    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    if ($result->num_rows > 0) {
        $json = "data: [";
        while ($myrow = $result->fetch_assoc()) {
            $json .= "{"
                    . "id:" . $myrow["ID_PARADA"] . ","
                    . "lon:" . $myrow["LON"] . ","
                    . "lat:" . $myrow["LAT"] . ","
                    . "referencia:'" . utf8_encode($myrow["REFERENCIA"]) . "',"
                    . "direccion:'" . utf8_encode($myrow["DIRECCION"]) . "',"
                    . "dir_img:'" . $myrow["DIR_IMG"] . "',"
                    . "rp_orden:" . $myrow["ORDEN"] . ""
                    . "},";
        }
        $json .="]";

        echo "{success: true, $json}";
    } else {
        echo "{failure: true,,message: 'No hay datos que obtener'}";
    }
}

  