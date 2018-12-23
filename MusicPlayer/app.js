(() => {
  'use strict';
  const mykintone = window.mykintone;

  const events = [
    'app.record.index.show',
    'mobile.app.record.index.show'
  ];
  kintone.events.on(events, async e => {
    // カスタマイズビュー以外なら終了
    if (!e.viewId === 5740139) {
      return;
    }

    // kintoneのレコードを全件取得する
    const kinData = await mykintone.getRecords(e.appId);
    const records = kinData.records;

    // 添付ファイルの直リンク生成
    const URL = await mykintone.getImageMusicURL(records[0]);

    // Vue.js
    const app = new Vue({
      el: '#app',
      data: {
        index: URL.index,
        imglink: URL.img,
        musiclink: URL.music,
      },
      methods: {
        nextMusic: async function() {
          let newURL;
          const index = records.findIndex(obj => {
            return  obj.$id.value === this.index;
          });
          if (!records[index + 1]) {
            newURL = await mykintone.getImageMusicURL(records[0]);
            app.index = newURL.index;
            app.imglink = newURL.img;
            app.musiclink = newURL.music;
            return;
          }
          newURL = await mykintone.getImageMusicURL(records[index + 1]);
          app.index = newURL.index;
          app.imglink = newURL.img;
          app.musiclink = newURL.music;
        }
      }
    });

    new Vue({
      el: '#list',
      data: {
        items: records
      },
      methods: {
        changeMusic: async function(event) {
          let newURL = await mykintone.getImageMusicURL(event);
          app.index = newURL.index;
          app.imglink = newURL.img;
          app.musiclink = newURL.music;
        }
      }
    });
  });
})();
