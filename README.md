# BilliesPopupMail
Popup mail for WordPress Plugin

インストール
-------

### composer のインストール

windows の場合は、ここから Composer-Setup.exe をダウンロードする。

https://getcomposer.org/doc/00-intro.md#installation-windows

Composer-Setup.exe をダブルクリックしてインストールを始める。  
チェック指定が必要な箇所はない。

### phpmailer のインストール

> composer require phpmailer/phpmailer

## Billies ポップアップ・メールの使い方

このプラグインをインストールして有効化すると、ダッシュボードの「設定」に
「billies_PopupMail」という項目ができる。

それを指定すると、設定画面が出るので、smtpサーバーなどを指定できる。

## 注意点

メールを使うとき、iso-2022-jp コードを使用するが、その際少しコツがいる。

まず、

``` php
$original_encoding = mb_internal_encoding();
mb_internal_encoding('UTF-8');
```

と文字コードの指定を UTF-8 にしておかねばならない。  
そのうえで、

``` php
$mail->CharSet = "iso-2022-jp";
$mail->Encoding = "7bit";
... (略) ...
$mail->Subject = mb_encode_mimeheader( $subject );
```

とする必要がある。そして、

``` php
mb_internal_encoding( $original_encoding );
```

と、もとに戻してやる。

このあたりは、ネットの記事によりさまざまである。  
なかには、`mb_internal_encoding('ISO-2022-JP')` と
しなければならない、という記事もある。

https://qiita.com/puriso/items/445bd98e268bdeb51621

https://hhelibex.hatenablog.jp/entry/2017/12/13/000133

ただ、僕がやってみたところ、`mb_internal_encoding('UTF-8')` という
指定がなくても、
ローカル環境からメール発信すると文字化けは起こらなかった。
しかし、レンタルサーバからメール発信すると文字化けが起こった。

どうも、PHPが動作している状況によるみたいである。

しかし、`mb_internal_encoding('ISO-2022-JP')`とやると、全く
うまくいかなかった。

 <!-- 修正時刻: Tue Jan 25 19:17:41 2022 -->
