(function() {
  'use strict';

  var events1 = [
    'app.record.create.show',
    'app.record.create.change.radio',
    'app.record.edit.show',
    'app.record.edit.change.radio',
    'app.record.detail.show',
  ];
  kintone.events.on(events1, function(event) {
    // 初期値としてフィールドを隠す
    kintone.app.record.setFieldShown('a1', false);
    kintone.app.record.setFieldShown('a2', false);
    kintone.app.record.setFieldShown('b1', false);
    kintone.app.record.setFieldShown('b2', false);
    kintone.app.record.setFieldShown('b3', false);
    kintone.app.record.setFieldShown('c1', false);
    kintone.app.record.setFieldShown('c2', false);

    // ラジオボタンフィールドの値を取得
    var RadioVal = event.record['radio'].value;

    // ラジオボタンは必ず1つしか値を取らないため、そのままSwich文ができる
    switch (RadioVal) {
      case 'A' :
        kintone.app.record.setFieldShown('a1', true);
        kintone.app.record.setFieldShown('a2', true);
        break;
      case 'B' :
        kintone.app.record.setFieldShown('b1', true);
        kintone.app.record.setFieldShown('b2', true);
        kintone.app.record.setFieldShown('b3', true);
        break;
      case 'C' :
        kintone.app.record.setFieldShown('c1', true);
        kintone.app.record.setFieldShown('c2', true);
        break;
    }
  });
})();
