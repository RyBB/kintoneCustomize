(() => {
  'use strict';

  // kintoneのフィールドコードとか
  const common = {
    image: 'image',
    music: 'music'
  };

  const xhr = new XMLHttpRequest();

  // レコードを全件取得する処理
  const getRecords = APPID => {
    return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {app: APPID})
    .then(resp => {
      return resp;
    })
    .catch(err => {
      console.log('Error:kintone\n' + err);
    });
  };

  // 添付ファイルの直リンクを作る関数
  const filedownload = filekey => {
    return new Promise((resolve, reject) => {
      const url = '/k/v1/file.json?fileKey=' + filekey;
      xhr.open('GET', url, true);
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      xhr.responseType = 'blob';
      xhr.onload = () => {
        // blobからURL生成
        let blob = xhr.response;
        let url = window.URL || window.webkitURL;
        let file = url.createObjectURL(blob);
        resolve(file);
      };
      xhr.onerror = () => {
        reject('Error:XHR');
      };
      xhr.send();
    });
  };

  // 画像ファイルと音楽ファイルの直リンク生成
  const getImageMusicURL = DATA => {
    return new Promise(async resolve => {
      const index = DATA.$id.value;
      let imageURL, musicURL;

      // 画像ファイルの有無チェック
      if (!DATA[common.image].value[0]) {
        imageURL = null;
      } else {
        let imageFileKey = DATA[common.image].value[0].fileKey;
        imageURL = await filedownload(imageFileKey);
      }

      // 音楽ファイルの有無チェック
      if (!DATA[common.music].value[0]) {
        musicURL = null;
      } else {
        let musicFileKey = DATA[common.music].value[0].fileKey;
        musicURL = await filedownload(musicFileKey);
      }

      resolve({
        index: index,
        img: imageURL,
        music: musicURL
      });
    });
  };

  window.mykintone = {};
  window.mykintone.getRecords = getRecords;
  window.mykintone.getImageMusicURL = getImageMusicURL;
})();
