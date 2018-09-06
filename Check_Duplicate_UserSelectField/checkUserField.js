(function() {
  'use strict';
  const events = [
    'app.record.create.submit',
    'app.record.edit.submit',
  ];
  kintone.events.on(events, function(event) {
    const userField = event.record['userselect'].value;
    const recordId = kintone.app.record.getId();
    let query = '';

    // ユーザー選択フィールドが空のときは処理をやめる
    if (!userField.length) {return; }

    // レコード編集時 (=レコードがすでにある時) はクエリ文追加
    if (recordId) {query = '$id != ' + recordId + ' and '; }

    // ユーザー選択フィールド用クエリ(複数人対応)
    query += 'userselect in (';

    for (let i = 0; i <= (userField.length - 2); i++) {
      query += '"' + userField[i].code + '",';
    }
    query += '"' + userField[(userField.length - 1)].code + '")';

    // REST で送るパラメータ
    const param = {
      'app': kintone.app.getId(),
      'query': query,
    };

    // PromiseでRESTを叩く
    return kintone.api(kintone.api.url('/k/v1/records'), 'GET', param)
      .then(function(resp) {
        if (resp.records.length) {return resp.records[0]['userselect'].value[0].name; }
        return true;
      })
      .then(function(res) {
        if (res === true) {return event; }
        event.record['userselect'].error = res + 'が重複しています！';
        return event;
      })
      .catch(function(err) {
        // error
        event.error = '予期せぬエラーが発生しました！';
        return event;
      });
  });

  // userselectフィールドが変更されたときはエラー表示を消す
  kintone.events.on(['app.record.create.change.userselect', 'app.record.edit.change.userselect'], function(event) {
    event.record['userselect'].error = null;
    return event;
  });
}());
