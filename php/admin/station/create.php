<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $existeSql = "SELECT nombre FROM paradas WHERE nombre='" . $json["nombre"] . "'";

    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:false, message: 'Ya existe la parada'}";
        } else {

            $insertSql = "INSERT INTO paradas (nombre,direccion,latitud,longitud,referencia,dir_img) "
                    . "VALUES(?, ?, ?, ?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $stmt->bind_param("ssddss", utf8_decode($json["nombre"]), utf8_decode($json["direccion"]), $json["latitud"], $json["longitud"], utf8_decode($json["referencia"]), utf8_decode($json["image"]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message: 'Parada registrada correctamente.'}";
                } else {
                    echo "{success:false, message: 'No se pudo registrar la Parada.'}";
                }
                $stmt->close();
            } else {
                echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
            }
        }
        $mysqli->close();
    } else {
        echo "{success:false, message: 'Problemas en la construcción de la consulta.'}";
    }
}