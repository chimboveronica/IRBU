<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.'}";
} else {

    $consultaSql = "SELECT p.id_persona, p.cedula, p.nombres, 
		p.apellidos, p.id_genero, p.fecha_nacimiento, 
            p.correo, p.direccion, p.celular, p.imagen
            FROM irbudata.personas p";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();

    $objJson = "{data: [";

    while ($myrow = $result->fetch_assoc()) {
        $objJson .= "{"
                . "idPerson:" . $myrow["id_persona"] . ","
                . "documentPerson:'" . $myrow["cedula"] . "',"
                . "namePerson:'" . utf8_encode($myrow["nombres"]) . "',"
                . "surnamePerson:'" . utf8_encode($myrow["apellidos"]) . "',"
                . "idGenderPerson:" . $myrow["id_genero"] . ","
                . "dateOfBirthPerson:'" . utf8_encode($myrow["fecha_nacimiento"]) . "',"
                . "addressPerson:'" . utf8_encode($myrow["direccion"]) . "',"
                . "emailPerson:'" . utf8_encode($myrow["correo"]) . "',"
                . "cellPerson:'" . $myrow["celular"] . "',"
                . "imagePerson:'" . utf8_encode($myrow["imagen"]) . "},";
    }
    $objJson .= "]}";
    echo $objJson;
}