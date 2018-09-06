(function() {
  'use strict';

  // 検索のKeyとか(個人のやつに修正してください)
  const key = '{API key}';
  const cx = '{Custom ID}';

  // 検索キーワードに空白があったら置換
  const changeSpace = function(text) {
    let txt = text.replace(/　/g, '%20');
    txt = text.replace(/ /g, '%20');
    return txt;
  };

  // メインの処理
  kintone.events.on(['app.record.create.submit', 'app.record.edit.submit'], function(event) {
    const record = event.record;
    const searchkeyword = record['検索キーワード'].value;
    const keyword = changeSpace(searchkeyword);
    const url = 'https://www.googleapis.com/customsearch/v1?key=' + key
    + '&cx=' + cx + '&searchType=image&q=' + keyword;

    // GoogleのカスタムサーチAPIを実行
    return kintone.proxy(url, 'GET', {}, {})
      .then(function(body) {
        const res = JSON.parse(body[0]);
        const imageurl = res.items[0].link;
        return imageurl;
      })
      .then(function(ul) {
        event.record['URL'].value = ul;
        return event;
      });
  });

  // URLフィールドを編集不可にする
  kintone.events.on(['app.record.create.show', 'app.record.edit.show'], function(event) {
    event.record['URL'].disabled = true;
    return event;
  });

  // 詳細画面、編集画面で画像を表示する
  kintone.events.on(['app.record.detail.show', 'app.record.edit.show'], function(event) {
    const url = event.record['URL'].value;
    if (document.getElementById('my_space')) {
      return;
    }

    // スペースフィールド取得
    const mySpace = document.createElement('space');
    mySpace.id = 'my_space';
    mySpace.innerHTML = '<image src="' + url + '"  height="250" width="auto">';

    kintone.app.record.getSpaceElement('space').appendChild(mySpace);
    return event;
  });
}());
