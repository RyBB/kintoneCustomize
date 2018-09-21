// requestモジュールを利用するので npm でインストールしてください
const request = require('request-promise');

// kintoneから該当するレコードの件数を返す処理
const getkintone = val => {
  // kintone用パラメータ
  const DOMAIN = '<subdomain>.cybozu.com';
  const URL = 'https://' + DOMAIN + '/k/v1/records.json';
  const APP_ID = '<app ID>';
  const API_TOKEN = '<API Token>';
  const headers = { 'X-Cybozu-API-Token': API_TOKEN };

  // 発話した単語をkintoneの文字列複数行フィールドでLike検索
  const params = {
    app: APP_ID,
    query: 'question like "' + val + '"',
    totalCount: true,
  };

  const options = {
    url: URL,
    method: 'GET',
    headers: headers,
    'Content-Type': 'application/json',
    json: params,
  };

  let text;
  // 該当するレコードを取得
  return request(options)
    .then(resp => {
      switch (resp.records.length) {
        case 0:
          text = val + 'に該当するレコードはありませんでした。';
          break;
        case 1:
          text = resp.records[0].answer.value;
          break;
        default:
          text = val + 'に該当するレコードが' + resp.totalCount + '件ありました!';
          break;
      }
      return text;
    })
    .catch(err => {
      console.log(err);
    });
};

// Clovaに返す処理
const setClova = (text, bool, callback) => {
  // Clovaに返すJSON
  const body = {
    version: '1.0',
    sessionAttributes: {},
    response: {
      outputSpeech: {
        type: 'SimpleSpeech',
        values: {
          type: 'PlainText',
          lang: 'ja',
          value: text,
        },
      },
      card: {},
      directives: [],
      shouldEndSession: bool,
    },
  };

  const res = {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(body),
  };
  callback(null, res);
};

exports.handler = async (event, conetext, callback) => {
  const req = JSON.parse(event.body).request;
  let text, word, val;

  // ユーザのアクションによって処理を振り分ける
  switch (req.type) {
    case 'LaunchRequest':
      text = 'kintoneで何を検索したいですか？';
      break;
    case 'SessionEndedRequest':
      text = 'さようなら!';
      break;
    case 'IntentRequest':
      // スロットの中身を格納
      word = req.intent.slots;

      // キーワードがわからなかった場合
      if (!word) {
        text = 'すみません。その言葉はまだ理解できません。';
        break;
      }

      // スロット内のキーワードが認識できた場合
      val = word.SearchVal.value;
      text = await getkintone(val);
      setClova(text, true, callback);
      break;
    default:
      text = 'kintoneで調べたい単語を教えてください';
      break;
  }
  // 対話を続けるので false を返す
  setClova(text, false, callback);
};
