<?php
header('Content-type: application/json; charset=utf-8');
 
if (isset($_GET['callback'])) echo "{$_GET['callback']}(";
readfile("https://maps.googleapis.com/maps/api/place/search/json?{$_SERVER['QUERY_STRING']}");
if (isset($_GET['callback'])) echo ');';
?>
