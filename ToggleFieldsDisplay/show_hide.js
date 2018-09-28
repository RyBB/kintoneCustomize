(function() {
  'use strict';

  var events1 = [
    'app.record.create.show',
    'app.record.create.change.multi',
    'app.record.edit.show',
    'app.record.edit.change.multi',
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

    // 複数選択フィールドの値を取得
    var RadioVal = event.record['multi'].value;

    // 複数選択することもあるので選択の数だけループさせる
    RadioVal.forEach(function(ele) {
      switch (ele) {
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
  });
})();
