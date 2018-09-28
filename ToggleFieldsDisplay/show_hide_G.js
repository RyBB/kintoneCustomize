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
    kintone.app.record.setFieldShown('ga', false);
    kintone.app.record.setFieldShown('gb', false);
    kintone.app.record.setFieldShown('gc', false);

    // 複数選択フィールドの値を取得
    var MultiVal = event.record['multi'].value;

    // 複数選択することもあるので選択の数だけループさせる
    MultiVal.forEach(function(ele) {
      switch (ele) {
        case 'A' :
          kintone.app.record.setFieldShown('ga', true);
          break;
        case 'B' :
          kintone.app.record.setFieldShown('gb', true);
          break;
        case 'C' :
          kintone.app.record.setFieldShown('gc', true);
          break;
      }
    });
  });
})();
