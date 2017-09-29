module.exports = {
  collectionList: collectionList,
}

function collectionList(){
  var list = {
    "ret": true,
    "errcode": 0,
    "errmsg": "",
    "ver": 1,
    "data": {
      "totalPage": 1,
      "pageData": [
        {
          "page": 1,
          "data": [
            {
              "collectId": 39,
              "collectUserId": 1,
              "collectWebId": 0,
              "collectTitle": "求信息学院老司机推荐个导师啊！！！",
              "collectUrl": "http://tieba.baidu.com/p/4984361208",
              "collectPubDate": "2017-05-24 16:10:57.0",
              "collectSite": "百度贴吧",
              "collectAuthor": "请叫我丶绿钻哥",
              "collectTopicId": 0,
              "collectSensibilities": 0
            }
          ]
        }
      ],
      "totalCount": 1
    }
  }
  return list;
}