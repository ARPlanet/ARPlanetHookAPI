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
    "data": "aes-256-cbc:7e66cb95984b1c4b:7WCwVnPGLmVtFvWtpRqUVr1mRk3xopIjG0+svJneHkhORIgDC9LDwGWoCoDw5gb8LMhfi9AYUx2Vf1rGCnzAyfTARYtFuWCxCN1gWNysv7AFc321w7A79aw3TRnc7bvUss3N8ae7ueOYgkG+WoKvIvXhmJrxt7z1l6CzNwhGtPNM1MwO5iJIwn7lDLIcbiFw7MGwLUkO9mGilp+VQmT0qlw+odS1/Xx1o+0YLpIN9ZWVKf/XGT+1pco6hk+qw2g6FrSoxemYNKUOD4S/A+gt5FHRPOOxakL6NhL7JM9tjRTA4MUxi8xq4bo2HGMJ+fIREGYTJ/yMcFLnD20cafW0YRNHxilNg560hjN1Egmy833FIZi9n19lPdiYlh9qM9hdouotGIMRSLU1g1tBRz54zlP1A+EZVnIG3u5DYRtOIhQbNakyCGRFhy03aV/Vy/RYtMHNV09RfRYkUf/EBm3CmqnyiG9NhkmRyoqSBJ/MQGzDuKDvr9oYJBp8JCH5gxC3mPE9UCTDFuQFZnraZKpUQVta4kp8YMZBkP0VOQ3OZb/rTvj3Lpi7v6mM9UsVAm/YDlD2H4SA4X3oQvdg4cgS4N6x3oL8+T+H4pul5HZjw32N75D307FxkJX9Q50cMWQcZS9Q2UqVXqwN7NptM91J8kOU6d/kqIJkXS0RG8d03bJ0ckGQkPa+lU7NCfTfiYCfWb/FrmfKEL9Zq8mSSFPXYpPeQ1H5OjDFlSx2E2/UUuJsueh+3L6/HAqL7je9W1iUfsexQB423qYHoy12s4KJUM0Gb3Lrj9n0EC2bJ/r587M=",
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
        "expire_at": 1619434718,
        "event_dbtype": "all#evnent#resource#info",
        "create_at": "2021-04-26T18:47:07+08:00",
        "upload": 0,
        "acl": "public-read",
        "product_id": "winkiss",
        "state": "state456",
        "updated_at": "2021-04-26T18:47:07+08:00",
        "request_id": "87409fb6-86d1-400f-92bd-336ef5840097",
        "uuid": "xxxx123",
        "event_id": "winkiss.3ihqhnuvP5msHn.1b1a86c8c373b78ea940d76a783de7fff54470d354443ec841d856ca3ca24f37",
        "project_id": "3ihqhnuvP5msHn",
        "final_url": "https://s3.ap-southeast-1.amazonaws.com/arplanetresource-private.arplanets.com/winkiss/3ihqhnuvP5msHn/78787878313233/87409fb6-86d1-400f-92bd-336ef5840097.jpeg"
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
{"expire_at":1619434718,"event_dbtype":"all#evnent#resource#info","create_at":"2021-04-26T18:47:07+08:00","upload":0,"acl":"public-read","product_id":"winkiss","state":"state456","updated_at":"2021-04-26T18:47:07+08:00","request_id":"87409fb6-86d1-400f-92bd-336ef5840097","uuid":"xxxx123","event_id":"winkiss.3ihqhnuvP5msHn.1b1a86c8c373b78ea940d76a783de7fff54470d354443ec841d856ca3ca24f37","project_id":"3ihqhnuvP5msHn","final_url":"https://s3.ap-southeast-1.amazonaws.com/arplanetresource-private.arplanets.com/winkiss/3ihqhnuvP5msHn/78787878313233/87409fb6-86d1-400f-92bd-336ef5840097.jpeg"}
~~~


### Step 5. 運用資料

解密完成後，你可以撰寫 Webhook 邏輯，觸發額外的行為，例如：
如果一開始帶入參數`uuid`與`state`給WINKISS，
WINKISS導轉後去驗證`uuid`與`state`的真實與可靠性與資源

## 測試工具

Winkiss Hook 提供一個 Webhook  Preview 的測試工具

- Demo: https://s3-ap-southeast-1.amazonaws.com/acer-resource.arplanets.com/winkiss-hook/index.html

