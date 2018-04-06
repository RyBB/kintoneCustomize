(function() {
    'use strict';

    kintone.events.on('app.record.create.submit', function(event) {
        var userField = event.record['ユーザー選択'].value[0].code;

        // // ユーザー選択フィールドが空のときは処理をやめる
        // if (userField.length === 0) {
        //     return;
        // }

        // REST で送るパラメータ
        var param = {
            'app': kintone.app.getId(),
            'query': 'ユーザー選択 in (' + userField + ')'
        };
        // PromiseでREST APIを叩く
        return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', param)
            .then(function(resp) {
                if (!resp.record) {
                    var exitUser = resp.records[0]['ユーザー選択'].value[0].name;
                    return exitUser;
                }
                return event;
            }).then(function(resp) {
                event.record['ユーザー選択']['error'] = resp + 'が重複しています！';
                return event;
            }).catch(function(error) {
                // error
                event.error = error + '予期せぬエラーが発生しました！';
                return;
            });
    });
    // // ユーザー選択フィールドが変更されたときはエラー表示を消す
    // kintone.events.on('app.record.create.change.ユーザー選択', function(event) {
    //     event.record['ユーザー選択']['error'] = null;
    //     return event;
    // });
}());
