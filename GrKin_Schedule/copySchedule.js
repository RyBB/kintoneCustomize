jQuery.noConflict();
(($) => {
  'use strict';
  // kintone側の設定
  const kin = {
    url: 'https://{サブドメイン}.cybozu.com/k/v1/record.json',
    appID: '{アプリID}',
    token: '{APIトークン ※追加権限}',
  };

  // Garoonのイベント
  garoon.events.on('schedule.event.create.show', () => {
    // 保存ボタンの取得 (※DOM操作)
    const submit = document.getElementById('schedule_submit_button');
    if (!submit) {
      return;
    }
    // 保存ボタンのクリックイベントに下記処理を追加
    submit.addEventListener('click', () => {
      const e = garoon.schedule.event.get();

      // ユーザーのidとtypeを削除 (kintoneでは必要ないため)
      e.attendees.forEach((ele, i) => {
        delete e.attendees[i].id;
        delete e.attendees[i].type;
      });

      // スケジュールの公開方法
      const visibilityType = e.visibilityType === 'PUBLIC' ? '公開' : '非公開';

      // 施設情報
      let facilities = e.facilities.map(ele => {
        return ele.name;
      });
      facilities = facilities.join(', ');

      // kintoneアプリの情報
      const params = {
        app: kin.appID,
        record: {
          start: {
            value: e.start.dateTime,
          },
          end: {
            value: e.end.dateTime,
          },
          eventMenu: {
            value: e.eventMenu,
          },
          subject: {
            value: e.subject,
          },
          attendees: {
            value: e.attendees,
          },
          facilities: {
            value: facilities,
          },
          notes: {
            value: e.notes,
          },
          visibilityType: {
            value: visibilityType,
          },
        },
      };

      // ajaxでkintoneへレコード登録
      $.ajax({
        url: kin.url,
        type: 'POST',
        headers: {
          'X-Cybozu-API-Token': kin.token,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(params),
      }).done(resp => {
        console.log(resp);
      }).fail(err => {
        console.log(err);
        return false;
      });
    }, true);
  });
})(jQuery);
