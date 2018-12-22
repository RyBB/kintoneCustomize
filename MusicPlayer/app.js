(() => {
  'use strict';
  const mykintone = window.mykintone;

  const events = [
    'app.record.index.show',
    'mobile.app.record.index.show',
  ];
  kintone.events.on(events, async e => {
    if (!e.viewId === 5740139) {
      return;
    }
    // kintoneのレコードを全件取得する
    const kinData = await mykintone.getRecords(e.appId);
    const records = kinData.records;

    // 添付ファイルの直リンク生成
    const URL = await mykintone.getImageMusicURL(records[0]);

    // Vue.js
    var app = new Vue({
      el: '#app',
      data: {
        index: URL.index,
        imglink: URL.img,
        musiclink: URL.music,
      },
      methods: {
        nextMusic: async function() {
          let URL;
          const index = records.findIndex(obj => {
            return  obj.$id.value === this.index;
          });
          if (!records[index + 1]) {
            URL = await mykintone.getImageMusicURL(records[0]);
            app.index = URL.index;
            app.imglink = URL.img;
            app.musiclink = URL.music;
            return;
          }
          URL = await mykintone.getImageMusicURL(records[index + 1]);
          app.index = URL.index;
          app.imglink = URL.img;
          app.musiclink = URL.music;
        }
      }
    });

    new Vue({
      el: '#list',
      data: {
        items: records
      },
      methods: {
        changeMusic: async function (event) {
          const URL = await mykintone.getImageMusicURL(event);
          app.index = URL.index;
          app.imglink = URL.img;
          app.musiclink = URL.music;
        }
      }
    });
  });
})();
