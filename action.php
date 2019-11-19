<?php
header('Content-Type: text/html; charset=utf-8');
setlocale(LC_ALL, 'en_US.UTF-8');

$inputFilename    = 'langs.csv';
$return = array();
$inputFile  = fopen($inputFilename, 'rt');

while (($row = fgetcsv($inputFile)) !== FALSE) {
    if($row[0] == 'English') continue;
    $return[] = $row;
}

echo json_encode($return);
