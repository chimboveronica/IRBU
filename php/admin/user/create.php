<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);

    $existeSql = "SELECT usuario FROM usuarios WHERE usuario='" . $json["userPerson"] . "'";

    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:false, message:'El Usuario ya se encuentra registrado.'}";
        } else {

            $insertSql = "INSERT INTO usuarios (cedula,nombres,apellidos,usuario,clave,fecha_nacimiento,imagen)"
                    . "VALUES(?, ?, ?, ?, ?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $dataPass = explode(",", utf8_decode($json["passwordPerson"]));
                $stmt->bind_param("sssssss", $json["documentPerson"], utf8_decode($json["namePerson"]), utf8_decode($json["surnamePerson"]), utf8_decode($json["userPerson"]), getEncryption($dataPass[0]), $json["dateOfBirthPerson"], utf8_decode($json["imagePerson"]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Usuario registrado correctamente.'}";
                } else {
                    echo "{success:false, message: 'No se pudo registrar el Usuario.'}";
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