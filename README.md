# Arplanet Webhook API

- [簡介](#簡介)
- [流程](#流程)
- [測試工具](#測試工具)

## 簡介

本文件將介紹 Arplanet Webhook 串接流程及方法。


## 流程

- [**Step 1. 設定網址**]
- [**Step 2. 訪問 API**]
- [**Step 3. 查詢ENVET內容**]
- [**Step 4. 解密ENVET內容**]
- [**Step 5. 運用資料**]

---

### Step 1. 設定網址

以下步驟將以 `Webhook URL` 做介紹，若想使用自訂感謝頁，可以直接前往 [測試工具](#測試工具) 段落。

首先，請在後台設定一個 `上傳檔案並設定導轉網址` 來接收我們的通知。

---

### Step 2. 訪問 API

- 每當有新的圖片上傳事件後後，我們會使用 Redirect 夾帶 `event_id`參數送至你所設定的 Webhook URL 網址。
- 你必須使用取得的 `secret key` 組合成 `Webhook API`，格式如下：
	- <https://resource-api.arplanets.com/webhook/{VERSION}/{EVENTID}>
- 版本號 (VERSION) 目前請使用 `v0`

#####  🧡 Webhook API 範例 🧡
~~~
https://resource-api.arplanets.com/webhook/v0/winkiss.leeson123.12309c35dbd0c50e10a1ef70cc4a9e605fafc67dd3a6b5d3fc8ad57fb429dad0
~~~

---

### Step 3. 查詢EVENT內容

使用HTTP GET訪問組合好的 `Webhook API` 可以取得該次 `事件內容`。

##### 👉 EVNET內容範例 👈
 使用HTTP GET的響應為一個JSON的格式
 如果此次拿到的資料是成功的，JSON的status格式則為 true
 並且不一定是每個專案都需要進行`資料加密`。
 
 要判斷專案的資料是有加密的狀態，
 則判斷JSON「`encrypted`」則會`存在`，並且為true。
 資料內容都會存在JSON的data中
 
【資料有加密】
~~~
{
    "status": "success",
    "comment": "0",
    "message": "",
    "data": "aes-256-cbc:48dab84b7b8bb064:x6QwQY+AnT6oUOVkLdDa3GGxtNBXVq3EukZVCmVCqeD54R4hEaRGID8M9bDOK+TYvlns/yhnL3wK5bNSK3Ir9+j6ZmPrE83q1T4jvC3sskxqTSPLwPxKwWqCduhoW+wf63xyiaiDhU0HaXqVTBnsIHqc78p25aEEeIZizUEI+kvBNK7EMecLxpqeAh0KfnWLLGe2r/Hw3vsUBj5GNzbXMknQCZI9tklyHVRx1fgDd6BSzaQ2bEl4/5K8jkcTmErUbke6YdgHfPnaYONkE0b1jeyy4olyRKNgIRC62Se5pVR/9Yz4Ko4/iQBgEk/YEkkaw5dP1HAVvC8IRrvn7I/xs4FylQS58GdVAMvMjKMFiBLdQdzYNytp5tDJbu22qLtraMnZNMJHoR76R8N4uYZxJOpX+rZrBqK8Ilfi1FDkKngmEf081Xq+SUFC1U+x3SgjiLZIyY88ZNPcpJ/YngDTyTf1b2Gphky/y8txjpdAVT1d+M6MmP620zNRsagTNwVokFnGXAO4gpQ9dQxYSbI+O5jIqAocDE2w+gzOKAopd8P0frcQ81GKTQYNVJTzTaoYoJtiLN1LYpgZ3WdPNav11OkWCSUyrTNYV6JDZHhUVVneUoTerPBVaUDULkwyS7yacpdbEZ2r0faznK6CcV2PgfNiKH5aawS/yqRr1A13bcBDcHls/67vxXDsZLxSqe37H1q4nz4zuZC8JqwhQfL8C+tn+ztoDYrEb3lVUxDUfQ4L6OtPVs0pEeWys5U4vaMSiJ23Fp+saqRP6pyQfb9+gCWk7ZITCOC3bDyHIGauUf0=",
    "encrypted": true
}
~~~
【資料無加密】
~~~
{
    "status": "success",
    "comment": "0",
    "message": "",
    "data": {
        "updated_at": "2021-04-23T14:45:06+08:00",
        "expire_at": 1619160922,
        "event_dbtype": "all#evnent#resource#info",
        "create_at": "2021-04-23T14:45:06+08:00",
        "event_id": "winkiss.leeson123.542fd19433cbdf249e7aa0cd6cbbb886e1a907d44d6ec91132981b4b06885408",
        "event_data": {
            "acl": "public-read",
            "state": "state456",
            "final_url": "https://s3.ap-southeast-1.amazonaws.com/arplanetresource-private.arplanets.com/winkiss/leeson123/78787878313233/53c6bf4b-77e7-4a53-8391-b105a4be9210.jpeg",
            "request_id": "53c6bf4b-77e7-4a53-8391-b105a4be9210",
            "uuid": "xxxx123",
            "upload": 0
        },
        "project_id": "leeson123",
        "product_id": "winkiss"
    }
}
~~~
---

### Step 4. 解密EVENT內容
如果資料是有加密的，
data2的格式採用如下`{ALG}:{IV}:{ENCRYTED TEXT}`
`{ALG}`代表加密使用的算法，`{IV}`是加密的初始向量，`{ENCRYTED TEXT}`則是加密的資料
剛剛取得的 `加密內容`，必須經過以下步驟進行解密:

- 透過`splite切割字串`，依據「`:`」的條件，獲得一個長度為3的字串陣列
- 分別取得`{ALG}` , `{IV}` , `{ENCRYTED TEXT}`
- 透過以下個平台的語言進行解密

我們目前使用 `AES-256-CBC` (pkcs7 padding) 方式加密，所以請務必使用 `AES-256-CBC`  進行解密，其他的解密方式，無法解出正確的資訊，以下是幾種語言的解密示範：

- [Javascript](./decrypt/decrypt.html)
	- 範例使用 [crypto-js](https://github.com/brix/crypto-js)
- [PHP](./decrypt/decrypt.php)
	- 範例使用 [openssl_decrypt](http://php.net/manual/en/function.openssl-decrypt.php)
- [NodeJs](./decrypt/decrypt.js)
	- 範例使用 [crypto](https://nodejs.org/api/crypto.html)


##### 👉 解密後範例 👈

~~~json
{"status":"success","comment":"0","message":"","data":{"key":"c676a3d159f21d566a2b39b99b1d7159","data":"aes-256-cbc:d7eadfe14b1409c9:XkwnZn/xBMK5v6YtP/z+MtMisSXEq60Cz5HWNfDkMIsrdy4NJNOJInG2kNZw8yuMYOuNqleSRAUcKnGWMG6WCBlaYq6bFK5SonlipzUWhQGnQEj0ZTexzIBYmzc67kx3b4ZmSFWa8CtfldsovDHLDhtectJQg3615J1AjXKYIl+6flHrWRjQT6YEFIN+GMOProrKmByLakfVBw1NMku8xHEXjDA4WGZXVjyaou/x1oZUKbgbTXgvfEcb4rYQN/dlZYKao+bcDK6rh0NtWVT1Wev3Qz1K6CBammWByC99MhX/DbHZOhO2EMSyWR9EmdZMvbBjKNN/LUQwR+8GKv1qZ5Pcm4PCKup8ASA4iPrt+5+76uyOU/Fyj4DF2Nh7nbvhhqGVLMQu78+bpsNZ28etzT5QzkFRuqce8o0aYaZ2/nUFPQGB6GsjrIrDTrPyHmT0UiIClzSKje+t98WBBsu+m+F31xamZ4W21nQJXo3tTAMEec1g+FX9rP6QwHF4SY7/SX6NxscTpfjCZ76JK9LTzgK/1LUR9oVEAAwNWA0XRrX9vPHCNRlf+/p4HRBoOyPQX3kHCUL0pOKd8Zuygwnru+EX+B/R5WuYYrthcNL26pl+Jo7qRqjIw5CbAOm2lKlfZXZMmfyPdxst/h44Qu+mEoHfa3iCQ6Kcwm0ArPWY0Sj4DsiKzOc9cOarjf0f+kOlXfILDSiq3gdcNTdb+2VaTmse9/GZC2evZ8wcYmpOUCmcTfEZd2jfAoV/ehEExuxi5e6oiU+8it0ugOh1RijAi9GoQA258jHxTkiyGpAl8U5c9Jc9uz18UxjSNBC1fMd1WuyZU6VpsRUpdeELMePjaw==","decryptText":"{\"updated_at\":\"2021-04-23T15:00:11+08:00\",\"expire_at\":1619161826,\"event_dbtype\":\"all#evnent#resource#info\",\"create_at\":\"2021-04-23T15:00:11+08:00\",\"event_id\":\"winkiss.leeson123.3df376e155b207f18a267e29118e364339144a08b50a0dfce5974b6afdc853c8\",\"event_data\":{\"acl\":\"public-read\",\"state\":\"st123456\",\"final_url\":\"https://s3.ap-southeast-1.amazonaws.com/arplanetresource-private.arplanets.com/winkiss/leeson123/746573742d746573742d3132333435363738/8f1d5d57-183c-4ccb-a6b7-64506fd9805d.png\",\"request_id\":\"8f1d5d57-183c-4ccb-a6b7-64506fd9805d\",\"uuid\":\"test-test-12345678\",\"upload\":0},\"project_id\":\"leeson123\",\"product_id\":\"winkiss\"}"}}
~~~


### Step 5. 運用資料

解密完成後，你可以撰寫 Webhook 邏輯，觸發額外的行為，例如：
如果一開始帶入參數`uuid`與`state`給WINKISS，
WINKISS導轉後去驗證`uuid`與`state`的真實與可靠性與資源

## 測試工具

Winkiss Hook 提供一個 Webhook  Preview 的測試工具

- Demo: https://s3-ap-southeast-1.amazonaws.com/acer-resource.arplanets.com/winkiss-hook/index.html

