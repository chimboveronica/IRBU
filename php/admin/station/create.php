<?php

include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message:'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    echo $nombre;
    $existeSql = "SELECT nombre FROM irbudata.paradas WHERE nombre='$nombre'";

    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:false, message: 'La parada ya existe.',state: false}";
        } else {
            $insertSql = "INSERT INTO irbudata.paradas (nombre,direccion,lat,lon,referencia,dir_img) "
                    . "VALUES(?, ?, ?, ?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("ssssss", $nombre, $direccion, $latitud, $longitud, $referencia, $image);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message: 'Insertado correctamenta.',state: true}";
                }
                $stmt->close();
            } else {
                echo "{success:false, message: 'Problemas al actualizar en la tabla.',state: false}";
            }
        }
        $mysqli->close();
    } else {
        echo "{success:false, message: 'Problemas al actualizar en la tabla.',state: false}";
    }
}