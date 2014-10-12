<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT id_usuario,cedula,nombres,apellidos,fecha_nacimiento,usuario,clave,imagen
            FROM irbudata.usuarios ";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idUsuario:" . $myrow["id_usuario"] . ","
                . "documentPerson:'" . $myrow["cedula"] . "',"
                . "namePerson:'" . utf8_encode($myrow["nombres"]) . "',"
                . "surnamePerson:'" . utf8_encode($myrow["apellidos"]) . "',"
                . "dateOfBirthPerson:'" . $myrow["fecha_nacimiento"] . "',"
                . "userPerson:'" . $myrow["usuario"] . "',"
                . "imagePerson:'" . $myrow["imagen"] . "',"
                . "passwordPerson:'" . $myrow["clave"] . "'},";
    }
    $objJson .= "]}";
    echo $objJson;
}

 