(function() {
    'use strict';

    // 検索のKeyとか(個人のやつに修正してください)
    const key = '{API key}';
    const cx = '{Custom ID}';

    // GoogleAPIを叩いてImageURLを取得する処理
    const getImage = keyword => {
        return new kintone.Promise(function(resolve, reject) {
            const url = 'https://www.googleapis.com/customsearch/v1?key=' + key
            + '&cx=' + cx + '&searchType=image&q=' + keyword;
            kintone.proxy(url, 'GET', {}, {}, function(body, status, headers) {
                const res = JSON.parse(body);

                // とりあえずlink内にあるURL取得
                const imageurl = res.items[0].link;
                resolve(imageurl);
            });
        });
    };

    // Titleフィールドに空白があった場合%20に変換する処理
    const changeSpace = txt => {
        let str = txt.replace(/　/g,'%20');
        str = str.replace(/ /g,'%20');
        return str;
    };

    // innterHTMLのエスケープ処理
    const escape = txt => {
      let str = txt.replace(/&/g, '&amp;');
      str = str.replace(/</g, '&lt;');
      str = str.replace(/>/g, '&gt;');
      str = str.replace(/"/g, '&quot;');
      str = str.replace(/'/g, '&#39;');
      return str;
    };

    // kintoneのイベント処理
    // レコード追加/編集のサブミットイベント処理
    kintone.events.on(['app.record.create.submit','app.record.edit.submit'],function(event) {
        return new kintone.Promise(function(resolve, reject) {
            const record = event.record;
            const searchkeyword = record['検索キーワード'].value;
            const checkedtext = changeSpace(searchkeyword);
            resolve(checkedtext);
        }).then(getImage).then(function(url) {
            event.record['URL'].value = url;
            return event;
        });
    });

    // レコード詳細/編集イベント処理
    kintone.events.on(['app.record.detail.show','app.record.edit.show'], function(event) {
        var url = event.record['URL'].value;

        // 画像増殖を防ぐ
        if (document.getElementById('my_space') !== null) {
            return;
        }
        // スペースフィールドに画像URLをはめる
        const mySpace = document.createElement('space');
        mySpace.id = 'my_space';
        mySpace.innerHTML = '<image src="' + escape(url) + '" width="150" height="auto">';
        kintone.app.record.getSpaceElement('space').appendChild(mySpace);
        return event;
    });

    // レコード追加/編集イベント処理
    kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function(event) {
        event.record['URL'].disabled = true;
        return event;
    });
}());

