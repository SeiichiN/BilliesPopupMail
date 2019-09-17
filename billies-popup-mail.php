<?php
/*
 * @wordpress-plugin
 * Plugin Name: Billies Popup Mail
 * Description: This is popup mail form. 
 * Version: 1.0
 * Author: Seiichi Nukayama
 * URL: http://www.billies-works.com/
 */

require_once('billies-popup-mail-menu.php');
require_once ('vendor/autoload.php');

use PHPMailer\PHPMailer\PHPMailer;

/**
 * @params: string $subject
 *          string $body
 *          string $to -- send to.
 *          string $reply -- 返信先。もし引数が指定されなかったらNULL。
 * @return:
 *         boolean TRUE.
 *       
 */
function billies_popup_mail_gmail($subject, $body, $to, $reply) {

  $mdata = get_option('billies_popup_mailconf');

  foreach ($mdata as $key => $value) {
    echo $key, ' => ', $value, "\n";
  }


  $from = $mdata['account'];
  $pass = $mdata['passwd'];
  if (!empty($mdata['fromAddress'])) $reply = $mdata['fromAddress'];
  
  $mail = new PHPMailer();
  $mail->isSMTP();
  $mail->CharSet = 'utf-8';
  $mail->Host = $mdata['smtpsv'];
  $mail->Port = $mdata['port'];
  $mail->SMTPSecure = 'tls';
  $mail->SMTPAuth = true;
  $mail->Username = $from;
  $mail->Password = $pass;
  $mail->setFrom($from, $mdata['fromName']);
  $mail->addReplyTo($reply);
  $mail->addAddress($to);
  $mail->Subject = $subject;
  $mail->Body = $body;
  return $mail->send();
}


/**
 *  stripslashes:
 *    WordPressでは、セキュリティ上の理由からPOSTデータに対して、
 *    一定の文字列に対してバックスラッシュをつける。
 *    （『WordPressの教科書』p255）
 *
 *  esc_attr:
 *    esc_html + 属性値用のフィルターを通す（らしい）
 *    esc_html -- < > ' " 
 */
function billies_popup_mail_w($str) {
    return esc_attr(stripslashes($str));
}


if (!empty($_POST['name'])
    && !empty($_POST['email'])
    && !empty($_POST['comment'])) {

  $reply = billies_popup_mail_w($_POST['email']);
  
  $subject = "コメントが届いています。(billies-works)";
  $body = "お名前：" . billies_popup_mail_w($_POST['name']) . "\n";
  $body = $body . "メールアドレス：" . $reply . "\n";
  $body = $body . "コメント：\n" . billies_popup_mail_w($_POST['comment']) . "\n";
  $to = "billie175@gmail.com";

  if (billies_popup_mail_gmail($subject, $body, $to, $reply)) {
    echo "<script>alert('メールを送信しました')</script>";
  } else {
    echo "<script>alert('メールの送信に失敗しました')</script>";
  }
}


function billies_popup_mail_add_files () {
  wp_enqueue_script('billies-popup-mail_js', plugins_url('popup-mail.js', __FILE__), array(), '1.0', true);
  wp_enqueue_style('css-billies-popup-mail', plugins_url('style.css', __FILE__));
  wp_localize_script('billies-popup-mail_js', 'myScript', array( 'pluginsUrl' => plugins_url(),));
}
add_action('wp_enqueue_scripts', 'billies_popup_mail_add_files');
