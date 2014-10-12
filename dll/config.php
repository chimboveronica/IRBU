<?php



function getConectionDb() {
    /* DATOS DE MI SERVIDOR */
//    $db_name = "kbusdb";
//    $db_host = "172.16.57.11";
//    $db_user = "chimboveronica";
//    $db_password = "chimboveronicades2";

    $db_name = "irbudata";
    $db_host = "localhost";
    $db_user = "root";
    $db_password = "";

    @$mysqli = new mysqli($db_host, $db_user, $db_password, $db_name);
    return ($mysqli->connect_errno) ? false : $mysqli;
}

function getEncryption($text) {
    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($text) . md5($salt)));
    return $encriptClave;
}

function allRows($result) {
    $vector = null;
    $pos = 0;

    while ($myrow = $result->fetch_row()) {
        $fila = "";
        for ($i = 0; $i < count($myrow); $i++) {
            $infoCampo = $result->fetch_field_direct($i);
            $fila[$infoCampo->name] = $myrow[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}
