(() => {
  'use strict';

  // それぞれのフィールドコードなど
  const common = {
    FCode: '案件一覧',
    space_FCode: 'space',
    related_FCode: '顧客管理レコード番号_関連レコード紐付け用',
    related_TotalFee: '合計費用',
  };

  kintone.events.on('app.record.detail.show', event => {
    const recordId = event.recordId;

    // 関連レコード一覧の条件
    const query = common.related_FCode + ' = ' + recordId;

    const related_AppId = kintone.app.getRelatedRecordsTargetAppId(common.FCode);

    const params = {
      app: related_AppId,
      query: query,
    };

    // 関連先からレコードを取得する
    kintone.api(kintone.api.url('/k/v1/records'), 'GET', params)
      .then(resp => {
        // 0件なら何もしない
        if (!resp.records.length) {
          return;
        }
        // 1件なら何もしない
        if (resp.records.length === 1) {
          return;
        }

        // 金額フィールドの値を配列に格納する
        const numArray = resp.records.map(index => {
          return Number(index[common.related_TotalFee].value);
        });

        // 格納した配列の中身を集計する
        const sum = numArray.reduce((pre, cur) => {
          return pre + cur;
        });

        // カンマ区切り
        const hoge = sum.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');

        kintone.app.record.getSpaceElement(common.space_FCode).textContent = hoge;
      })
      .catch(err => {
        window.alert('エラーが発生しました。\n詳しくはコンソールをご確認ください。');
        console.error(err);
      });
  });
})();
