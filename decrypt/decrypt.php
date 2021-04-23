<?php
define('OPENSSL_RAW_DATA', 1);
$data = $eventData;   //格式 {alg}::{encrypted}
$tmpData       = explode(":", $data); //分離iv跟加密內容
$alg         = $tmpData[0]; //取得alg
$iv         = $tmpData[1]; //取得iv
$secretKey ="";
$ciphertext = base64_decode($tmpData[2]);//解開加密內文
$finalDataString = openssl_decrypt($ciphertext, $alg, $secretKey, OPENSSL_RAW_DATA, $iv); //解密
$finalDataObj = json_decode($finalDataString);//最終資料
