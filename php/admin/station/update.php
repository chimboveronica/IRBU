<?php

include ('../../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message:'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    echo $nombre;
    $existeSql = "SELECT nombre FROM irbudata.paradas WHERE nombre='$nombre'";
    echo $id;
    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:false, message: 'La parada ya existe.',state: false}";
        } else {
            $insertSql = "update irbudata.paradas set nombre=?,direccion=? ,lat=? ,lon=? ,referencia=? ,dir_img=? where id_parada=?";
            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("ssssssi", $nombre, $direccion, $latitud, $longitud, $referencia, $image, $id);
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