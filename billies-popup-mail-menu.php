<?php

function billies_popup_mail_menu() {
    add_options_page (
        'billies popup mail 設定',                 // 管理ページのタイトル
        'billies_PopupMail',                // 管理メニュー名
        'manage_options',                           // 管理ページのコンテンツを表示するのに必要な権限
        'billies-popup-mail-menu.php',            // 管理ページのコンテンツを表示するphpファイル
        'billies_popup_mail_admins_page');        // 管理ページのコンテンツを表示する関数
}
add_action('admin_menu', 'billies_popup_mail_menu');
    

function billies_popup_mail_admins_page() {
    $mdata = array();
    add_option('billies_popup_mailconf', $mdata);

    // 管理画面からのPOSTであるか、チェック
    // 引数は <form>の wp_nonce_field と同じにしておく。
    if ( !empty($_POST) && check_admin_referer('billies_action', 'billies_nonce')) {
        $mdata['smtpsv'] = stripslashes($_POST['get_smtpsv']);
        $mdata['port'] = stripslashes($_POST['get_port']);
        $mdata['account'] = stripslashes($_POST['get_account']);
        $mdata['passwd'] = stripslashes($_POST['get_passwd']);
        $mdata['toAddress'] = stripslashes($_POST['get_toAddress']);
        $mdata['fromName'] = stripslashes($_POST['get_fromName']);
        $mdata['fromAddress'] = !empty($_POST['get_fromAddress']) ? stripslashes($_POST['get_fromAddress']) : "";

        update_option('billies_popup_mailconf', $mdata);
        $okMsg =  '<div style="color:#060">保存しました</div>';
    } else {
        $mdata = get_option('billies_popup_mailconf');
        $okMsg = '<div>&nbsp;</div>';
    }
?>
<div class="wrap">
    <?php screen_icon(); ?>
    <h2>billies popup mail 設定</h2>
    <?php echo $okMsg; ?>
    <form action="" method="post">
        <?php wp_nonce_field('billies_action', 'billies_nonce'); ?>
        <p>
            （例）smtp.gmail.com<br>
            smtpサーバー<input type="text" name="get_smtpsv" value="<?php echo esc_attr($mdata['smtpsv']); ?>" required>*必須
        </p>
        <p>
            （例）587<br>
            ポート番号<input type="text" name="get_port" value="<?php echo esc_attr($mdata['port']); ?>" required>*必須
        </p>
        <p>
            （例）hogehoge@gmail.com<br>
            アカウントアドレス<input type="text" name="get_account" value="<?php echo esc_attr($mdata['account']); ?>" required>*必須
        </p>
        <p>
            パスワード<input type="password" name="get_passwd" value="<?php echo esc_attr($mdata['passwd']); ?>" required>*必須
        </p>
        <p>
            送信先アドレスを指定します。このアドレスにメールが届きます。<br>
            送信先アドレス<input type="email" name="get_toAddress" value="<?php echo esc_attr($mdata['toAddress']); ?>" required>*必須
        </p>
        <p>
            送られるメールに表示される差出人指名を指定します。<br>
            差出人氏名<input type="text" name="get_fromName" value="<?php echo esc_attr($mdata['fromName']); ?>" required>*必須
        </p>
        <p>
            返信先を指定する場合に指定します。<br>
            空欄の場合は、コメントをくれた人のメールアドレスが設定されます。<br>
            返信先アドレス<input type="text" name="get_fromAddress" value="<?php echo esc_attr($mdata['fromAddress']); ?>">（オプション）
        </p>
        <?php submit_button(); ?>
    </form>

</div>

<?php
}
    
    
