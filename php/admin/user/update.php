<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {
    $requestBody = file_get_contents('php://input');
    $json = json_decode($requestBody, true);
    $setCedula = $setNombres = $setApellidos = $setUsuario = $setFechaNacimiento = $setImagen="";
    if (isset($json["cedula"])){$setCedula = "cedula=" . $json["cedula"] . ",";}
    if (isset($json["nombres"])){$setNombres = "nombres=" . $json["nombres"] . ",";}
    if (isset($json["apellidos"])){$setApellidos = "apellidos=" . $json["apellidos"] . ",";}
    if (isset($json["usuario"])){$setUsuario = "usuario='" . utf8_decode($json["usuario"]) . "',";}
    if (isset($json["fecha_nacimiento"])){$setFechaNacimiento = "fecha_nacimiento='" . utf8_decode($json["fecha_nacimiento"]) . "',";}
    if (isset($json["imagen"])){$setImagen = "imagen='" . utf8_decode($json["imagen"]) . "',";}
     if (isset($json["clave"])) {
        $partes = $json["clave"];
        $clave = $partes[0];
        $salt = "KR@D@C";
        $encriptClave = md5(md5(md5($clave) . md5($salt)));
        $setClave = "clave='$encriptClave',";
        $consultaPassSql = "select id_usuario from usuarios where clave = '" .  $encriptClave . "' and id_usuario = ". $json["id"];
        $resultPass = $mysqli->query($consultaPassSql);
        if ($resultPass->num_rows > 0) {
            $setPass = "";
        } else {
            $setPass = "clave='" . $encriptClave . "',";
        }
    }
    $setId = "id_usuario = " . $json["id"];
    if ($setUsuario != "") {
        $existeSql = "select usuario from irbudata.usuarios where usuario='" . $json["usuario"] . "'";
        $result = $mysqli->query($existeSql);
        if ($result->num_rows > 0) {
            echo "{success:false, message:'El Usuario ya se encuentra en uso por otra persona.',state: true}";
        } else {
         $updateSql = "UPDATE irbudata.usuarios 
            SET $setNombres$setApellidos$setId
            WHERE id_usuario = ?";
            $stmt = $mysqli->prepare($updateSql);
            if ($stmt) {
                $stmt->bind_param("i", $json["id"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
    } else {
        $updateSql = "UPDATE irbudata.usuarios 
            SET $setNombres$setApellidos$setId
            WHERE id_usuario = ?";
        $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i", $json["id"]);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos actualizados correctamente.',state: false}";
            } else {
                echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
        }
    }
    $mysqli->close();
}