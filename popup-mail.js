// popup-mail.js

'use strict';

(function () {
  var mail_btn, body, formDiv, okuruBtn, formEle,
      nameData, emailData, commentData;

  var htmlEscape = function (str) {
    if (!str) return;
    return str.replace(/[<>&"'`]/g, function(match) {
      const escape = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;'
      };
      return escape[match];
    });
  };

  // メールボタンの作成
  // <button id="popup-mail-button>
  //   <img src="mail.svg" alt="メールを送る">
  // </button>
  // bodyの子要素とする
  var setupButton = function () {
    body = document.getElementsByTagName('body');
    mail_btn = document.createElement('button');
    var image = document.createElement('img');

    mail_btn.setAttribute('id', 'popup-mail-button');
    
    image.setAttribute('src', myScript.pluginsUrl + '/billies-popup-mail/mail.svg');
    image.setAttribute('alt', 'メールを送る');
    
    mail_btn.appendChild(image);
    body[0].appendChild(mail_btn);
  };

  // ============= フォームの作成 ===================

  // submitボタンを押したときの処理
  var checkForm = function () {
    console.log(formDiv);
    var nameArea = formDiv.firstChild[0].value;
    console.log('nameArea:');
    console.log(nameArea);
    if (nameArea === '') {
      console.log( 'お名前が未入力です');
      // nameArea.setAttribute('style', 'color:red');
    } else {
      console.log('OK');
    }
  };

  // ========== フォームのバルーン =============================
  // バルーンをプロトタイプからインスタンスを作成する
  //
  // @param: rect -- 位置をあらわすオブジェクト
  //                 { x: 10進数, y: 10進数 }
  //                 対象となっているフォーム要素の画面上の位置
  //         name -- input要素のname属性、name, email, comment の3種類
  //         msg  -- validationMessage を受け取る
  // 
  var formBalloon = function (name, msg) {
    // var clientRect = ele.getBoundingClientRect();  // 画面での位置
    var rect = getEleRect( formEle[name] );
    var x = (rect.x + 100).toString() + 'px';  // フォーム要素の左端 + 100px
    var y = (rect.y - 20).toString() + 'px';   // フォーム要素の上端 - 20px
    
    var balloon = document.createElement('div');
    // formEle.setAttribute('style', 'position: relative');
    balloon.setAttribute('class', 'balloon');
    balloon.setAttribute(
      'style',
      'position:fixed; border:solid 1px #f00; background-color:rgba(255,255,255,1); color:red;'
    );
    balloon.style.top = y;    // バルーンのy位置
    balloon.style.left = x;   // バルーンのx位置
    balloon.textContent = msg;     // バルーンに表示する文字
    formEle.appendChild(balloon);  // バルーンを<form>の子要素とする
  };

  // 要素の画面上の位置を取得
  // @param: ele -- 要素
  // @return: (obj) -- { x: 10進数, y: 10進数 }
  var getEleRect = function (ele) {
    var clientRect = ele.getBoundingClientRect();
    return {
      x: clientRect.left,
      y: clientRect.top
    };
  };

  var deleteBalloon = function () {
    var btnClass, i;
    btnClass = formEle.getElementsByClassName('balloon');
    for (i = 0; i < btnClass.length; i++) {
      formEle.removeChild(formEle.lastChild);
    }
  };
  
  // フォーム要素に変更が加えられるとこの関数が呼び出される
  var myValidate = function () {
    var isValid,            // true -- まちがいなし | false -- 入力に不備がある
        validationMessage;  // エラーがあれば、エラーメッセージが入る
    
    // nameData = htmlEscape(formEle['name'].value);
    // emailData = formEle['email'].value;
    // commentData = htmlEscape(formEle['comment'].value);

        // バルーンがあれば削除しておく
    if (formEle.lastChild.className === 'balloon') {
      deleteBalloon();
    }

    
    // ================= type="text" ===================
    // 30文字以内か
    if (nameData.length > 30) {
      isValid = false;
      validationMessage = '文字数オーバーです';
      formBalloon( 'name', validationMessage );
    }

    // ================== type="email" ====================
    // @が含まれているか
    if (emailData.match(/.+@.+\..+/)) {
      isValid = true;
    } else {
      isValid = false;
      validationMessage = 'メールアドレスの形式ではありません';
      formBalloon( 'email', validationMessage );
    }
    // 50文字以内か
    if (emailData.length > 50) {
      isValid = false;
      validationMessage = '文字数オーバーです';
      formBalloon( 'email', validationMessage );
    }

    // isValidが false ならば
    if (! isValid) {
      okuruBtn.setAttribute('disabled', true);  // 送るボタンは非表示
    } else {
      okuruBtn.removeAttribute('disabled');    // 送るボタンは表示
    }
  };

  // フォームに変化があるたびに呼ばれる
  // すべての項目に文字が入力されていたら
  // myValidate関数を呼ぶ
  var update = function () {
    nameData = htmlEscape( formEle['name'].value );
    emailData = htmlEscape( formEle['email'].value );
    commentData = htmlEscape( formEle['comment'].value );
    /* console.log('-----------');
     * console.log(nameData);
     * console.log(emailData);
     * console.log(commentData);*/
    if ((checkUndefNull( nameData ))
        && (checkUndefNull( emailData ))
        && (checkUndefNull( commentData ))) {
      myValidate();
    } else {
      okuruBtn.setAttribute('disabled', true);
    }
  };

  var checkUndefNull = function (x) {
    if (x === undefined || x === null || x === '') {
      return false;
    }
    return true;
  };
  
  // =============== お問い合わせフォーム =======================================
  var createForm = function () {
    var html, closeBtn, msgEle;
    
    html = ''
         + '<p><label for="name">お名前：</label><input type="text" name="name" id="name"></p>'
         + '<p><label for="email">メールアドレス：</label><input type="email" name="email" id="email"></p>'
         + '<p><label for="comment">内容：</label><textarea name="comment" id="comment"></textarea></p>'
         + '<p><input type="submit" value="送る" id="okuru"></p>';

    formEle = document.createElement('form');
    formEle.setAttribute( 'method', 'post' );
    formEle.setAttribute( 'action', '' );
    formEle.innerHTML = html;

    msgEle = document.createElement('p');
    msgEle.textContent = '何か質問等ございましたら、このフォームでお願いします。';

    formDiv = document.createElement('div');
    formDiv.setAttribute('id', 'popup-mail-form');
    formDiv.appendChild(msgEle);
    formDiv.appendChild(formEle);

    closeBtn = document.createElement('div');
    closeBtn.setAttribute('id', 'closeButton');
    closeBtn.textContent = '× 閉じる';

    mail_btn.style.display = 'none';
    body[0].appendChild(formDiv);
    formDiv.appendChild(closeBtn);

    formEle['name'].value = (checkUndefNull( nameData)) ? nameData : '';
    formEle['email'].value = (checkUndefNull( emailData )) ? emailData : '';
    formEle['comment'].value = (checkUndefNull( commentData )) ? commentData : '';
    
    /* console.log('-----------');
     * console.log(nameData);
     * console.log(emailData);
     * console.log(commentData);*/
    
    // submitイベントを無効にする
    // formEle.addEventListener('submit', function (e) {
    //   e.preventDefault();
    // });

    formEle.addEventListener('change', update);
    formEle.addEventListener('input', update);

    closeBtn.addEventListener('click', closeForm, false);

    okuruBtn = document.getElementById('okuru');
    okuruBtn.setAttribute('disabled', true);     // 送るボタンは、初期設定では非表示にしておく
    // 送るボタンをクリックすると、checkForm関数が呼び出される
    // okuruBtn.addEventListener('click', checkForm, false);
  };

  var closeForm = function () {
    formDiv.style.display = 'none';
    mail_btn.style.display = 'block';
  };

  var dispForm = function () {
    mail_btn.style.display = 'none';
    formDiv.style.display = 'block';
  };
  
  window.onload = function () {
    setupButton();
    createForm();
    closeForm();
    mail_btn.addEventListener('click', dispForm, false);

  };
})();
