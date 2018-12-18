(function() {
  'use strict';

  // それぞれのフィールドコードなど
  var common = {
    FCode: '案件一覧',
    space_FCode: 'space',
    related_FCode: '顧客管理レコード番号_関連レコード紐付け用',
    related_TotalFee: '合計費用',
  };

  kintone.events.on('app.record.detail.show', function(event) {
    var recordId = event.recordId;

    // 関連レコード一覧の条件
    // サンプルアプリの設定を記述
    var query = common.related_FCode + ' = ' + recordId;

    // 関連レコード一覧のマスタアプリのIDを取得
    var related_AppId = kintone.app.getRelatedRecordsTargetAppId(common.FCode);

    var params = {
      app: related_AppId,
      query: query,
    };

    // レコードを複数件取得する
    kintone.api(kintone.api.url('/k/v1/records'), 'GET', params).then(function(resp) {
      // 0件なら何もしない
      if (!resp.records.length) {
        return;
      }
      // 1件なら何もしない (集計する必要がない)
      if (resp.records.length === 1) {
        return;
      }

      // 各レコードの金額フィールド値を配列に格納する
      var numArray = resp.records.map(function(index) {
        return Number(index[common.related_TotalFee].value);
      });

      // 格納した配列の中身(金額)を集計する
      var sum = numArray.reduce(function(pre, cur) {
        return pre + cur;
      });

      // カンマ区切り
      var hoge = sum.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

      // スペースフィールドに表示
      kintone.app.record.getSpaceElement(common.space_FCode).textContent = hoge;

    }).catch(function(err) {
      window.alert('エラーが発生しました。\n詳しくはコンソールをご確認ください。');
      console.error(err);
    });
  });
})();
