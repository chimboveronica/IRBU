<?php

include ('../../dll/config.php');
extract($_POST);

if (!$mysqli = getConectionDb()) {
    $Error = "Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.";
    echo "<script>alert('$Error');</script>";
    echo "<script>location.href='../../index.php'</script>";
} else {
    $salt = "KR@D@C";
    $encriptClave = md5(md5(md5($ps) . md5($salt)));

    $consultaSql = "SELECT id_usuario,cedula,usuario,clave,nombres,apellidos,imagen FROM irbudata.usuarios where usuario =? and clave = ?";

    /* crear una sentencia preparada */
    $stmt = $mysqli->prepare($consultaSql);
    if ($stmt) {
        /* ligar parámetros para marcadores */
        $stmt->bind_param("ss", $us, $encriptClave);
        /* ejecutar la consulta */
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $myrow = $result->fetch_assoc();
//
            // Deteccion de la ip y del proxy
            if (isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"])) {
                $ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
                $array = split(",", $ip);
                $host = @gethostbyaddr($ip_proxy);
                $ip_proxy = $HTTP_SERVER_VARS["REMOTE_ADDR"];
            } else {
                $ip = $_SERVER['REMOTE_ADDR'];
                $host = @gethostbyaddr($ip);
            }

            $idUser = $myrow["id_usuario"];
            //$fecha = @date("Y-m-d");
            //$hora = @date("H:i:s"

            $consultaSql = "insert into accesos (ip, host, id_usuario) "
                    . "values (?, ?, ?) ";
            $stmt = $mysqli->prepare($consultaSql);

            if ($stmt) {
                $stmt->bind_param("ssi", $ip, $host, $idUser);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {

                    session_start();

                    $_SESSION["IDUSUARIO"] = $myrow["id_usuario"];
                    $_SESSION["USUARIO"] = utf8_encode($myrow["usuario"]);
                    $_SESSION["PERSON"] = utf8_encode($myrow["nombres"] . " " . $myrow["apellidos"]);
                    $_SESSION["IMAGEN"] = utf8_encode($myrow["imagen"]);
                    $_SESSION["SESION"] = true;


                    $_SESSION["NAMESESION"] = "index_admin.php";
                    //echo "<script type='text/javascript'>location.href='../../index_admin.php'</script>";
                    echo "{success: true}";
                } else {
                    echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
                }
            } else {
                $Error = utf8_decode("Problemas en la construcción de la consulta.");
                echo "<script>alert('$Error');</script>";
                echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
            }
        } else {
            $Error = utf8_decode("Usuario o Contraseña Incorrectas");
            echo "<script>alert('$Error');</script>";
            echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
        }
        $stmt->close();
    } else {
        $Error = utf8_decode("Problemas en la construcción de la consulta.");
        echo "<script>alert('$Error');</script>";
        echo "{failure: true, msg: 'Problemas al Obtener los  Datos'}";
    }

    $mysqli->close();
}
