<?php

// Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
    session_start();
} else {
    $rutaPrincipal = "index.php";

// Comprobar si esta logueado
    if (
            !isset($_SESSION["USUARIO"]) ||
            !isset($_SESSION["SESION"])) {
    header("Location: $rutaPrincipal");
        exit();
    }
}
