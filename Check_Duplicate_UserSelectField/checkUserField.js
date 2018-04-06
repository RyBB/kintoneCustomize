(function() {
    'use strict';
    kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function(event) {
        var userField = event.record['ユーザー選択'].value;
        var recordId = kintone.app.record.getId();
        var query = '';

        // ユーザー選択フィールドが空のときは処理をやめる
        if (userField.length === 0) {
            return;
        }

        // レコード編集時(=レコードがすでにある時)はクエリ文追加
        if (recordId) {
            query = '$id != ' + recordId + ' and ';
        }

        // ユーザー選択フィールド用クエリ(複数人対応)
        query += 'ユーザー選択 in (';
        for (var i = 0; i <= (userField.length - 2); i++) {
            query += '"' + userField[i].code + '",';
        }
        query += '"' + userField[(userField.length - 1)].code + '")';

        // REST で送るパラメータ
        var param = {
            'app': kintone.app.getId(),
            'query': query
        };
        // PromiseでRESTを叩く
        return kintone.api(kintone.api.url('/k/v1/records'), 'GET', param)
            .then(function(resp) {
                if (!resp.record) {
                    return resp.records[0]['ユーザー選択'].value[0].name;
                }
                return event;
            }).then(function(resp) {
                event.record['ユーザー選択'].error = resp + 'が重複しています！';
                return event;
            }).catch(function(error) {
                // error
                event.error = '予期せぬエラーが発生しました！';
                return;
            });
    });
    // ユーザー選択フィールドが変更されたときはエラー表示を消す
    kintone.events.on(['app.record.create.change.ユーザー選択', 'app.record.edit.change.ユーザー選択'], function(event) {
        event.record['ユーザー選択'].error = null;
        return event;
    });
}());
