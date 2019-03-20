const kintone = require('kintone-nodejs-sdk');
const line = require('@line/bot-sdk');

const kin_common = {
  url: process.env.KINTONE_DOMAIN,
  apiToken: process.env.KINTONE_APITOKEN,
  appId: process.env.KINTONE_APPID,
  fCode1: 'line_id',
  fCode2: 'line_block',
  fCode3: 'line_name'
};

const kintoneAuth = new kintone.Auth();
kintoneAuth.setApiToken(kin_common.apiToken);
const kintoneConnection = new kintone.Connection(kin_common.url, kintoneAuth);
const kintoneRecord = new kintone.Record(kintoneConnection);

// kintoneのレコードをクエリで条件取得する処理
const getRecords = (LINE_USER_ID) => {
  const query = kin_common.fCode1 + ' = "' + LINE_USER_ID + '"';
  return kintoneRecord.getRecords(kin_common.appId, query, ['$id'], true);
};

// kintoneのレコードを1件登録する処理
const postRecord = (LINE_USER_ID, LINE_NAME) => {
  const params = {
    [kin_common.fCode1]: {
      'value': LINE_USER_ID
    },
    [kin_common.fCode3]: {
      'value': LINE_NAME
    }
  };
  return kintoneRecord.addRecord(kin_common.appId, params);
};

// kintoneのレコードを1件更新する処理
const putRecord = (LINE_USER_ID, recordid, follow) => {
  const params = {
    [kin_common.fCode1]: {
      'value': LINE_USER_ID
    },
    [kin_common.fCode2]: {
      'value': follow === 'follow' ? [] : ['ブロック中']
    }
  };
  return kintoneRecord.updateRecordById(kin_common.appId, recordid, params);
};

exports.handler = async (event) => {
  const res = JSON.parse(event.body);
  const line_userId = res.events[0].source.userId;
  const line_replyToken = res.events[0].replyToken;

  const client = new line.Client({
    channelAccessToken: process.env.LINE_ACCESS_TOKEN
  });

  let resp, line_resp;
  switch(res.events[0].type) { // メッセージのタイプを判断
    case 'follow': {
      resp = await getRecords(line_userId);
      if (resp.totalCount !== '0') {
        console.log('ブロック解除された');
        line_resp = await client.replyMessage(line_replyToken, {
          type: 'text',
          text: 'ブロック解除ありがとう！'
        });
        await putRecord(line_userId, resp.records[0].$id.value, 'follow');
        break;
      }
      console.log('新規登録された');
      line_resp = await client.getProfile(line_userId); // LINEのアカウント名を取得する
      await postRecord(line_resp.userId, line_resp.displayName);
      break;
    }
    case 'unfollow': {
      resp = await getRecords(line_userId);
      if (resp.totalCount !== '0') {
        console.log('ブロックされた');
        await putRecord(line_userId, resp.records[0].$id.value, 'unfollow');
      }
      break;
    }
    default: {
      // それ以外。何もしない
    }
  }
};
