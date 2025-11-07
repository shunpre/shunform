

import { FormItem } from './types';

export const SIDEBAR_HTML_TEMPLATE = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Meiryo,sans-serif;margin:0;padding:12px;background:#fafafa;}
    h1{font-size:16px;margin:0 0 8px;}
    .sec{border:1px solid #e5e7eb;border-radius:8px;padding:10px;margin-bottom:10px;background:#fff}
    label{display:block;font-size:12px;color:#374151;margin:8px 0 4px}
    input[type=text], textarea, select{width:100%;box-sizing:border-box;border:1px solid #d1d5db;border-radius:8px;padding:8px;font-size:12px}
    textarea{min-height:80px}
    .btns{display:flex;gap:8px;margin-top:10px}
    button{border:0;background:#14b8a6;color:#fff;border-radius:8px;padding:8px 12px;font-weight:700;cursor:pointer}
    button.ghost{background:#fff;color:#111827;border:1px solid #d1d5db}
    .hint{font-size:11px;color:#6b7280}
    code{background:#f3f4f6;padding:2px 4px;border-radius:4px}
    ul{margin:6px 0 0 16px;padding:0;list-style:square;}
    #toast{visibility:hidden;min-width:250px;margin-left:-125px;background-color:#333;color:#fff;text-align:center;border-radius:4px;padding:12px;position:fixed;z-index:1;left:50%;bottom:30px;font-size:14px;opacity:0;transition:visibility 0s 2.5s, opacity 0.5s linear;}
    #toast.show{visibility:visible;opacity:1;transition:opacity 0.5s linear;}
  </style>
</head>
<body>
  <h1>フォーム設定</h1>

  <div class="sec">
    <strong>固有 ID</strong>
    <label>受付IDプレフィックス</label>
    <input id="ID_PREFIX" type="text" placeholder="ex: GL-">
  </div>

  <div class="sec">
    <strong>通知・返信ヘッダー</strong>
    <label>【必須】通知宛先（カンマ区切り可）</label>
    <input id="NOTIFY_TO" type="text" placeholder="ex: notify@example.com, sub@example.com">
    <label>Reply-To（受信者が返信する宛先）</label>
    <input id="REPLY_TO" type="text" placeholder="ex: support@example.com">
    <label>【必須】差出人名（自動返信のFrom名）</label>
    <input id="SENDER_NAME" type="text" placeholder="ex: ○○株式会社 お問い合わせ窓口">
  </div>

  <div class="sec">
    <strong>リーガル表記</strong>
    <div class="hint">空欄があっても問題ありません。空欄は項目名自体がメールに表示されなくなります。</div>
    <label>会社名</label><input id="LEGAL_COMPANY" type="text" placeholder="株式会社グリーンリーフ">
    <label>所在地</label><input id="LEGAL_ADDRESS" type="text" placeholder="〒150-0001 東京都渋谷区...">
    <label>電話</label><input id="LEGAL_TEL" type="text" placeholder="03-1234-5678">
    <label>代表者</label><input id="LEGAL_REP" type="text" placeholder="山田太郎">
    <label>お問い合わせ窓口</label><input id="LEGAL_CONTACT" type="text" placeholder="営業部 佐藤次郎">
    <label>メールアドレス</label><input id="LEGAL_EMAIL" type="text" placeholder="support@example.com">
    <label>営業時間</label><input id="LEGAL_HOURS" type="text" placeholder="平日 10:00–18:00">
    <label>WebサイトURL</label><input id="LEGAL_WEB" type="text" placeholder="https://example.com">
    <label>個人情報保護方針URL</label><input id="LEGAL_PRIVACY_URL" type="text" placeholder="https://example.com/privacy">
  </div>

  <div class="sec">
    <strong>自動返信テンプレ（お客様向け）</strong>
    <label>件名</label><input id="AUTO_REPLY_SUBJECT" type="text">
    <label>本文</label><textarea id="AUTO_REPLY_BODY" placeholder="未設定時は既定文を自動適用します"></textarea>
  </div>

  <div class="sec">
    <strong>通知テンプレ（社内向け）</strong>
    <label>件名</label><input id="NOTIFY_SUBJECT" type="text">
    <label>本文</label><textarea id="NOTIFY_BODY"></textarea>
  </div>

  <div class="sec">
    <strong>アップロード保存</strong>
    <label>保存フォルダID（未設定なら自動作成）</label>
    <input id="UPLOAD_FOLDER_ID" type="text">
    <div class="hint">※ ファイルはメールでのプレビュー表示のため、<b>自動的に「リンクを知っている全員が閲覧可」</b>になります。</div>
  </div>

  <div class="sec">
    <strong>その他</strong>
    <label>回答記録スプレッドシートID（空なら自動作成）</label>
    <input id="SHEET_ID" type="text">
    <label>reCAPTCHA シークレット（任意）</label>
    <input id="RECAPTCHA_SECRET" type="text">
    <div class="hint">※ HTML側のSiteKeyだけでもOK。ここに入れるとサーバー検証も追加されます。</div>
  </div>

  <div class="sec">
    <strong>使える差し込みタグ（{{…}} / [[…]]）</strong>
    <div class="hint">
      <ul>
        <li><code>{{ID}}</code> / <code>[[受付ID]]</code></li>
        <li><code>{{DATETIME}}</code> / <code>[[受付日時]]</code></li>
        <li><code>{{FORM}}</code> / <code>[[フォームタイトル]]</code></li>
        <li><code>{{INPUTS_TEXT}}</code> / <code>[[入力内容]]</code></li>
        <li><code>{{NAME}}</code> / <code>[[名前]]</code></li>
        <li><code>{{EMAIL}}</code> / <code>[[メールアドレス]]</code></li>
        <li>リーガル：<code>{{LEGAL_COMPANY}}</code> など</li>
      </ul>
    </div>
  </div>

  <div class="btns">
    <button class="ghost" onclick="seedDefaults()">既定文を流し込む</button>
    <button onclick="save()">保存する</button>
  </div>

  <div id="toast"></div>

  <script>
    function showToast(message) {
      var toast = document.getElementById("toast");
      toast.textContent = message;
      toast.className = "show";
      setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 2400);
    }

    function fill(props){
      Object.keys(props||{}).forEach(function(k){
        const el = document.getElementById(k);
        if(el) el.value = props[k] || '';
      });
    }

    function load(){
      google.script.run.withSuccessHandler(fill).api_getProps();
    }

    function save(){
      const ids = [
        'ID_PREFIX','NOTIFY_TO','REPLY_TO','SENDER_NAME',
        'LEGAL_COMPANY','LEGAL_ADDRESS','LEGAL_TEL','LEGAL_REP','LEGAL_CONTACT',
        'LEGAL_EMAIL','LEGAL_HOURS','LEGAL_WEB','LEGAL_PRIVACY_URL',
        'AUTO_REPLY_SUBJECT','AUTO_REPLY_BODY','NOTIFY_SUBJECT','NOTIFY_BODY',
        'UPLOAD_FOLDER_ID','SHEET_ID','RECAPTCHA_SECRET'
      ];
      const obj = {};
      ids.forEach(function(id) {
        var el = document.getElementById(id);
        obj[id] = el ? el.value : '';
      });

      google.script.run
        .withSuccessHandler(function(p){
          fill(p);
          showToast('設定を保存しました。');
        })
        .withFailureHandler(function(err){
          alert('保存に失敗しました：' + (err && (err.message || err.toString())));
        })
        .api_saveProps(obj);
    }

    function seedDefaults(){
      if(confirm('件名・本文が既定テンプレートで上書きされます。よろしいですか？')){
        google.script.run.withSuccessHandler(function(p){
          fill(p);
          showToast('既定文を反映しました。');
        }).api_seedDefaults();
      }
    }

    load();
  </script>
</body>
</html>
`;

export const ROUTER_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Form Router</title>
  <style>
    html,body{height:100%}
    body{display:flex;align-items:center;justify-content:center;font:14px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;background:#fff}
    .wrap{max-width:640px;padding:24px;text-align:center}
    .muted{color:#64748b}
    noscript a{display:inline-block;margin:6px 8px}
  </style>
  <script>
  (function(){
    'use strict';

    // ===== プレースホルダ（ビルド時に差し込み） =====
    var A_URL = '{{FORM_A_URL}}';
    var B_URL = '{{FORM_B_URL}}';

    // 30日固定の粘着TTL
    var TTL_DAYS = 30;
    var TTL_MS   = TTL_DAYS * 864e5;

    // ===== バリデーション（相対URLも許容） =====
    function valid(u){
      try{ new URL(u, location.href); return true; }catch(_){ return false; }
    }
    if(!valid(A_URL) || !valid(B_URL)){
      console.error('[forms-router] invalid URLs');
      return;
    }

    // 正規化（相対指定でも絶対化する）
    var A = new URL(A_URL, location.href);
    var B = new URL(B_URL, location.href);

    // ===== 粘着キー（パス＋AB構成でユニーク化） =====
    var KEY = 'slp_form_ab:' + location.origin + location.pathname + ':' + A.href + '|' + B.href;

    function now(){ return Date.now(); }
    function getSticky(){
      try{
        var raw = localStorage.getItem(KEY);
        if(!raw) return null;
        var obj = JSON.parse(raw);
        if(!obj || (obj.exp && now() > obj.exp)){ localStorage.removeItem(KEY); return null; }
        return (obj.v==='A'||obj.v==='B') ? obj.v : null;
      }catch(_){ return null; }
    }
    function setSticky(v){
      try{ localStorage.setItem(KEY, JSON.stringify({ v:v, exp: now()+TTL_MS })); }catch(_){}
    }
    function pick(){ return Math.random() < 0.5 ? 'A' : 'B'; }

    // ===== クエリでの上書き（デバッグ用） =====
    var curr  = new URL(location.href);
    var abQ   = (curr.searchParams.get('ab') || curr.searchParams.get('variant') || '').toUpperCase();
    var force = (abQ === 'A' || abQ === 'B') ? abQ : null;

    // ===== 判定（強制 > 粘着 > ランダム） =====
    var variant = force || getSticky() || pick();
    setSticky(variant);

    // ===== 遷移先URL組み立て（元クエリ/ハッシュをマージ） =====
    var base = new URL(variant === 'B' ? B : A);

    // 元クエリを「既にbase側に無いパラメータのみ」追加（※ ab は持ち込まない）
    var SKIP_KEYS = new Set(['ab','slp_ab','variant']);
    curr.searchParams.forEach(function(val, key){
      if(SKIP_KEYS.has(key)) return;
      if(!base.searchParams.has(key)) base.searchParams.append(key, val);
    });

    // どのバリアントで流入したか明示（既に指定があれば上書き）
    base.searchParams.set('ab', variant);

    // 元ページにハッシュがあって、遷移先に無い場合は引き継ぐ
    if(!base.hash && curr.hash){ base.hash = curr.hash; }

    // ===== 遷移（履歴を汚さない） =====
    location.replace(base.toString());
  })();
  </script>
</head>
<body>
  <div class="wrap">
    <p>フォームに移動しています…</p>
    <p class="muted">自動で遷移しない場合は、以下のリンクを押してください。</p>
    <noscript>
      <a href="{{FORM_A_URL}}">Form A</a>
      <a href="{{FORM_B_URL}}">Form B</a>
    </noscript>
  </div>
</body>
</html>
`;

export const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<title id="formTitle">{{FORM_TITLE}}</title>
<link rel="preconnect" href="https://www.google.com" />
<link rel="preconnect" href="https://www.gstatic.com" />
<!-- GTMは下のスクリプトで動的に挿入されます -->
<style>
  :root{
    --bg:#fff8f4; --panel:#fff; --brand:#14b8a6; --brand-fg:#0f766e;
    --accent:#f0908d; --empty:#fff0e6; --bd:#e5e7eb; --muted:#6b7280;
    --text:#141823; --focus:#14b8a6; --radius:14px;
    --link-color: #1f9a9c;
  }
  *{box-sizing:border-box} html,body{height:100%}
  body{margin:0;background:var(--bg);color:var(--text);font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans JP","Hiragino Kaku Gothic ProN","Yu Gothic","Meiryo",sans-serif;-webkit-font-smoothing:antialiased;line-height:1.6;}
  .wrap{max-width:760px;margin:0 auto;padding:20px}
  .card{background:var(--panel);border:1px solid var(--bd);border-radius:var(--radius);padding:22px 16px;box-shadow:0 6px 22px rgba(20,24,35,.04);position:relative}
  .title{font-size:22px;font-weight:800;margin-bottom:6px}
  .sub{font-size:13px;color:var(--muted);margin-bottom:12px}
  .progress{height:8px;background:#f3f4f6;border-radius:999px;overflow:hidden;margin:8px 0 6px}
  .bar{height:100%;width:0;background:var(--brand);transition:width .2s ease}
  .remain{font-size:12px;color:var(--muted);text-align:right;margin-bottom:10px}
  .step{display:none} .step.active{display:block;animation:fade .18s ease}
  @keyframes fade{from{opacity:.01;transform:translateY(4px)}to{opacity:1;transform:none}}
  .bubble{display:flex;gap:10px;align-items:flex-start;margin-bottom:10px}
  .bubble img{width:36px;height:36px;border-radius:50%;object-fit:cover}
  .bubble .msg{background:#fff;border:1px solid var(--bd);border-radius:12px;padding:10px 12px;max-width:100%}
  .q{font-size:18px;font-weight:700;margin-bottom: 12px; margin-top: 4px;}
  .row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-start; margin-bottom: 8px;}
  .col{flex:1 1 300px;min-width:200px; margin-bottom: 8px;}
  label.small{display:block;font-size:12px;color:var(--muted);margin:8px 6px 2px;}
  .label-prefix { font-weight: normal; margin-right: 0.3em; }
  .label-suffix { font-weight: normal; margin-left: 0.3em; }
  .label-required { color: var(--accent); }
  .label-optional { color: var(--muted); }
  /* ▼ バッジ（必須/任意） */
  .badge{display:inline-block;font-size:11px;line-height:1;padding:3px 6px;border-radius:6px;font-weight:700;color:#fff;vertical-align:baseline}
  .badge-req{background:var(--accent)}
  .badge-opt{background:#43b0b1}
  input[type=text],input[type=email],input[type=tel],input[type=url],select,textarea{width:100%;font-size:16px;padding:10px 12px;border:1px solid var(--bd);border-radius:12px;background:#fff;outline:none;transition:.15s;}
  textarea{min-height:120px;resize:vertical}
  input.empty,select.empty,textarea.empty{background:var(--empty)}
  input:focus,select:focus,textarea:focus{border-color:var(--focus);box-shadow:0 0 0 3px rgba(20,184,166,.15)}
  .err{font-size:12px;color:var(--accent);margin:6px 2px 0;display:none} .err.show{display:block}
  .hint{font-size:12px;color:#64748b;margin:6px 2px 0}
  .choices{display:flex;flex-wrap:wrap;gap:10px}
  .chip{border:1px solid var(--bd);border-radius:999px;padding:9px 14px;background:#fff;cursor:pointer;font-size:14px;color:#111827}
  .chip input{display:none} .chip.is-on{border-color:var(--brand);background:rgba(20,184,166,.08);color:var(--brand-fg);font-weight:700}
  .actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
  .btn{appearance:none;border:none;border-radius:12px;padding:8px 16px;font-weight:800;cursor:pointer;font-size:16px;display:inline-flex;align-items:center;gap:8px; white-space: nowrap;}
  .btn.primary{color:#fff;background:var(--brand)} .btn.primary:hover{filter:brightness(1.05)}
  .btn.ghost{background:#fff;border:1px solid var(--bd);color:#111827}
  .btn[disabled]{opacity:.45;pointer-events:none}
  .agree{font-size:13px;color:var(--muted);margin-top:8px}
  .agree label{display:flex;gap:8px;align-items:flex-start} .agree a { color: var(--link-color); text-decoration: none; } .agree a:hover { text-decoration: underline; }
  .up-wrap{margin-top:10px}
  .file-input-wrapper{position:relative;display:inline-block;overflow:hidden;cursor:pointer;}
  .file-input-wrapper input[type=file]{position:absolute;left:0;top:0;opacity:0;width:100%;height:100%;cursor:pointer;}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(92px,1fr));gap:10px;margin-top:10px}
  .thumb{position:relative;border:1px solid var(--bd);border-radius:10px;overflow:hidden;background:#fff}
  .thumb img{width:100%;height:92px;object-fit:cover;display:block}
  .thumb .tn{position:absolute;left:6px;bottom:6px;background:rgba(0,0,0,.6);color:#fff;font-size:10px;padding:2px 6px;border-radius:999px}
  .thumb .del{position:absolute;right:6px;top:6px;width:24px;height:24px;border-radius:50%;border:1px solid #fff;background:rgba(0,0,0,.55);color:#fff;cursor:pointer;display:grid;place-items:center;font-weight:700}
  .overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;align-items:center;justify-content:center;z-index:50} .overlay.show{display:flex}
  .modal{width:min(92vw,720px);max-height:92vh;background:#fff;border-radius:16px;border:1px solid var(--bd);overflow:auto;position:relative}
  .modal .hd{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid var(--bd)}
  .modal .bd{padding:14px 16px} .lead{font-weight:700;margin-bottom:8px} .muted{color:var(--muted);font-size:13px}
  .modal .btn.primary{background:var(--brand)}
  .final-message{font-size:14px; text-align: center; padding: 10px; border: 1px solid var(--bd); border-radius: 8px; margin-top: 15px;}
  .security-info{display:flex;align-items:center;justify-content:center;gap:8px;font-size:12px;font-weight:bold;margin-top:12px;}
  .col-mobile-half { flex: 1 1 calc(50% - 6px) !important; min-width: calc(50% - 6px) !important; }
  .confirm-item { padding: 10px; border-bottom: 1px dashed var(--bd); display: flex; justify-content: space-between; align-items: center; gap: 10px; }
  .confirm-item:last-child { border-bottom: none; }
  .confirm-label { font-weight: bold; color: var(--muted); flex-shrink: 0; min-width: 120px; }
  .confirm-value-wrapper { display: flex; align-items: center; gap: 10px; width: 100%; }
  .confirm-value { white-space: pre-wrap; word-break: break-all; text-align: left; flex-grow: 1; }
  #confirmBox { background:#fff; border:1px solid var(--bd); border-radius:12px; padding:12px; }
  .agree-text { display: inline-block; }
  .birth-gender-separator { margin-top: 24px; }
  @media (max-width:640px){
    .wrap{padding:14px} .card{padding:18px 12px}
    input[type=text],input[type=email],input[type=tel],select,textarea{font-size:16px;padding:11px 12px}
    .btn{padding:8px 16px}
    .col{min-width:100%}
    .confirm-item { flex-direction: column; align-items: flex-start; gap: 4px; }
    .confirm-value-wrapper { width: 100%; justify-content: space-between; }
    .confirm-label { min-width: auto; }
  }
  .suggests{margin-top:6px; position: relative; z-index: 10;}
  .suggest{display:inline-block;margin-right:8px;margin-top:6px;padding:6px 10px;border:1px solid var(--bd);border-radius:999px;background:#fff;cursor:pointer;font-size:12px}
  .suggest:hover{background:#f8fafc}
  /* ▼ 送信中オーバーレイ */
  #sendingOverlay .modal{ max-width:420px; text-align:center; }
  .spinner{ width:28px;height:28px;border:3px solid #e5e7eb;border-top-color:var(--brand);border-radius:50%;animation:spin 1s linear infinite;margin:6px auto 10px;}
  @keyframes spin{to{transform:rotate(360deg)}}

  /* ▼ トースト */
  .toast{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:#475569;color:#fff;padding:10px 14px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.15);opacity:0;pointer-events:none;transition:opacity .2s, transform .2s;z-index:60;transform:translateX(-50%) translateY(6px);}
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .toast.error { background: #dc2626; }   /* エラー時の背景色 (赤) */
</style>

<!-- ▼▼▼ ここにAIが生成した window.CFG を貼り付けてください ▼▼▼ -->

<!-- ▲▲▲ ここまで ▲▲▲ -->

<script>
(function injectGTM(){
  var id = (window.CFG && window.CFG.analytics && window.CFG.analytics.gtm_id) || "";
  if(!id) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
  var s=document.createElement('script');
  s.async=true; s.src='https://www.googletagmanager.com/gtm.js?id='+encodeURIComponent(id);
  document.head.appendChild(s);
  var ns = document.getElementById('gtm-noscript');
  if(ns){
    ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id='+id+'" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
  }
})();
</script>
</head>
<body>
<noscript id="gtm-noscript"></noscript>
<script>
const formSettings = {
  formTitle: "{{FORM_TITLE}}",
  formDescription: "{{FORM_SUBTITLE}}",
  storageKey: "generated-form-v1",
  ga4Id: "{{GA4_ID}}",
  conversionUrl: "",
  operator: { defaultIcon: "https://shungene.lm-c.jp/ef/opr.jpg" },
  recaptchaSiteKey: "{{RECAPTCHA_SITE_KEY}}",
  gasEndpointUrl: "{{GAS_ENDPOINT_URL}}",
  steps: []
};

// === [自動グルーピング版] CFGブリッジ関数 ===
(function(){
  function applyCFGToFormSettingsSimple(F, CFG) {
    try {
      if(!CFG || typeof CFG!== 'object') return;

      // ---- メタ設定
      if(CFG.title) F.formTitle = CFG.title;
      if(CFG.subtitle !== undefined) F.formDescription = CFG.subtitle;
      if(CFG.analytics && CFG.analytics.ga4_id) F.ga4Id = CFG.analytics.ga4_id;
      if(CFG.options) {
        if(CFG.options.recaptcha_site_key) F.recaptchaSiteKey = CFG.options.recaptcha_site_key;
        if(CFG.options.submit_label)       F.submitButtonText = CFG.options.submit_label;
        if (CFG.options.conversion_url)   F.conversionUrl = CFG.options.conversion_url;
        if (CFG.options.gas_endpoint_url) F.gasEndpointUrl = CFG.options.gas_endpoint_url;
      }
      if(CFG.thanks_url_patterns_input) F.thanks_url_patterns_input = CFG.thanks_url_patterns_input;
      // ▼ オペレータ（吹き出しアイコン）設定を取り込み
      if (CFG.operator){
        if (CFG.operator.default_icon) F.operator.defaultIcon = CFG.operator.default_icon;
        if (CFG.operator.defaultIcon)  F.operator.defaultIcon = CFG.operator.defaultIcon;
        if (CFG.operator.step_icons && typeof CFG.operator.step_icons === 'object'){
          F.operator.stepIcons = CFG.operator.step_icons;
        }
      }

      // ---- 入力フィールド（順序保持＋条件グルーピング対応）
      const src = Array.isArray(CFG.fields) ? CFG.fields.map((f,i)=>({ ...f, __idx:i })) : [];
      const used = new Set(); // src の添字を記録
      const take = (fn) => {
        for (let i=0;i<src.length;i++){
          if(used.has(i)) continue;
          const f = src[i];
          if(fn(f)){ used.add(i); return f; }
        }
        return null;
      };
      const takeAll = (fn) => {
        const out = [];
        for (let i=0;i<src.length;i++){
          if(used.has(i)) continue;
          const f = src[i];
          if(fn(f)){ used.add(i); out.push(f); }
        }
        return out;
      };

      const steps = [];
      const pushStep = (s)=>{ steps.push(s); return s; };
      const asOrder = (arr)=> Math.min(...arr.map(f=>f.__idx));

      const getDefaultPlaceholder = (label = '') => {
          if (/会社名|法人名/.test(label)) return '例）株式会社サンプル';
          if (/部署/.test(label)) return '例）営業部';
          if (/役職/.test(label)) return '例）部長';
          if (/業種/.test(label)) return '例）IT・通信';
          if (/(会社|法人|屋号)/.test(label)) return 'ご入力ください';
          return '';
      };

      // === (1+2) お名前＋フリガナ：両方あるときだけグループ化、順序はQ1.3に追従
      const fName = take(f => f.type==='name_full1' || /(^|\\s)(お?名前)\\b/.test(f.label||''));
      const fKana = take(f => f.type==='kana_full1' || /(フリガナ|ふりがな|カナ)/.test(f.label||''));
      if (fName && fKana) {
        pushStep({
          id:'name', type:'group', required:true,
          orderKey: asOrder([fName, fKana]),
          question: 'お名前・ふりがな',
          message: (fName.message || 'お名前を教えてください'),
          fields: {
            fullName:     { label: 'お名前（フルネーム）',  required: !!fName.required, inputType:'text',
                            placeholder: fName.placeholder || '例）山田 太郎' },
            fullNameKana: { label: 'ふりがな', required: !!fKana.required, inputType:'text',
                            description:'※カタカナ可', placeholder: fKana.placeholder || '例）やまだ たろう' }
          }
        });
      } else if (fName || fKana) {
        const f = fName || fKana;
        const isName = !!fName;
        pushStep({
          id: f.id || (isName ? 'fullName' : 'fullNameKana'),
          type:'text', required: !!f.required, orderKey: f.__idx,
          question: (isName ? 'お名前（フルネーム）' : 'ふりがな'),
          message: f.message || (isName ? '' : '※カタカナ可'),
          inputType:'text',
          placeholder: f.placeholder || (isName ? '例）山田 太郎' : '例）やまだ たろう'),
          error: 'お名前を正しく入力してください'
        });
      }

      // === (3〜6) 会社情報：2項目以上でグループ化、1項目なら個別
      const companyFields = takeAll(f =>
        /(会社名|会社|法人|屋号|部署|役職|業種)/.test(f.label||'') ||
        ['company','company_name','department','position','industry'].includes(f.id)
      );
      if (companyFields.length >= 2) {
        const fieldsObj = {};
        companyFields.forEach((f,idx)=>{
          const id = f.id || \`company_\${idx}\`;
          fieldsObj[id] = { label: f.label || '', required: !!f.required, inputType: (['email','tel','url'].includes(f.type)?f.type:'text'), placeholder: f.placeholder || getDefaultPlaceholder(f.label) };
        });
        pushStep({
          id:'company', type:'group', required:false,
          orderKey: asOrder(companyFields),
          question:'会社情報',
          // 固定文をやめ、最初に見つかった message を優先（なければ既定文）
          message: (companyFields.find(f => f.message)?.message) || '法人のお客さまは会社情報もご入力ください。',
          fields: fieldsObj
        });
      } else if (companyFields.length === 1) {
        const f = companyFields[0];
        pushStep({
          id: f.id || 'company_single', type:'text', required: !!f.required,
          orderKey: f.__idx, question: f.label || '会社情報', message: f.message || '',
          inputType: (['email','tel','url'].includes(f.type)?f.type:'text'),
          placeholder: f.placeholder || getDefaultPlaceholder(f.label), error:'会社情報を正しく入力してください'
        });
      }

      // === (8+9) 生年月日＋性別：両方なら同一ステップ、性別のみなら単独ラジオ
      const fBirth  = take(f => f.type==='birth' || /生年月日/.test(f.label||''));
      if (fBirth) {
        const fGender = take(f => f.id==='gender' || /性別/.test(f.label||''));
        pushStep({
          id:'birth', type:'birth', required: !!fBirth.required,
          orderKey: fGender ? asOrder([fBirth, fGender]) : fBirth.__idx,
          question: (fBirth.label || '生年月日'),
          // 固定文をやめ、フィールド側 message を優先
          message: fBirth.message || (fGender && fGender.message) || '生年月日を選択し、性別もあれば選択してください。',
          gender: fGender ? {
            required: !!fGender.required,
            choices: Array.isArray(fGender.choices) && fGender.choices.length ? fGender.choices : ['男性','女性','回答しない']
          } : null
        });
      } else {
        const gOnly = take(f => f.id==='gender' || /性別/.test(f.label||''));
        if (gOnly) {
          pushStep({
            id:'gender', type:'radio', required: !!gOnly.required, orderKey: gOnly.__idx,
            question: gOnly.label || '性別', message: '',
            options: Array.isArray(gOnly.choices)&&gOnly.choices.length? gOnly.choices : ['男性','女性','回答しない'],
            error:'どれか1つお選びください'
          });
        }
      }

      // ★ 住所（単独）
      const fAddress = take(f => f.type === 'address' || /住所/.test(f.label || ''));
      if (fAddress) {
        pushStep({
          id: fAddress.id || 'address',
          type: 'address',
          required: !!fAddress.required,
          orderKey: fAddress.__idx,
          question: fAddress.label || '住所',
          message: fAddress.message || '郵便番号を入力すると自動補完されます。'
        });
      }

      // 連絡先（10+11：両方なら同一ステップ）
      const fEmail = take(f => f.type==='email' || /メールアドレス|mail/i.test(f.label||'') || f.id==='email');
      const fTel   = take(f => f.type==='tel'   || /電話番号|tel/i.test(f.label||'')     || f.id==='tel');
      if (fEmail && fTel) {
        pushStep({
          id:'contact', type:'group', question:'ご連絡先', message: (fEmail.message || fTel.message || '普段つながりやすい連絡先をご入力ください。'),
          orderKey: asOrder([fEmail, fTel]),
          fields: {
            email:{ label: fEmail.label || 'メールアドレス', description: '※入力とともにドメイン表示', required: !!fEmail.required, inputType:'email', placeholder: fEmail.placeholder || '例）contact@example.com' },
            tel:  { label: fTel.label   || '電話番号',       description: '※半角全角可、ハイフン自動カット', required: !!fTel.required,   inputType:'tel',   placeholder: fTel.placeholder   || '例）09012345678' }
          }
        });
      } else if (fEmail || fTel) {
        const f = fEmail || fTel, isEmail = !!fEmail;
        pushStep({
          id: isEmail ? 'email':'tel',
          type:'text',
          required: !!f.required,
          orderKey: f.__idx,
          question: f.label || (isEmail ? 'メールアドレス':'電話番号'),
          message: f.message || (isEmail ? 'ご連絡用のメールアドレスをご入力ください。':'お電話での連絡をご希望の場合はご入力ください。'),
          inputType: isEmail ? 'email':'tel',
          description: isEmail ? '※入力とともにドメイン表示' : '※半角全角可、ハイフン自動カット',
          placeholder: f.placeholder || (isEmail ? '例）contact@example.com':'例）09012345678'),
          error: isEmail ? 'メールアドレスを正しく入力してください':'電話番号を正しく入力してください'
        });
      }

      // (13+14) お問い合わせ内容＋画像添付：両方あれば同一ステップ、順序は早い方に寄せる
      const fInquiryTextarea = take(f => f.type==='textarea' && /(お問い合わせ内容|自由記入|ご相談内容)/.test(f.label||''));
      const fFileMain = take(f => f.type==='file');
      if (fInquiryTextarea && fFileMain) {
        pushStep({
          id: fInquiryTextarea.id || 'inquiry',
          type:'textarea', required: !!fInquiryTextarea.required,
          orderKey: asOrder([fInquiryTextarea, fFileMain]),
          question: fInquiryTextarea.label || 'お問い合わせ内容（自由記入欄）',
          message: fInquiryTextarea.message || '',
          placeholder: fInquiryTextarea.placeholder || '例）ご不明点やご相談内容をご記入ください',
          error:'入力してください',
          fileUpload: {
            id: fFileMain.id || 'image_attachment',
            required: !!fFileMain.required,
            question: fFileMain.label || '画像添付',
            accept: fFileMain.accept || 'image/*',
            multiple: (fFileMain.multiple !== false),
            hint: (typeof fFileMain.maxTotalMB === 'number'
                  ? \`最大\${fFileMain.maxFiles||5}枚・合計\${fFileMain.maxTotalMB}MBまで\`
                  : '最大5枚・合計5MBまで'),
            maxFiles: fFileMain.maxFiles || 5,
            maxTotalMB: fFileMain.maxTotalMB || 5
          }
        });
      } else if (fInquiryTextarea) {
        pushStep({
          id: fInquiryTextarea.id || 'inquiry',
          type:'textarea', required: !!fInquiryTextarea.required,
          orderKey: fInquiryTextarea.__idx,
          question: fInquiryTextarea.label || 'お問い合わせ内容（自由記入欄）',
          message: fInquiryTextarea.message || '',
          placeholder: fInquiryTextarea.placeholder || '例）ご不明点やご相談内容をご記入ください',
          error:'入力してください'
        });
      } else if (fFileMain) {
        pushStep({
          id: fFileMain.id || 'image_attachment',
          type:'file_upload', required: !!fFileMain.required,
          orderKey: fFileMain.__idx,
          question: fFileMain.label || '画像添付',
          accept: fFileMain.accept || 'image/*',
          maxFiles: fFileMain.maxFiles || 5,
          maxTotalMB: fFileMain.maxTotalMB || 5,
          hint: (typeof fFileMain.maxTotalMB === 'number'
                  ? \`最大\${fFileMain.maxFiles||5}枚・合計\${fFileMain.maxTotalMB}MBまで\`
                  : '最大5枚・合計5MBまで')
        });
      }

      // まず未使用フィールドを通常変換（Q1.3の順序どおり）
      for (let i=0;i<src.length;i++){
        if (used.has(i)) continue;
        const f = src[i];
        const base = {
          id: f.id || \`field_\${i}\`,
          required: !!f.required,
          question: f.label || \`質問\${i + 1}\`,
          message: f.message || '',
          orderKey: f.__idx
        };

        if (f.type === 'textarea') {
          steps.push({ ...base, type:'textarea', placeholder: f.placeholder || '例）ご不明点やご相談内容をご記入ください', error:'入力してください' });
          used.add(i);
          continue;
        }

        if (f.type === 'file') {
          steps.push({ 
            ...base, 
            type:'file_upload',
            question: base.question || '画像添付',
            accept: f.accept || 'image/*',
            maxFiles: f.maxFiles || 5,
            maxTotalMB: f.maxTotalMB || 5,
            hint: (typeof f.maxTotalMB === 'number'
                    ? \`最大\${f.maxFiles||5}枚・合計\${f.maxTotalMB}MBまで\`
                    : '最大5枚・合計5MBまで')
          });
          used.add(i);
          continue;
        }

        if (['radio','checkbox','select'].includes(f.type)) {
          steps.push({ ...base, type:f.type, options: Array.isArray(f.choices)? f.choices:[], error: f.type==='checkbox'?'必ず1つ以上お選びください':'どれか1つお選びください' });
          used.add(i);
          continue;
        }
        
        // その他テキスト系
        const it = (['email','tel','url'].includes(f.type) ? f.type : 'text');
        steps.push({ ...base, type:'text', inputType: it, placeholder: f.placeholder || getDefaultPlaceholder(f.label), error:'正しく入力してください' });
        used.add(i);
      }

      // 6) 確認
      const confirmStep = {
        id:'confirm', type:'confirm', question:'入力内容の確認',
        message: (CFG.options && (CFG.options.confirm_message || CFG.options.confirmMessage)) || '入力内容をご確認ください。',
        privacyPolicy:{
          required:true,
          text: \`個人情報の取り扱いに同意します (<a href="\${(CFG.options && CFG.options.privacy_policy_url) || '#'}" target="_blank" rel="noopener noreferrer">詳細はこちら</a>)\`,
          error:'※ご同意いただけない場合は送信できません'
        },
        newsletter: (CFG.options && CFG.options.newsletter)
          ? { enabled: !!CFG.options.newsletter.enabled, text: CFG.options.newsletter.label || '' }
          : { enabled:false }
      };
      steps.push(confirmStep);

      // ▼ 並べ替え：confirm 以外を orderKey 昇順（= Q1.3 の選択順）に
      const confirm = steps.find(s=>s.id==='confirm');
      const others  = steps.filter(s=>s!==confirm).sort((a,b)=> (a.orderKey??1e9)-(b.orderKey??1e9));
      F.steps = confirm ? [...others, confirm] : others;
      // ▼ ステップごとのアイコン割り当て
      assignStepIcons_(F);

    } catch(e) {
      console.error('Failed to apply CFG:', e);
    }
  }
  window.__applyCFGToFormSettings = applyCFGToFormSettingsSimple;
  // ▼ ステップアイコン割り当てヘルパー
  function assignStepIcons_(F){
    const map = (F.operator && F.operator.stepIcons) || {};
    if (!map || typeof map !== 'object') return;
    F.steps.forEach(s=>{
      const candidates = [s.id, s.question].filter(Boolean);
      let icon = '';
      for (const c of candidates){
        if (map[c]) { icon = map[c]; break; }
        for (const k in map){
          if (k && (c||'').includes(k)) { icon = map[k]; break; }
        }
        if (icon) break;
      }
      s.icon = icon || (F.operator && F.operator.defaultIcon) || '';
    });
  }
})();
</script>
<div class="wrap">
  <div class="card" id="formCard">
    <div class="title" id="formTitleText"></div>
    <div class="sub" id="formDescriptionText"></div>
    <div class="progress"><div class="bar" id="bar"></div></div>
    <div class="remain" id="remain"></div>
    <div id="stepsContainer"></div>
  </div>
</div>
<div class="overlay" id="leaveStage1" aria-modal="true" role="dialog">
  <div class="modal">
    <div class="hd"><strong>入力を中断しますか？</strong></div>
    <div class="bd">
      <div class="lead">残り <span id="lvRemain">0</span> 問です。</div>
      <div class="actions" style="margin-top:14px">
        <button class="btn primary" id="lvBack">戻って続ける</button>
        <button class="btn ghost" id="lvExit">入力を中断する</button>
      </div>
    </div>
  </div>
</div>
<div class="overlay" id="leaveStage2" aria-modal="true" role="dialog">
  <div class="modal">
    <div class="hd"><strong>入力を保存しますか？</strong></div>
    <div class="bd">
      <div class="muted">下書き保存しておくと、次回は続きから再開できます。</div>
      <div class="actions" style="margin-top:10px">
        <button class="btn primary" id="lvSaveClose">保存して閉じる</button>
        <button class="btn ghost" id="lvDiscardClose">破棄して閉じる</button>
      </div>
    </div>
  </div>
</div>

<div class="overlay" id="sendingOverlay" aria-modal="true" role="dialog">
  <div class="modal">
    <div class="hd"><strong>送信中です...</strong></div>
    <div class="bd">
      <div class="spinner" aria-hidden="true"></div>
      <div class="muted">数秒お待ちください</div>
    </div>
  </div>
</div>

<div id="toast" class="toast" role="status" aria-live="polite"></div>

<script>
document.addEventListener('DOMContentLoaded', () => {
  if (!navigator.userAgentData) { navigator.userAgentData = { mobile: /Mobi|Android/i.test(navigator.userAgent) }; }
  
  if (window.CFG && typeof window.__applyCFGToFormSettings === 'function') { window.__applyCFGToFormSettings(formSettings, window.CFG); }
  const S = formSettings;

  if (window.dataLayer) { window.dataLayer.push({ 'event':'form_init', 'form_name': formSettings.formTitle, 'ga4_id': formSettings.ga4Id, 'cv_patterns': formSettings.thanks_url_patterns_input || '' }); }
  if (formSettings.recaptchaSiteKey && formSettings.recaptchaSiteKey !== 'YOUR_RECAPTCHA_SITE_KEY' && !window.__recaptchaLoaded) { var s=document.createElement('script'); s.src='https://www.google.com/recaptcha/api.js?render='+encodeURIComponent(formSettings.recaptchaSiteKey); s.async=true; s.defer=true; document.head.appendChild(s); window.__recaptchaLoaded=true; }
  const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
  let steps = [], currentStepIdx = 0; const state = JSON.parse(localStorage.getItem(S.storageKey) || "{}");
  let formClosedByUser = false; let returnToConfirm = false; let returnFocusId = null; const confirmIndex = S.steps.findIndex(s=>s.type==='confirm');
  let leaveStage2Mode = 'save'; // 'save' | 'resume'
  const save = () => {
    state.savedAt = new Date().toISOString();
    const safe = JSON.stringify(state, (k, v) => {
      // ファイル配列（{name, size, type, data}...）は data を落として保存（容量事故回避）
      if (Array.isArray(v) && v.length && typeof v[0] === 'object' && 'name' in v[0] && 'data' in v[0]) {
        return v.map(({name, size, type}) => ({name, size, type}));
      }
      return v;
    });
    localStorage.setItem(S.storageKey, safe);
  };
  const toHalf = s => (s||"").replace(/[\\uFF01-\\uFF5E]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0xFEE0)).replace(/\\u3000/g,' ');
  const digits = s => toHalf(s).replace(/[^\\d]/g,'');
  const emailOk=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const markEmpty=el=>el.classList[((el.value||"")+"").trim()?"remove":"add"]("empty");
  const updateSelectEmpty = (el)=>{ el.classList[((el.value||"")+"").trim()?"remove":"add"]("empty"); };
  const stepsConf = S.steps;
  const questionSteps = S.steps.filter(s => s.type !== 'confirm');
  const questionStepsCount = questionSteps.length;

  // --- 離脱ポップ：原則いつでも表示。例外＝(1)保存して閉じる後は恒久抑止 (2)破棄直後60秒だけ抑止
  const RE_PROMPT_WINDOW_MS = 60000;
  const suppressUntilKey = S.storageKey + ':suppressExitUntil';
  const eligibleToPromptExit = () => {
    if (formClosedByUser) return false; // 保存して閉じる後は出さない
    const suppressUntil = +(sessionStorage.getItem(suppressUntilKey) || 0);
    if (Date.now() < suppressUntil) return false; // 破棄直後の一時抑止
    return true; // それ以外は常に表示
  };

  const hasUserEnteredData = () => {
    return Object.keys(state).some(key => {
      if (['savedAt', 'lastStepIndex'].includes(key)) return false;
      const value = state[key];
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      return String(value).trim() !== '';
    });
  };
  
  // ▼ トースト表示
  function showToast(msg, type = 'default'){ // type: 'success' | 'error'
    const t = document.getElementById('toast');
    if(!t) return;
    t.textContent = msg;
    t.classList.remove('success', 'error'); // 既存のタイプクラスを削除
    if (type !== 'default') {
      t.classList.add(type);
    }
    t.classList.add('show');
    setTimeout(()=> {
      t.classList.remove('show');
      // アニメーションが終わった後にクラスをクリーンアップ
      if (type !== 'default') {
        setTimeout(() => t.classList.remove(type), 300);
      }
    }, 2400);
  }

  // ▼ 送信中オーバーレイ表示/非表示
  function showSendingOverlay(on, text){
    const ov = document.getElementById('sendingOverlay');
    if(!ov) return;
    if(text){ const h = ov.querySelector('.hd strong'); if(h) h.textContent = text; }
    ov.classList[on ? 'add' : 'remove']('show');
  }

  // ▼ デフォルトプレースホルダ（すべての「記入できるところ」に例を入れる）
  const defaultPlaceholderForType = (t) => {
    switch (t) {
      case 'email': return '例）contact@example.com';
      case 'tel':   return '例）09012345678';
      case 'url':   return '例）https://example.com';
      default:      return '例）テキストを入力';
    }
  };

  // ▼ スキーマ（列見出し）＋ 値（列ごとの値）を作る
  function buildSchemaAndKV(){
    const schema = [];
    const kv = {};
    const push = (label, val) => { if (!schema.includes(label)) schema.push(label); kv[label] = (val ?? ''); };

    const pick = (id)=> state[id] ?? '';
    const pickOther = (id)=> {
      const v=pick(id), vo=(state[id+"_other"]||'').trim();
      if(Array.isArray(v)){
        const arr=[...v];
        if(v.includes('その他') && vo) arr.splice(arr.indexOf('その他'),1,\`その他: \${vo}\`);
        return arr.join(', ');
      } else { return (v==='その他' && vo) ? \`その他: \${vo}\` : v; }
    };

    for(const s of S.steps.filter(ss=>ss.type!=='confirm')){
      switch(s.type){
        case 'group': {
          for (const [fid, conf] of Object.entries(s.fields)){
            const label = conf.label || fid;
            push(label, pick(fid));
          }
          break;
        }
        case 'birth': {
          const label = s.question || '生年月日';
          const y = state[s.id+'_y']||'', m = state[s.id+'_m']||'', d = state[s.id+'_d']||'';
          push(label, (y && m && d) ? \`\${y}-\${('0'+m).slice(-2)}-\${('0'+d).slice(-2)}\` : '');
          if (s.gender) push('性別', state['gender']||'');
          break;
        }
        case 'address': {
          push('郵便番号', pick(\`\${s.id}_zip\`));
          push('都道府県', pick(\`\${s.id}_pref\`));
          push('市区町村', pick(\`\${s.id}_city\`));
          push('番地・建物名', pick(\`\${s.id}_line\`));
          break;
        }
        case 'checkbox': case 'radio': case 'select': {
          const label = s.question || s.id;
          push(label, pickOther(s.id));
          break;
        }
        case 'textarea': {
          const label = s.question || s.id;
          push(label, pickOther(s.id));
          if (s.fileUpload) {
            const fuLabel = s.fileUpload.question || '画像添付';
            const names = (state[s.fileUpload.id]||[]).map(f=>f.name).join(', ');
            push(fuLabel, names);
          }
          break;
        }
        case 'file_upload': {
          const label = s.question || '画像添付';
          push(label, (state[s.id]||[]).map(f=>f.name).join(', '));
          break;
        }
        default: {
          const label = s.question || s.id;
          push(label, pickOther(s.id));
        }
      }
    }
    
    // [PATCH APPLIED] ニュースレター購読状態を送信データに追加
    const confirmStep = S.steps.find(s => s.id === 'confirm');
    if (confirmStep?.newsletter?.enabled) {
      push('ニュースレター', state.subscribe ? 'ON' : 'OFF');
    }

    return { schema, kv };
  }
  
  // [PATCH APPLIED] 送信用の実ファイルを集める関数を追加
  function collectFilesForUpload() {
    // CFGで使われている全アップロードIDを列挙
    const ids = [];
    S.steps.forEach(s => {
      if (s.type === 'file_upload') ids.push(s.id);
      if (s.type === 'textarea' && s.fileUpload) ids.push(s.fileUpload.id);
    });

    const files = [];
    const missing = []; // dataを失った（再開時など）検出用

    ids.forEach(id => {
      const arr = Array.isArray(state[id]) ? state[id] : [];
      arr.forEach(f => {
        if (f && f.data) {
          files.push({ name: f.name, size: f.size || 0, type: f.type || '', data: f.data });
        } else {
          missing.push({ id, name: f?.name || '' });
        }
      });
    });
    return { files, missing };
  }

  // ▼ GAS へPOST
  async function postToGAS(payload){
    const url = (S.gasEndpointUrl || "").trim();
    // テンプレ（{{GAS_ENDPOINT_URL}}）や未設定時はスキップ（デモ時エラー回避）
    if (!url || /^\\{\\{GAS_ENDPOINT_URL\\}\\}$/.test(url)) return { ok:true };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type":"application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({ payload: JSON.stringify(payload) })
    });
    let json = {};
    try{ json = await res.json(); }catch(_){ }
    return (json && json.ok) ? { ok:true } : { ok:false, error: json.error || ("HTTP "+res.status) };
  }

  function createStepHTML(stepConf, isFirst, isLast) {
    let contentHTML = '';
    switch (stepConf.type) {
      case 'group':       contentHTML = createGroupFields(stepConf); break;
      case 'textarea':    contentHTML = createTextareaField(stepConf); break;
      case 'text':        contentHTML = createTextField(stepConf); break;
      case 'radio':       contentHTML = createChoicesField('radio', stepConf); break;
      case 'checkbox':    contentHTML = createChoicesField('checkbox', stepConf); break;
      case 'select':      contentHTML = createSelectField(stepConf); break;
      case 'birth':       contentHTML = createBirthFields(stepConf); break;
      case 'address':     contentHTML = createAddressFields(stepConf); break;
      case 'file_upload': contentHTML = createFileUploadField(stepConf); break;
      case 'confirm':     contentHTML = createConfirmScreen(stepConf); break;
    }

    const bubbleText = ((typeof stepConf.message === 'string' && stepConf.message.trim()) || stepConf.question || '');
    const iconUrl =
      stepConf.icon ||
      (S.operator && S.operator.stepIcons && (S.operator.stepIcons[stepConf.id] || S.operator.stepIcons[stepConf.question])) ||
      (S.operator && S.operator.defaultIcon) || '';
    const escHtml = (s) => String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\'':'&#39;'}[m]));
    const bubbleSafe = escHtml(bubbleText);
    
    // [PATCH APPLIED] iconUrlがあるときだけ<img>を出力
    const iconHTML = iconUrl ? \`<img src="\${iconUrl}" alt="">\` : '';
    const bubbleHTML = bubbleText
      ? \`<div class="bubble">\${iconHTML}<div class="msg">\${bubbleSafe}</div></div>\`
      : '';

    const titleHTML = '';

    const prevBtn = isFirst ? '' : '<button type="button" class="btn ghost" data-prev>戻る</button>';
    const idx = stepsConf.findIndex(s => s.id === stepConf.id);
    const isBeforeConfirm = stepsConf[idx + 1]?.type === 'confirm';
    let nextBtnText = '次へ';
    if (isBeforeConfirm) {
      nextBtnText = '入力内容を確認する';
    } else {
      const qIdx = stepsConf.filter(s => s.type !== 'confirm').findIndex(s => s.id === stepConf.id);
      const remainQs = qIdx >= 0 ? Math.max(0, questionStepsCount - (qIdx + 1)) : 0;
      nextBtnText = \`次へ（残り\${remainQs}問）\`;
    }
    const nextBtn = stepConf.type === 'confirm' ? '' : \`<button type="button" class="btn primary" data-next>\${nextBtnText}</button>\`;
    const actions = stepConf.type !== 'confirm' ? \`<div class="actions">\${prevBtn}\${nextBtn}</div>\` : '';

    return \`<div class="step" data-step-id="\${stepConf.id}">\${bubbleHTML}\${titleHTML}\${contentHTML}\${actions}</div>\`;
  }
  const createLabel = (text, isRequired, description = '') => {
    const badge = isRequired ? '<span class="badge badge-req">必須</span>' : '<span class="badge badge-opt">任意</span>';
    const descText = description ? \` \${description}\` : '';
    return \`<label class="small">\${badge} \${text}\${descText}</label>\`;
  };
  const createGroupFields = (c) => \`<div class="row">\${
    Object.entries(c.fields).map(([id, conf]) => \`
      <div class="col">
        \${createLabel(conf.label, !!conf.required, conf.description)}
        <input id="\${id}" type="\${conf.inputType||'text'}" placeholder="\${conf.placeholder || defaultPlaceholderForType(conf.inputType||'text')}" class="empty" />
        <div class="err" id="err_\${id}">\${conf.label}を入力してください</div>
        \${conf.inputType==='email' ? \`<div class="suggests" id="suggests_\${id}"></div>\` : \`\`}
      </div>
    \`).join('')
  }</div>\`;
  const createTextareaField = (c) => {
    const base = \`<div class="col" style="width:100%">
      \${createLabel(c.question, c.required, c.description)}
      <textarea id="\${c.id}" placeholder="\${c.placeholder || '例）ご相談内容をご記入ください'}" class="empty" autocapitalize="none" autocorrect="off" spellcheck="false"></textarea>
      <div class="err" id="err_\${c.id}">\${c.error || '入力してください'}</div>
    </div>\`;

    if (!c.fileUpload) return base;

    const fu = c.fileUpload;
    const fuHTML = \`<div class="up-wrap col" style="width:100%">
      \${createLabel(fu.question || '画像添付', !!fu.required)}
      <label class="file-input-wrapper btn ghost" for="\${fu.id}">画像を選択</label>
      <input id="\${fu.id}" type="file" accept="\${fu.accept || 'image/*'}" \${fu.multiple !== false ? 'multiple' : ''} style="display:none;" />
      <div class="hint">\${fu.hint || ''}</div>
      <div class="grid" id="previewGrid_\${fu.id}"></div>
      <div class="err" id="err_\${fu.id}">画像を選択してください</div>
    </div>\`;
    return base + fuHTML;
  };
  const createTextField = (c) => {
    const ph = c.placeholder || defaultPlaceholderForType(c.inputType || 'text');
    return \`<div class="col" style="width:100%">\${createLabel(c.question, c.required, c.description)}<input id="\${c.id}" type="\${c.inputType || 'text'}" placeholder="\${ph}" class="empty" autocapitalize="none" autocorrect="off" spellcheck="false" /><div class="err" id="err_\${c.id}">\${c.error || '正しく入力してください'}</div><div class="suggests" id="suggests_\${c.id}"></div></div>\`;
  };
  const createChoicesField = (type, c) => {
    const hasOther = (c.options||[]).includes('その他');
    const desc = type === 'checkbox' ? (c.description ? c.description + ' ※複数選択可' : '※複数選択可') : c.description;
    const otherBox = hasOther
      ? \`<div id="\${c.id}_other_wrap" style="display:none;margin-top:8px;">\${createLabel('その他', c.required)}<textarea rows="1" id="\${c.id}_other" class="empty" placeholder="\${c.otherPlaceholder || '例）その他の内容を入力'}" autocapitalize="none" autocorrect="off" spellcheck="false" style="height:40px;"></textarea><div class="err" id="err_\${c.id}_other">その他の内容を入力してください</div></div>\`
      : '';
    return \`<div class="col" style="width:100%">\${createLabel(c.question, c.required, desc)}<div class="choices" id="\${c.id}">\${c.options.map(opt => \`<label class="chip"><input type="\${type}" name="\${c.id}" value="\${opt}">\${opt}</label>\`).join('')}</div><div class="err" id="err_\${c.id}">\${c.error || '選択してください'}</div>\${otherBox}</div>\`;
  };
  const createSelectField = (c) => {
    const hasOther = (c.options||[]).includes('その他');
    const opts = (c.options||[]).map(o=>\`<option value="\${o}">\${o}</option>\`).join('');
    const otherBox = hasOther
      ? \`<div id="\${c.id}_other_wrap" style="display:none;margin-top:8px;">\${createLabel('その他', c.required)}<textarea rows="1" id="\${c.id}_other" class="empty" placeholder="\${c.otherPlaceholder || '例）その他の内容を入力'}" autocapitalize="none" autocorrect="off" spellcheck="false" style="height:40px;"></textarea><div class="err" id="err_\${c.id}_other">その他の内容を入力してください</div></div>\`
      : '';
    return \`<div class="col" style="width:100%">\${createLabel(c.question, c.required)}<select id="\${c.id}" class="empty"><option value="" disabled selected>選択してください</option>\${opts}</select><div class="err" id="err_\${c.id}">\${c.error || '選択してください'}</div>\${otherBox}</div>\`;
  };
  const createBirthFields = (c) => {
    const base = \`<div class="row" style="gap:8px;"><div class="col" style="min-width:120px; flex-grow:1.5;">\${createLabel('年', c.required)}<select id="\${c.id}_y" class="empty"></select><div class="err" id="err_\${c.id}_y">年を選択してください</div></div><div class="col" style="min-width:70px;">\${createLabel('月', c.required)}<select id="\${c.id}_m" class="empty"></select><div class="err" id="err_\${c.id}_m">月を選択してください</div></div><div class="col" style="min-width:70px;">\${createLabel('日', c.required)}<select id="\${c.id}_d" class="empty"></select><div class="err" id="err_\${c.id}_d">日を選択してください</div></div></div>\`;
    const genderHTML = c.gender ? \`<div class="birth-gender-separator"></div>\` + createChoicesField('radio', { id:'gender', question:'性別', required: !!c.gender.required, options: Array.isArray(c.gender.choices)&&c.gender.choices.length? c.gender.choices : ['男性','女性','回答しない'], error:'どれか1つお選びください' }) : '';
    return base + genderHTML;
  };
  const createAddressFields = (c) => {
    return \`<div class="row"><div class="col">\${createLabel('郵便番号', c.required, '※半角全角可、ハイフン自動カット')}<input id="\${c.id}_zip" type="text" placeholder="例）1000001" class="empty" inputmode="numeric" /><div class="err" id="err_\${c.id}_zip"></div></div></div><div class="row"><div class="col">\${createLabel('都道府県', c.required, '※郵便番号から自動入力')}<input id="\${c.id}_pref" type="text" class="empty" placeholder="例）東京都" /><div class="err" id="err_\${c.id}_pref"></div></div><div class="col">\${createLabel('市区町村', c.required, '※郵便番号から自動入力')}<input id="\${c.id}_city" type="text" class="empty" placeholder="例）千代田区千代田" /><div class="err" id="err_\${c.id}_city"></div></div></div><div class="row"><div class="col">\${createLabel('番地・建物名', c.required)}<input id="\${c.id}_line" type="text" class="empty" placeholder="例）1-1-1 ○○ビル3F" /><div class="err" id="err_\${c.id}_line"></div></div></div>\`;
  };
  const createFileUploadField = (c) => \`<div class="up-wrap col" style="width:100%">\${createLabel(c.question || '画像添付', c.required)}<label class="file-input-wrapper btn ghost" for="\${c.id}">画像を選択</label><input id="\${c.id}" type="file" accept="\${c.accept || 'image/*'}" multiple style="display:none;" /><div class="hint">\${c.hint || ''}</div><div class="grid" id="previewGrid_\${c.id}"></div><div class="err" id="err_\${c.id}">画像を選択してください</div></div>\`;
  const createConfirmScreen = (c) => {
    return \`<div id="confirmBox"></div>
      <div class="agree"><label><input id="agree" type="checkbox"><span class="agree-text"><span class="badge badge-req">必須</span> \${c.privacyPolicy.text}</span></label></div><div class="err show" id="err_agree" style="visibility:hidden;">\${c.privacyPolicy.error}</div>
      \${c.newsletter?.enabled ? \`<div class="agree"><label><input id="subscribe" type="checkbox"><span class="agree-text"><span class="badge badge-opt">任意</span> \${c.newsletter.text || 'ニュースレター/最新情報を受け取る'}</span></label></div>\` : ''}
      <div class="actions"><button type="button" class="btn ghost" data-prev>戻る</button><button type="button" class="btn primary" id="submitBtn" disabled>\${formSettings.submitButtonText || '送信'}</button></div>
      <div class="security-info"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/></svg>ご入力いただいた情報はSSLにより暗号化され、安全に送信されます</div>\`;
  }
  function initializeForm() {
    $("#formTitle").textContent = S.formTitle; $("#formTitleText").textContent = S.formTitle; $("#formDescriptionText").textContent = S.formDescription;
    const container = $("#stepsContainer"); container.innerHTML = stepsConf.map((step, i) => createStepHTML(step, i === 0, i === stepsConf.length - 1)).join('');
    steps = $$(".step"); bindNavigation(); bindFieldLogic();
    if (hasUserEnteredData()) {
      if (!sessionStorage.getItem(S.storageKey + ':resumed')) {
        showResumePrompt();
      } else {
        hydrateFromState();
        showStep(typeof state.lastStepIndex === 'number' ? Math.min(state.lastStepIndex, steps.length - 1) : 0);
      }
    } else {
      showStep(0);
    }
  }
  function hydrateFromState(){
    $$("input:not([type=radio],[type=checkbox]), textarea, select").forEach(el=>{
      const id = el.id; if(!id) return; if(state[id]===undefined) return;
      el.value = state[id]||''; if(el.tagName==='SELECT') updateSelectEmpty(el); else markEmpty(el);
    });
    $$(".choices").forEach(c=>{
      const id=c.id; if(!id) return; const inputs=$$("#"+id+" input", c); if(!inputs.length) return;
      if(inputs[0].type==='radio'){ inputs.forEach(inp=>{inp.checked = (state[id]===inp.value); inp.closest('.chip')?.classList.toggle('is-on', inp.checked);}); }
      else{ const vals = Array.isArray(state[id])?state[id]:[]; inputs.forEach(inp=>{const on=vals.includes(inp.value); inp.checked = on; inp.closest('.chip')?.classList.toggle('is-on', on);}); }
      toggleOtherBox(id); const otherEl = $("#"+id+"_other"); if(otherEl && state[id+"_other"]) { otherEl.value = state[id+"_other"]; markEmpty(otherEl); }
    });
    S.steps.forEach(s => { if(s.type==='birth' && state[s.id]){ const [yy,mm,dd]=state[s.id].split('-'); if(yy) $("#"+s.id+"_y").value=yy; if(mm) $("#"+s.id+"_m").value=String(+mm); if(dd) $("#"+s.id+"_d").value=String(+dd); [$("#"+s.id+"_y"), $("#"+s.id+"_m"), $("#"+s.id+"_d")].forEach(updateSelectEmpty); } });
    $$("select").forEach(el=>el.dispatchEvent(new Event('change')));
  }
  function showStep(index) {
    steps[currentStepIdx]?.classList.remove("active"); 
    currentStepIdx = Math.max(0, Math.min(index, steps.length - 1));
    steps[currentStepIdx]?.classList.add("active"); 
    updateProgress();
    if (steps[currentStepIdx]?.dataset.stepId === 'confirm') { buildConfirm(); validateCurrentStep(false); }
    const firstInput = steps[currentStepIdx]?.querySelector("input,select,textarea"); firstInput?.focus({ preventScroll: true });
    state.lastStepIndex = currentStepIdx; save();
  }
  function updateProgress() {
    if (!S.steps[currentStepIdx]) return;
    const currentQuestionNum = currentStepIdx + 1;
    let progressPercentage = 0;
    if (currentStepIdx < questionStepsCount) { progressPercentage = ((currentQuestionNum) / questionStepsCount) * 100; }
    else { progressPercentage = 100; }
    $("#bar").style.width = \`\${progressPercentage}%\`;
    if (S.steps[currentStepIdx].type === 'confirm') {
      $("#remain").textContent = '入力内容の確認';
    }
    else { $("#remain").textContent = \`質問 \${currentQuestionNum}/\${questionStepsCount}\`; }
  }
  function bindNavigation() { $("#stepsContainer").addEventListener('click', (e) => { const target = e.target.closest('button'); if (!target) return; if (target.matches('[data-next]')) { if (validateCurrentStep(true)) { if(returnToConfirm){ showStep(confirmIndex); returnToConfirm=false; return; } showStep(currentStepIdx + 1); } } else if (target.matches('[data-prev]')) { returnToConfirm=false; showStep(currentStepIdx - 1); } else if (target.id === 'submitBtn') { if (validateCurrentStep(true)) submitNow(); }}); }
  function bindFieldLogic() {
    $$("select").forEach(el=>{ el.addEventListener('change', ()=>{ state[el.id]=el.value; updateSelectEmpty(el); save(); if(el.dataset.touched==='1') validateCurrentStep(false); toggleOtherBox(el.id); const otherEl = $("#"+el.id+"_other"); if(otherEl){ otherEl.addEventListener('input', ()=>{ state[el.id+"_other"] = otherEl.value; save(); if(otherEl.dataset.touched==='1') validateCurrentStep(false); }); } }); });
    $$("input, textarea").forEach(el => {
      if (el.type==='radio'||el.type==='checkbox'||el.type==='file') return;
      // TELは入力即時整形（Safari配慮：IME中は整形しない／キャレット保持）
      if (el.type==='tel' || el.id==='tel') {
        const telFmt = bindTelFormat();
        let composing = false;
        el.addEventListener('compositionstart', ()=> composing = true);
        el.addEventListener('compositionend', ()=> { composing = false; telFmt(el); });
        el.addEventListener('input', () => { if (!composing) telFmt(el); });
        el.addEventListener('blur', () => { el.dataset.touched = "1"; telFmt(el); });
        return;
      }
      const handler = () => {
        if (!el.id) return;
        state[el.id] = el.value;
        save();
        if(el.tagName!=='SELECT') { markEmpty(el); }
        if(el.dataset.touched === "1") validateCurrentStep(false);
      };
      el.addEventListener('input', handler);
      el.addEventListener('blur', () => { el.dataset.touched = "1"; });
    });
    bindEmailSuggest();
    if ($("#agree")) { $("#agree").addEventListener("change", (e) => { validateCurrentStep(true); }); }
    
    // [PATCH APPLIED] ニュースレター購読状態の保存・復元ハンドラ
    const sub = document.getElementById('subscribe');
    if (sub) {
      sub.checked = !!state.subscribe; // 復元
      sub.addEventListener('change', () => {
        state.subscribe = !!sub.checked; save(); // 保存
      });
    }

    $$('.choices').forEach(c => {
      c.addEventListener('change', (e) => {
        const id=c.id; $("#err_"+id)?.classList.remove('show');
        if (e.target.type==='radio') {$$('#'+id+' .chip').forEach(l=>l.classList.remove('is-on')); e.target.closest('.chip')?.classList.add('is-on'); state[id]=e.target.value;}
        else {const vals=$$('#'+id+' input:checked').map(cb=>cb.value); $$('#'+id+' .chip').forEach(l=>{l.classList.toggle('is-on', vals.includes(l.querySelector('input').value));}); state[id]=vals;}
        toggleOtherBox(id); const otherEl = $("#"+id+"_other"); if(otherEl){ otherEl.addEventListener('input', ()=>{ state[id+"_other"] = otherEl.value; save(); if(otherEl.dataset.touched==='1') validateCurrentStep(false); }); }
        save();
      });
    });
    S.steps.forEach(s => {
      if(s.type==='birth') initBirth(s.id);
      if(s.type==='address') initAddress(s.id);
      if(s.type==='file_upload') bindFileUploadLogic(s.id);
      if(s.type==='textarea' && s.fileUpload) bindFileUploadLogic(s.fileUpload.id);
    });
    document.addEventListener('click',(e)=>{ const b = e.target.closest('[data-edit-step]'); if(!b) return; const stepId=b.getAttribute('data-edit-step'); returnFocusId = b.getAttribute('data-focus')||null; const idx=stepsConf.findIndex(s=>s.id===stepId); if(idx!==-1){ returnToConfirm=true; showStep(idx); if(returnFocusId) setTimeout(()=>{ document.getElementById(returnFocusId)?.focus(); },0); } });
  }
  function initBirth(id){
    const y=$("#"+id+"_y"), m=$("#"+id+"_m"), d=$("#"+id+"_d");
    const now=new Date().getFullYear();
    y.innerHTML = '<option value="" disabled selected>年</option>' + Array.from({length: 100},(_,i)=>now-i).map(v=>\`<option value="\${v}">\${v}</option>\`).join('');
    m.innerHTML = '<option value="" disabled selected>月</option>' + Array.from({length:12},(_,i)=>i+1).map(v=>\`<option value="\${v}">\${v}</option>\`).join('');
    d.innerHTML = '<option value="" disabled selected>日</option>' + Array.from({length:31},(_,i)=>i+1).map(v=>\`<option value="\${v}">\${v}</option>\`).join('');
    [y,m,d].forEach(el=>{ el.id = \`\${id}_\${el.id.slice(-1)}\`; updateSelectEmpty(el); el.addEventListener('change',()=>{ state[el.id]=el.value; updateSelectEmpty(el); const yy=y.value, mm=m.value, dd=d.value; state[id] = (yy&&mm&&dd)?\`\${yy}-\${('0'+mm).slice(-2)}-\${('0'+dd).slice(-2)}\`:''; save(); }); });
  }
  function initAddress(id){
    const zipEl = $("#"+id+"_zip"); if(!zipEl) return; let composing = false;
    const handleZip = () => {
      let v = digits(toHalf(zipEl.value)).slice(0, 7);
      if (zipEl.value !== v) zipEl.value = v; state[zipEl.id] = v; save();
      if (v.length === 7) {
        fetch(\`https://zipcloud.ibsnet.co.jp/api/search?zipcode=\${v}\`).then(r=>r.json()).then(d=>{
          if(d.results){ const res=d.results[0]; $("#"+id+"_pref").value=res.address1; $("#"+id+"_city").value=res.address2+res.address3; $("#"+id+"_pref").dispatchEvent(new Event('input')); $("#"+id+"_city").dispatchEvent(new Event('input')); }
        });
      }
    };
    zipEl.addEventListener('compositionstart', () => composing = true);
    zipEl.addEventListener('compositionend', () => { composing = false; handleZip(); });
    zipEl.addEventListener('input', () => { if (!composing) handleZip(); });
  }
  function toggleOtherBox(id){ const wrap = $("#"+id+"_other_wrap"); if(!wrap) return; let on=false; const selectEl = document.getElementById(id); if(selectEl && selectEl.tagName==='SELECT'){ on = (selectEl.value==='その他'); wrap.style.display = on ? '' : 'none'; if(on){ const el=$("#"+id+"_other"); el?.focus(); } return; } const inputs = $$('#'+id+' input'); if(!inputs.length) return; if(inputs[0].type==='radio'){ const checked = inputs.find(inp=>inp.checked); on = !!checked && checked.value==='その他'; } else { on = inputs.some(inp=>inp.checked && inp.value==='その他'); } wrap.style.display = on ? '' : 'none'; if(on){ const el=$("#"+id+"_other"); el?.focus(); }
  }
  function bindEmailSuggest(){
    const domains = {g:["gmail.com"],y:["yahoo.co.jp"],d:["docomo.ne.jp"],i:["icloud.com"],s:["softbank.ne.jp"]};
    $$('input[type="email"]').forEach(el=>{
      const sug = document.getElementById('suggests_'+el.id);
      if(!sug) return;
      el.addEventListener('input', ()=>{
        sug.innerHTML=''; const v=el.value.trim(); if(!v) return;
        const at=v.indexOf('@'), user=at===-1?v:v.slice(0,at), domain=at===-1?'':v.slice(at+1);
        if(!user) return;
        Object.values(domains).flat().filter(d=>d.startsWith(domain)).slice(0,3).forEach(d=>{
          const b=document.createElement('button'); b.type='button'; b.className='suggest'; b.textContent=\`\${user}@\${d}\`;
          b.addEventListener('pointerdown', (e)=>{ e.preventDefault(); el.value=\`\${user}@\${d}\`; state[el.id]=el.value; save(); sug.innerHTML=''; validateCurrentStep(false); });
          sug.appendChild(b);
        });
      });
      el.addEventListener('blur',()=>setTimeout(()=>sug.innerHTML='',200));
    });
  }
  function bindTelFormat() {
    return (el) => {
      const before = el.value;
      const caret = (typeof el.selectionStart === 'number') ? el.selectionStart : null; // Safari対策
      const after  = digits(toHalf(before));
      if (before !== after) {
        el.value = after;
        try {
          if (caret !== null) {
            const delta = after.length - before.length;
            const pos = Math.max(0, caret + delta);
            el.setSelectionRange(pos, pos);
          }
        } catch(_) {}
      }
      state[el.id] = after;
      markEmpty(el);
      save();
      if(el.dataset.touched === "1") validateCurrentStep(false);
    };
  }

  // ▼ 画像専用アップロードの制御
  function bindFileUploadLogic(id) {
    const g = document.getElementById(\`previewGrid_\${id}\`);
    const i = document.getElementById(id);
    if (!g || !i) return;

    const metaDirect = stepsConf.find(s => s.type === 'file_upload' && s.id === id);
    const metaInText = stepsConf.find(s => s.type === 'textarea' && s.fileUpload && s.fileUpload.id === id);
    const meta = metaDirect || (metaInText ? metaInText.fileUpload : null) || {};

    const maxFiles = (typeof meta.maxFiles === 'number' ? meta.maxFiles : 5);
    const maxTotalMB = (typeof meta.maxTotalMB === 'number' ? meta.maxTotalMB : 5);
    const accept = meta.accept || 'image/*';
    const onlyImage = /image\\//.test(accept);

    const MAX_BYTES = maxTotalMB * 1024 * 1024;

    state[id] = state[id] || [];

    const redraw = () => {
      g.innerHTML = "";
      state[id].forEach((f, idx) => {
        const imgHTML = f.data ? \`<img src="\${f.data}" alt="">\` : \`<div style="height:92px;display:grid;place-items:center;font-size:11px;color:#6b7280;">画像なし</div>\`;
        g.insertAdjacentHTML(
          "beforeend",
          \`<div class="thumb">
              \${imgHTML}
              <button class="del" data-i="\${idx}">×</button>
              <span class="tn">\${(f.name || "").slice(0, 12)}</span>
            </div>\`
        );
      });
      save();
    };

    i.addEventListener("change", (e) => {
      const files = [...e.target.files];

      if (state[id].length + files.length > maxFiles) {
        // [PATCH APPLIED] alertをtoastに置換
        showToast(\`最大\${maxFiles}枚までです\`, 'error');
        e.target.value = "";
        return;
      }

      for (const f of files) {
        if (onlyImage && !(f.type || "").startsWith("image/")) {
          // [PATCH APPLIED] alertをtoastに置換
          showToast("画像は JPEG/PNG/GIF/WebP のみです", 'error');
          continue;
        }
        const total = state[id].reduce((s, ff) => s + ff.size, 0);
        if (total + f.size > MAX_BYTES) {
          // [PATCH APPLIED] alertをtoastに置換
          showToast(\`合計\${maxTotalMB}MBを超えています\`, 'error');
          break;
        }
        const reader = new FileReader();
        reader.onload = () => {
          state[id].push({ name: f.name, size: f.size, type: f.type, data: reader.result });
          redraw();
        };
        reader.readAsDataURL(f);
      }
      e.target.value = "";
    });

    g.addEventListener("click", (e) => {
      const b = e.target.closest(".del");
      if (b) {
        state[id].splice(+b.dataset.i, 1);
        redraw();
      }
    });

    redraw();
  }

  function validateCurrentStep(show) {
    const s=stepsConf[currentStepIdx];
    let ok=true;
    const e=(id,c,msg)=>{
      let el=document.getElementById(id),er=document.getElementById("err_"+id);
      if(!er)return;
      const b=!c;
      if(show)el&& (el.dataset.touched="1");
      if(er){er.textContent=msg;er.classList.toggle('show',b && (show || (el&&el.dataset.touched === "1"))); }
      ok&&=!b;
    };
    if(s.type==='confirm'){
      const p=s.privacyPolicy;
      if(p.required){
        const iA=document.getElementById('agree').checked;
        document.getElementById('err_agree').style.visibility = iA ? 'hidden' : 'visible';
        document.getElementById('submitBtn').disabled=!iA;
        ok&&=iA;
      }
    } else {
      switch(s.type){
        case 'group': {
          Object.entries(s.fields).forEach(([id, conf])=>{
            if(conf.required){
              const v=(state[id]||'').trim();
              let pass = !!v;
              if(conf.inputType==='email'){ pass = pass && emailOk(v); }
              if(conf.inputType==='tel'){ pass = pass && /^\\d{10,11}$/.test(digits(toHalf(v))); }
              e(id, pass, \`\${conf.label}を正しく入力してください\`);
            }
          });
          break;
        }
        case 'textarea': {
          if(s.required){
            let v=(state[s.id]||'').trim();
            let pass=!!v;
            e(s.id, pass, s.error || '入力してください');
          }
          if (s.fileUpload && s.fileUpload.required) {
            const hasFiles = state[s.fileUpload.id] && state[s.fileUpload.id].length > 0;
            e(s.fileUpload.id, hasFiles, '画像を選択してください');
          }
          break;
        }
        case 'text': {
          if(s.required){
            let v=(state[s.id]||'').trim();
            let pass=!!v;
            if(pass&&s.inputType==='email') pass=emailOk(v);
            if(pass&&s.inputType==='tel') pass=/^\\d{10,11}$/.test(digits(toHalf(v)));
            e(s.id,pass,s.error || '正しく入力してください');
          }
          break;
        }
        case 'radio': case 'checkbox': {
          if(!s.required) break;
          const hasSel = (Array.isArray(state[s.id])?state[s.id].length>0:!!state[s.id]);
          e(s.id,hasSel,s.error || (s.type==='checkbox'?'必ず1つ以上お選びください':'どれか1つお選びください'));
          if(hasSel && (state[s.id]==='その他' || (Array.isArray(state[s.id])&&state[s.id].includes('その他')))){
            const v=(state[s.id+"_other"]||'').trim().length>0;
            e(s.id+"_other", v, 'その他の内容を入力してください');
          }
          break;
        }
        case 'select': {
          if(!s.required)break;
          const val = state[s.id]||'';
          e(s.id, !!val, s.error || '選択してください');
          if(val==='その他'){
            const v=(state[s.id+"_other"]||'').trim().length>0;
            e(s.id+"_other", v, 'その他の内容を入力してください');
          }
          break;
        }
        case 'birth': {
          if(!s.required) break;
          e(\`\${s.id}_y\`, !!state[\`\${s.id}_y\`], '年を選択してください');
          e(\`\${s.id}_m\`, !!state[\`\${s.id}_m\`], '月を選択してください');
          e(\`\${s.id}_d\`, !!state[\`\${s.id}_d\`], '日を選択してください');
          if(s.gender && s.gender.required){
            const gSel = ($$("#gender input:checked").length>0);
            e('gender', gSel, 'どれか1つお選びください');
          }
          break;
        }
        case 'address': {
          if(!s.required)break;
          e(\`\${s.id}_zip\`, !!(state[\`\${s.id}_zip\`]||'').trim(), '郵便番号を入力してください');
          e(\`\${s.id}_pref\`, !!(state[\`\${s.id}_pref\`]||'').trim(), '都道府県を入力してください');
          e(\`\${s.id}_city\`, !!(state[\`\${s.id}_city\`]||'').trim(), '市区町村を入力してください');
          e(\`\${s.id}_line\`, !!(state[\`\${s.id}_line\`]||'').trim(), '番地・建物名を入力してください');
          break;
        }
        case 'file_upload': {
          if(!s.required)break;
          e(s.id, state[s.id]&&state[s.id].length>0, "画像を選択してください");
          break;
        }
      }
    }
    return ok;
  }

  function buildConfirm() { 
    const items=[]; 
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\\'':'&#39;' }[m]));
    const pick = (id)=> state[id]??'';
    const pickOther = (id)=> { const v=pick(id); const vo=(state[id+"_other"]||'').trim(); if(Array.isArray(v)){ const arr=[...v]; if(v.includes('その他') && vo) arr.splice(arr.indexOf('その他'),1,\`その他: \${vo}\`); return arr.join(', '); } else { if(v==='その他' && vo) return \`その他: \${vo}\`; return v; } };
    for(const s of questionSteps){
      let val=''; let focus=s.id;
      switch(s.type){
        case 'group': val = Object.keys(s.fields).map(fid => state[fid]).filter(Boolean).join(' / '); break;
        case 'textarea': val = pickOther(s.id); if (s.fileUpload && Array.isArray(state[s.fileUpload.id])) { const names = state[s.fileUpload.id].map(f=>f.name).join(', '); if (names) val += (val ? ' / ' : '') + names; } break;
        case 'text': case 'select': case 'radio': case 'checkbox': val = pickOther(s.id); break;
        case 'birth': val = state[s.id] ? \`\${state[s.id+'_y']}年 \${state[s.id+'_m']}月 \${state[s.id+'_d']}日\` : ''; if(state['gender']) val += \` / \${state['gender']}\`; focus=\`\${s.id}_y\`; break;
        case 'address': val = [pick(\`\${s.id}_zip\`), pick(\`\${s.id}_pref\`), pick(\`\${s.id}_city\`), pick(\`\${s.id}_line\`)].filter(Boolean).join('\\n'); focus=\`\${s.id}_zip\`; break;
        case 'file_upload': val = (state[s.id]||[]).map(f=>f.name).join(', '); break;
        default: val = pick(s.id);
      }
      if(String(val||'').trim()) items.push({l:s.question||s.id, v:val, step:s.id, focus});
    }
    const box=$("#confirmBox");
    box.innerHTML = \`<div class="confirm-panel">\${items.map(it=>\`<div class="confirm-item"><div class="confirm-label">\${esc(it.l)}</div><div class="confirm-value-wrapper"><div class="confirm-value">\${esc(it.v)}</div><button type="button" class="btn ghost" data-edit-step="\${it.step}" \${it.focus?\`data-focus="\${it.focus}"\`:' '}>修正</button></div></div>\`).join('')}</div>\`;
  }

  function submitNow() {
    const btn = $('#submitBtn');
    btn.disabled = true;
    showSendingOverlay(true, '送信中です...');

    const finalize = async () => {
      const { schema, kv } = buildSchemaAndKV();
      const { files, missing } = collectFilesForUpload();

      if (missing.length > 0) {
        showSendingOverlay(false);
        btn.disabled = false;
        const firstMissingId = missing[0].id;
        const idx = S.steps.findIndex(s => (s.type === 'file_upload' && s.id === firstMissingId) || (s.type === 'textarea' && s.fileUpload && s.fileUpload.id === firstMissingId));
        if (idx >= 0) showStep(idx);
        showToast('添付ファイルは再開後に再選択が必要です。該当項目でファイルを選び直してください。', 'error');
        return;
      }

      const payload = {
        formTitle: S.formTitle,
        schema, kv, files,
        ts: new Date().toISOString(),
        recaptchaToken: state.recaptchaToken || '',
        ua: navigator.userAgent || ''
      };

      try {
        await postToGAS(payload);
      } catch (err) {
        console.error("GAS Post failed, but redirecting anyway:", err);
      }
      
      localStorage.removeItem(S.storageKey);
      
      if (S.conversionUrl) {
        location.replace(S.conversionUrl);
      } else {
        showSendingOverlay(false);
        showToast('送信が完了しました', 'success');
        btn.disabled = false;
      }
    };

    if (window.grecaptcha && S.recaptchaSiteKey && S.recaptchaSiteKey !== 'YOUR_RECAPTCHA_SITE_KEY') {
      try {
        grecaptcha.ready(() => {
          grecaptcha.execute(S.recaptchaSiteKey, { action: 'submit' })
            .then(token => {
              state.recaptchaToken = token;
              save();
              finalize();
            })
            .catch(() => finalize());
        });
      } catch (_) {
        finalize();
      }
    } else {
      finalize();
    }
  }

  // ▼ 全項目リセット（破棄処理用）
  function resetAllFields(){
    $$("input, textarea, select").forEach(el=>{
      if (el.type==='radio' || el.type==='checkbox') {
        el.checked = false;
        el.closest('.chip')?.classList.remove('is-on');
      } else if (el.type==='file') {
        el.value = '';
        const grid = document.getElementById('previewGrid_'+el.id);
        if (grid) grid.innerHTML = '';
      } else {
        el.value = '';
      }
      if (el.tagName==='SELECT') updateSelectEmpty(el); else markEmpty(el);
    });
    $$(".chip.is-on").forEach(ch => ch.classList.remove("is-on"));
    $$('[id^="previewGrid_"]').forEach(g => g.innerHTML = '');
  }

  const lv1=$("#leaveStage1"), lv2=$("#leaveStage2");
  const oL1=()=>{
    if(lv1.classList.contains('show')||lv2.classList.contains('show')||formClosedByUser)return;
    const isConfirm = steps[currentStepIdx]?.dataset.stepId === 'confirm';
    if(isConfirm){
      $("#leaveStage1 .hd strong").textContent="入力は終わっています。本当に離脱しますか？";
      $("#leaveStage1 .lead").style.display="none";
      $("#lvBack").textContent="戻って送信する";
      $("#lvExit").textContent="離脱する";
    }else{
      $("#leaveStage1 .hd strong").textContent="入力を中断しますか？";
      $("#leaveStage1 .lead").style.display="";
      const remainQs = Math.max(1, questionStepsCount - currentStepIdx);
      $("#lvRemain").textContent=remainQs;
      $("#lvBack").textContent="戻って続ける";
      $("#lvExit").textContent="入力を中断する";
    }
    lv1.classList.add("show");
  };
  const cA=()=>{lv1.classList.remove("show");lv2.classList.remove("show");};
  $("#lvBack").addEventListener("click",cA);
  $("#lvExit").addEventListener("click",()=>{lv1.classList.remove("show");leaveStage2Mode='save'; setupStage2ForSave(); lv2.classList.add("show");});
  $("#lvSaveClose").addEventListener("click",()=>{
    if(leaveStage2Mode==='resume'){
      sessionStorage.setItem(S.storageKey+':resumed','1');
      cA(); hydrateFromState();
      const idx = (typeof state.lastStepIndex==='number')?Math.min(state.lastStepIndex, steps.length-1):0;
      showStep(idx);
      return;
    }
    save();
    cA();
    showToast("保存しました", "success");
    formClosedByUser=true;
  });
  $("#lvDiscardClose").addEventListener("click",()=>{
    if(leaveStage2Mode==='resume'){
      localStorage.removeItem(S.storageKey);
      cA(); location.reload();
      return;
    }
    // 永続保存を削除
    localStorage.removeItem(S.storageKey);
    // メモリ状態を空に
    for (const k of Object.keys(state)) delete state[k];
    // 画面上の全フィールドを初期化
    resetAllFields();
    // 破棄直後のみ 60 秒抑止
    sessionStorage.setItem(suppressUntilKey, String(Date.now() + RE_PROMPT_WINDOW_MS));
    cA();
    showToast("入力内容を破棄しました", "error");
    // ステップ1へ（リロードなし）
    showStep(0);
  });

  if(!navigator.userAgentData.mobile){
    const tE=$("#formCard .title");
    document.body.addEventListener("mouseleave",(e)=>{
      const r=tE?.getBoundingClientRect?.()||{top:0};
      if (e.clientY < Math.max(8, r.top) && eligibleToPromptExit()) { oL1(); }
    },{passive:true});
  }
  if(!sessionStorage.getItem('pushed:'+S.storageKey)){
    history.pushState(null,'');
    sessionStorage.setItem('pushed:'+S.storageKey,'1');
  }
  window.addEventListener('popstate',(e)=>{
    history.pushState(null,'');
    if (eligibleToPromptExit()) { oL1(); }
  });

  initializeForm();

  function showResumePrompt(){
    leaveStage2Mode='resume';
    $("#leaveStage2 .hd strong").textContent='前回の保存から再開しますか？';
    const dt = state.savedAt? new Date(state.savedAt): null;
    const t = dt? \`\${dt.getFullYear()}/\${('0'+(dt.getMonth()+1)).slice(-2)}/\${('0'+dt.getDate()).slice(-2)} \${('0'+dt.getHours()).slice(-2)}:\${('0'+dt.getMinutes()).slice(-2)}\` : '';
    $("#leaveStage2 .bd .muted").textContent = t? \`前回の保存：\${t}\` : '前回の保存データが見つかりました。';
    $("#lvSaveClose").textContent='再開する';
    $("#lvDiscardClose").textContent='最初からやり直す';
    lv2.classList.add('show');
  }
  function setupStage2ForSave(){
    $("#leaveStage2 .hd strong").textContent='入力を保存しますか？';
    $("#leaveStage2 .bd .muted").textContent='下書き保存しておくと、次回は続きから再開できます。';
    $("#lvSaveClose").textContent='保存して閉じる';
    $("#lvDiscardClose").textContent='破棄して閉じる';
  }
});
</script>
</body>
</html>
`;

export const FORM_ITEMS: FormItem[] = [
  { id: 1, name: "お名前" },
  { id: 2, name: "フリガナ" },
  { id: 3, name: "業種" },
  { id: 4, name: "会社名/屋号" },
  { id: 5, name: "部署名" },
  { id: 6, name: "役職" },
  { id: 7, name: "住所" },
  { id: 8, name: "生年月日" },
  { id: 9, name: "性別" },
  { id: 10, name: "メールアドレス" },
  { id: 11, name: "電話番号" },
  { id: 12, name: "WebサイトURL" },
  { id: 13, name: "お問い合わせ内容（自由記入欄）" },
  { id: 14, name: "画像添付（最大5枚・合計5MB）" },
  { id: 15, name: "カスタム項目（text項目のみ追加できます）" },
  { id: 16, name: "ラジオボタン（複数選択不可）" },
  { id: 17, name: "チェックボックス（複数選択可）" },
  { id: 18, name: "プルダウン（1つ選択）" },
];

export const AB_TEST_ITEMS = [
    "フォームタイトル",
    "フォームサブタイトル",
    "送信ボタンの文言",
    "質問の順番"
];
export const GAS_CODE_TEMPLATE = `
/** =====================================================================
* フォーム受付 完全版（Webアプリ）- カスタムメール & ガイド作成機能付き
* - 初心者向け改善パッチ Ver.4.1 (最終修正版)
* - 追加修正: 添付リンク（スプシのみ）/ メールはサムネのみ / 重複添付防止 / 先頭0維持 / 共有＝固定anyone
* ===================================================================== */

/* ========================= デフォルト・テンプレ ========================= */
const DEFAULT_AUTO_REPLY_SUBJECT = 'お問い合わせを受け付けました（受付ID: {{ID}}）';
const DEFAULT_AUTO_REPLY_BODY = [
  '{{NAME}} 様','',
  'このたびは「{{FORM}}」よりお問い合わせありがとうございます。',
  '以下の内容で受け付けいたしました。担当〇〇より、◯営業日以内に折り返しご連絡いたします。','',
  '受付ID  : {{ID}}',
  '受付日時 : {{DATETIME}}',
  'フォーム : {{FORM}}','',
  '―― ご入力内容 ――',
  '{{INPUTS_TEXT}}','',
  '―― お急ぎのお客様へ ――',
  '・お急ぎの場合は{{LEGAL_TEL}}までお電話ください。','',
  '―― 発信者情報――',
  '会社名  : {{LEGAL_COMPANY}}',
  '所在地  : {{LEGAL_ADDRESS}}',
  '電話    : {{LEGAL_TEL}}',
  '代表者  : {{LEGAL_REP}}',
  'お問い合わせ窓口: {{LEGAL_CONTACT}}',
  'メール  : {{LEGAL_EMAIL}}',
  '営業時間 : {{LEGAL_HOURS}}',
  'Web     : {{LEGAL_WEB}}',
  '個人情報保護方針: {{LEGAL_PRIVACY_URL}}','',
  '※本メールは送信専用です。ご返信の際は {{LEGAL_EMAIL}} 宛にお願いいたします。',
  '――――――――――――――――――――',
  '担当：カスタマーサクセスチーム 〇〇',
  '{{LEGAL_COMPANY}}'
].join('\\n');

const DEFAULT_NOTIFY_SUBJECT = '【新規問い合わせ】{{ID}} / {{NAME}} / {{FORM}}';
const DEFAULT_NOTIFY_BODY = [
  '▼メタ情報',
  '受付ID  : {{ID}}',
  '受付日時 : {{DATETIME}}',
  'フォーム : {{FORM}}',
  '受信経路 : Webフォーム',
  'Reply-To : {{EMAIL}}',
  'UA      : {{USER_AGENT}}','',
  '▼入力内容',
  '{{INPUTS_TEXT}}','',
  '▼対応メモ',
  '・1～2営業日以内に一次返信。',
  '・見積りのため要ヒアリング：現行ページ数、CMS有無、素材有無、納期。'
].join('\\n');

/* ============================== 基本ユーティリティ ============================== */
const TOKEN_ALIASES={
  '受付ID':'ID','ID':'ID',
  '受付日時':'DATETIME','日時':'DATETIME',
  'フォームタイトル':'FORM','FORM':'FORM',
  '入力内容':'INPUTS_TEXT','INPUTS_TEXT':'INPUTS_TEXT',
  '会社名':'LEGAL_COMPANY','住所':'LEGAL_ADDRESS',
  '電話番号':'LEGAL_TEL','代表者':'LEGAL_REP','問い合わせ先':'LEGAL_CONTACT',
  '名前':'NAME','氏名':'NAME',
  'メール':'EMAIL','メールアドレス':'EMAIL'
};

function getProp_(key, def=''){ return PropertiesService.getScriptProperties().getProperty(key) || def; }
function setProp_(key, val){ PropertiesService.getScriptProperties().setProperty(key, val); }
function getTpl_(key, fallback){ return getProp_(key, fallback); }

function renderTpl_(tpl, ctx){
  return String(tpl || '').replace(/(\\{\\{|\\[\\[)\\s*(.+?)\\s*(\\)\\}|\\]\\])/g, function(_, __, raw){
    const k = (TOKEN_ALIASES[raw] || raw).trim();
    return (ctx[k] ?? '');
  });
}

function makeInputsText_(schema, kv, attachments){
  let text = (schema || []).map(function(h){
    const key = String(h).padEnd(10,' ');
    return key + ': ' + (kv[h] ?? '');
  }).join('\\n');
  if (Array.isArray(attachments) && attachments.length > 0) {
    const fileText = attachments.map(function(f){ return f.name + '（' + formatBytes_(f.size) + '）'; }).join(', ');
    text += '\\n' + '添付ファイル'.padEnd(10,' ') + ': ' + fileText;
  }
  return text;
}

function formatBytes_(bytes, decimals=1){
  if (!+bytes) return '0 Bytes';
  const k=1024, dm=decimals<0?0:decimals, sizes=['Bytes','KB','MB','GB','TB'];
  const i=Math.floor(Math.log(bytes)/Math.log(k));
  return String(parseFloat((bytes/Math.pow(k,i)).toFixed(dm))) + ' ' + sizes[i];
}
function tz_(){ return Session.getScriptTimeZone() || 'Asia/Tokyo'; }

function nextAcceptId_(){
  const p=PropertiesService.getScriptProperties();
  const today=Utilities.formatDate(new Date(), tz_(), 'yyMMdd');
  const key='SEQ_' + today;
  const cur=Number(p.getProperty(key) || '0') + 1;
  p.setProperty(key, String(cur));
  const prefix=getProp_('ID_PREFIX','');
  return prefix + today + '-' + ('0000'+cur).slice(-4);
}

function getSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetName = 'フォーム回答';
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  // A1 に常に一文だけ（データは2行目から）
  const cellA1 = sheet.getRange('A1').getValue();
  const banner = 'ここにフォームからの回答が記録されていきます。';
  if (cellA1 !== banner) {
    sheet.getRange('A1').setValue(banner);
  }
  return sheet;
}

/* =========== 電話列テキスト書式（0落ち防止サポート。ヘッダ無しでもOK） =========== */
function ensurePhoneColumnAsText_(_sheet){
  // ヘッダ無し運用のため、列幅固定はせず、値側で '\\'' を付与して完全防止する方針
  // 互換のため残置（何もしない）
}

/* ============================== 列定義（ヘッダは書かない） ============================== */
function expectedHeaders_(schema){
  // ★ヘッダー固定方針：既存の2行目ヘッダーを基準にし、新項目は末尾（添付の直前）にだけ追加
  const base=['通番','受付ID','受付日時','フォーム'];
  const extra='添付ファイルURL';

  // 既存ヘッダー取得（なければ空配列）
  let existing=[];
  try{
    const ss=SpreadsheetApp.getActiveSpreadsheet();
    const sh=ss && ss.getSheetByName('フォーム回答');
    if (sh){
      const lc=sh.getLastColumn();
      if (lc>=1){
        existing=(sh.getRange(2,1,1,lc).getValues()[0]||[]).map(function(v){ return String(v||''); });
        // 末尾の空セルは削ぎ落す
        while(existing.length && !existing[existing.length-1]) existing.pop();
      }
    }
  }catch(_) {}

  // 既存が無い場合は初期ヘッダー＝ base + schema + extra
  if (!existing.length){
    const uniqSchema=(schema||[]).filter(function(h,i,a){ return a.indexOf(h)===i; });
    return base.concat(uniqSchema||[]).concat([extra]);
  }

  // 既存をベースに固定しつつ、baseが無ければ所定位置に補完
  let headers=existing.slice(0);

  // base の順序を保証（無ければ先頭側へ挿入、既存順は極力維持）
  base.forEach(function(b, idx){
    if (headers.indexOf(b)===-1){
      headers.splice(Math.min(idx, headers.length), 0, b);
    }
  });

  // 重複除去（先勝ち）
  headers = headers.filter(function(h, i, a){ return h && a.indexOf(h)===i; });

  // 添付列の位置を記録（無ければあとで末尾に追加）
  let extraIdx = headers.indexOf(extra);
  if (extraIdx === -1){
    headers.push(extra);
    extraIdx = headers.length - 1;
  }

  // schema の新規項目は「添付ファイルURL」の直前にだけ追加
  (schema||[]).forEach(function(h){
    if (!h) return;
    if (headers.indexOf(h)===-1 && base.indexOf(h)===-1 && h!==extra){
      headers.splice(extraIdx, 0, h);
      extraIdx++; // 追加した分だけ添付の位置を後ろにスライド
    }
  });

  return headers;
}

/* === 1行分の値を配列化（ヘッダ無しのため値だけ書く）。電話は'を付与 === */
function buildRow_(headers, formTitle, acceptId, when, schema, kv, attachments, rowNumber){
  const map = Object.assign({}, kv);
  map['通番']   = rowNumber;
  map['受付ID'] = acceptId;
  map['受付日時'] = Utilities.formatDate(when, tz_(), 'yyyy/MM/dd HH:mm');
  map['フォーム'] = formTitle;

  // スプシにはプレーンURL文字列を改行で（後でRichTextリンク付与）
  map['添付ファイルURL'] = (attachments||[]).map(function(f){ return f.url; }).join('\\n');

  // 電話系は必ず文字列化し、先頭に '\\'' を付けて完全固定
  headers.forEach(function(h){
    if (/電話/.test(h)) {
      if (kv[h] != null && kv[h] !== '') {
        map[h] = "'" + String(kv[h]);
      }
    }
  });

  return headers.map(function(h){ return (map.hasOwnProperty(h) ? map[h] : ''); });
}

/* === 書き込んだ行の「添付ファイルURL」セルにハイパーリンクを付ける === */
function setAttachmentLinksCell_(sheet, headers, rowIndex, files){
  if (!Array.isArray(files) || files.length === 0) return;
  const col = headers.indexOf('添付ファイルURL') + 1;
  if (col < 1) return;

  // 表示文字列はURLそのものを改行区切りで
  const parts = files.map(function(f){ return f.url; });
  const text  = parts.join('\\n');

  const builder = SpreadsheetApp.newRichTextValue().setText(text);
  let pos = 0;
  for (var i=0; i<parts.length; i++){
    const url = parts[i] || '';
    const len = url.length;
    if (len > 0) {
      builder.setLinkUrl(pos, pos + len, url);
    }
    pos += len;
    if (i < parts.length - 1) pos += 1; // 改行分
  }
  const cell = sheet.getRange(rowIndex, col);
  cell.setRichTextValue(builder.build());
}

/* === A1 タイトル装飾＆2行目の項目名行を表示・装飾（★今回の追加） === */
function ensureBannerAndHeaders_(sheet, headers){
  if (!headers || !headers.length) return;
  const cols = headers.length;

  // A1: タイトル化（結合＋背景色＋太字＋中央）
  const titleRange = sheet.getRange(1, 1, 1, cols);
  if (titleRange.isPartOfMerge()) titleRange.breakApart();
  titleRange.merge();
  titleRange.setValue('ここにフォームからの回答が記録されていきます。')
            .setBackground('#e8f1ff')
            .setFontWeight('bold')
            .setFontSize(12)
            .setHorizontalAlignment('center')
            .setVerticalAlignment('middle');

  // 2行目: 項目名を表示（装飾）
  const hRange = sheet.getRange(2, 1, 1, cols);
  const current = hRange.getValues()[0] || [];
  // すでに同じなら上書きしないが、欠けがあれば補完
  let needWrite = false;
  for (var i=0;i<cols;i++){ if (current[i] !== headers[i]) { needWrite = true; break; } }
  if (needWrite){
    hRange.setValues([headers]);
  }
  hRange.setFontWeight('bold')
        .setBackground('#f2f2f2')
        .setHorizontalAlignment('center');

  // 体裁（任意）：行の高さ少し広め
  sheet.setRowHeight(1, 28);
  sheet.setRowHeight(2, 24);
}

/* ============================== Drive 保存（共有＝anyone固定・サムネ対応） ============================== */
function saveUploads_(files, acceptId){
  // ★添付が無い場合は何も作らない（親/子フォルダも未作成）
  if(!Array.isArray(files) || !files.length) return [];

  let folderId=getProp_('UPLOAD_FOLDER_ID',''); let folder;
  if (folderId){ try{ folder=DriveApp.getFolderById(folderId); }catch(e){ folder=null; } }
  if (!folder){ folder=DriveApp.createFolder('Form Uploads'); setProp_('UPLOAD_FOLDER_ID', folder.getId()); }
  const sub=folder.createFolder(acceptId);

  const out=[];
  files.forEach(function(f){
    const dataUrl=f && f.data || '';
    const m=dataUrl.match(/^data:([^;]+);base64,(.+)$/);
    const mime=(f && f.type) || (m && m[1]) || 'application/octet-stream';
    const b64=m ? m[2] : dataUrl;
    const name=(f && f.name) || 'file';
    const size=f.size || 0;
    try{
      const bytes=Utilities.base64Decode(b64);
      const blob=Utilities.newBlob(bytes, mime, name);
      const file=sub.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      const id=file.getId();
      const downloadUrl='https://drive.google.com/uc?export=download&id='+id;
      const thumbUrl=/^image\\//i.test(mime) ? 'https://drive.google.com/thumbnail?id='+id+'&sz=w600' : '';
      out.push({ id, name:file.getName(), mimeType:mime, size, url:downloadUrl, thumbUrl });
    }catch(e){
      console.error('Failed to process file '+ name +': '+ e.toString());
    }
  });
  return out;
}
function escapeHtml_(s){
  return String(s||'').replace(/[&<>"']/g, function(c){
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'}[c]);
  });
}

/* ===== メール内の添付セクション：リンク不要（キャプチャのみ） ===== */
function buildAttachmentSections_(files){
  if(!Array.isArray(files) || !files.length) return { text:'', html:'' };

  // テキスト版：ファイル名＋サイズのみ（URLは載せない）
  var lines = files.map(function(f,i){
    return '・' + (i+1) + '. ' + (f.name || 'file') + '（' + formatBytes_(f.size || 0) + '）';
  });
  var text = '\\n\\n---\\n【添付ファイル】\\n' + lines.join('\\n');

  // HTML版：画像はサムネイル<img>だけ、その他はファイル名のみ。リンクは張らない
  var htmlParts = files.map(function(f){
    var safeName  = escapeHtml_(f.name || '');
    var safeThumb = escapeHtml_(f.thumbUrl || '');
    if (f.thumbUrl) {
      return '' +
        '<div style="margin:6px 0;">' +
          '<img src="' + safeThumb + '" alt="' + safeName + '" style="max-width:160px;height:auto;border:1px solid #e5e7eb;border-radius:8px;display:block;">' +
          '<div style="font-size:12px;margin-top:4px;">' + safeName + '（' + escapeHtml_(formatBytes_(f.size || 0)) + '）</div>' +
        '</div>';
    } else {
      return '' +
        '<div style="margin:6px 0;font-size:12px;">' + safeName + '（' + escapeHtml_(formatBytes_(f.size || 0)) + '）</div>';
    }
  }).join('');
  var html =
    '<hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0;">' +
    '<p style="font-weight:700;margin:0 0 8px;">添付ファイル</p>' +
    '<div>' + htmlParts + '</div>';

  return { text: text, html: html };
}

/* ============================== メール添付（重複除去） ============================== */
function buildAttachments_(files) {
  if (!Array.isArray(files) || !files.length) return [];
  var blobs = [];
  var seen = new Set();
  files.forEach(function(f){
    if (!f || !f.data) return;
    var base64 = f.data;
    var m = base64.match(/^data:([^;]+);base64,(.+)$/);
    var mime = f.type || (m ? m[1] : 'application/octet-stream');
    if (m) base64 = m[2];
    try {
      var bytes = Utilities.base64Decode(base64);
      var blob  = Utilities.newBlob(bytes, mime, f.name || 'file');
      var key   = blob.getName() + '|' + blob.getBytes().length;
      if (!seen.has(key)) { seen.add(key); blobs.push(blob); }
    } catch(e) {
      console.error('Failed to create blob for ' + (f.name || '(no name)'));
    }
  });
  return blobs;
}

/* === リーガル空欄行を丸ごと非表示にする（自動返信用） === */
var LEGAL_LABELS_ = ['会社名','所在地','電話','代表者','お問い合わせ窓口','メール','営業時間','Web','個人情報保護方針'];
function stripEmptyLegalLines_(text){
  // 「ラベル : 」で終わる行を削除（対象ラベル限定）
  var esc = function(s){ return s.replace(/[-/\\^$*+?.()|[\\]{}]/g,'\\$&'); };
  var re = new RegExp('^\\s*(?:' + LEGAL_LABELS_.map(esc).join('|') + ')\\s*:\\s*$', 'u');
  return String(text||'').split('\\n').filter(function(line){ return !re.test(line); }).join('\\n');
}

/* ============================== メール送信 ============================== */
function sendAutoReply_(to, ctx, attachmentsBlobs){
  if (!to) return;
  const subject = renderTpl_(getTpl_('AUTO_REPLY_SUBJECT', DEFAULT_AUTO_REPLY_SUBJECT), ctx);
  // 差し込み → リーガル空欄行の削除
  const rendered = renderTpl_(getTpl_('AUTO_REPLY_BODY', DEFAULT_AUTO_REPLY_BODY), ctx);
  const cleaned  = stripEmptyLegalLines_(rendered);

  const at = buildAttachmentSections_(ctx.attachments || []);
  const finalBody = cleaned + at.text;
  const finalHtmlBody = escapeHtml_(cleaned).replace(/\\n/g,'<br>') + at.html;

  const senderName = getProp_('SENDER_NAME','') || getProp_('LEGAL_COMPANY','') || 'No-Reply';
  const replyTo    = getProp_('REPLY_TO','');

  GmailApp.sendEmail(to, subject, finalBody, {
    name: senderName, replyTo, htmlBody: finalHtmlBody,
    attachments: [] // ★添付は付けない（本文サムネのみ）
  });
}

function sendNotify_(ctx, attachmentsBlobs){
  const to = getProp_('NOTIFY_TO','');
  if (!to) return;
  const subject = renderTpl_(getTpl_('NOTIFY_SUBJECT', DEFAULT_NOTIFY_SUBJECT), ctx);
  const baseTextBody = renderTpl_(getTpl_('NOTIFY_BODY', DEFAULT_NOTIFY_BODY), ctx);
  const at = buildAttachmentSections_(ctx.attachments || []);
  const finalBody = baseTextBody + at.text;
  const finalHtmlBody = escapeHtml_(baseTextBody).replace(/\\n/g,'<br>') + at.html;
  const replyTo = ctx.EMAIL || getProp_('REPLY_TO','');

  GmailApp.sendEmail(to, subject, finalBody, {
    replyTo, htmlBody: finalHtmlBody,
    attachments: [] // ★添付は付けない（本文サムネのみ）
  });
}

/* ============================== API / メニュー等 ============================== */
function json_(obj, code){
  const out = ContentService.createTextOutput(JSON.stringify(obj || {}));
  out.setMimeType(ContentService.MimeType.JSON);
  if (code) out.setContent(JSON.stringify(Object.assign({ code }, obj)));
  return out;
}

function doPost(e){
  try{
    const raw=(e && e.parameter && e.parameter.payload) || '';
    if (!raw) return json_({ ok:false, error:'payload missing' });
    const payload=JSON.parse(raw);

    // メール用添付Blob（重複除去）
    const mailAttachments = buildAttachments_(payload.files || []);

    // reCAPTCHA（任意）
    const secret=getProp_('RECAPTCHA_SECRET','');
    if (secret && payload.recaptchaToken){
      const res=UrlFetchApp.fetch('https://www.google.com/recaptcha/api/siteverify', {
        method:'post', payload:{ secret, response: payload.recaptchaToken }, muteHttpExceptions:true
      });
      const vr=JSON.parse(res.getContentText() || '{}');
      if (!vr.success) return json_({ ok:false, error:'recaptcha failed' });
    }

    const sh=getSheet_();

    // フロントからの情報
    const formTitle=String(payload.formTitle || 'フォーム');
    const schema=Array.isArray(payload.schema) ? payload.schema : [];
    const headers=expectedHeaders_(schema);

    // A1 タイトル＆2行目ヘッダ表示（装飾）
    ensureBannerAndHeaders_(sh, headers);

    // 電話列の表示は値側で'固定（ensurePhoneColumnAsText_はNOP）
    ensurePhoneColumnAsText_(sh);

    // データ行：3行目から。既存データ行数 = getLastRow() - 2
    const dataLastRow = Math.max(0, sh.getLastRow() - 2);
    const nextRowIndex = dataLastRow + 3; // 3行目から書く
    const rowNumber   = dataLastRow + 1;  // 通番=1,2,3...

    const kv=(payload.kv && typeof payload.kv === 'object') ? payload.kv : {};
    const files=Array.isArray(payload.files) ? payload.files : [];
    const userAgent=String(payload.ua || '不明');
    const when=new Date();
    const acceptId=nextAcceptId_();

    // Drive 保存
    const driveAttachments=saveUploads_(files, acceptId);

    // 行データ構築＆書き込み
    const row=buildRow_(headers, formTitle, acceptId, when, schema, kv, driveAttachments, rowNumber);
    sh.getRange(nextRowIndex, 1, 1, row.length).setValues([row]);

    // 添付URLセルをクリック可能に（RichTextリンク）
    setAttachmentLinksCell_(sh, headers, nextRowIndex, driveAttachments);

    // メール用コンテキスト
    const ctx={
      ID: acceptId,
      DATETIME: Utilities.formatDate(when, tz_(), 'yyyy/MM/dd HH:mm'),
      FORM: formTitle,
      INPUTS_TEXT: makeInputsText_(schema, kv, driveAttachments),
      NAME: kv['お名前'] || kv['お名前（フルネーム）'] || kv['氏名'] || '',
      EMAIL: kv['メールアドレス'] || kv['email'] || '',
      USER_AGENT: userAgent,
      attachments: driveAttachments
    };
    ctx.LEGAL_COMPANY    = getProp_('LEGAL_COMPANY','');
    ctx.LEGAL_ADDRESS    = getProp_('LEGAL_ADDRESS','');
    ctx.LEGAL_TEL        = getProp_('LEGAL_TEL','');
    ctx.LEGAL_REP        = getProp_('LEGAL_REP','');
    ctx.LEGAL_CONTACT    = getProp_('LEGAL_CONTACT','');
    ctx.LEGAL_EMAIL      = getProp_('LEGAL_EMAIL','');
    ctx.LEGAL_HOURS      = getProp_('LEGAL_HOURS','');
    ctx.LEGAL_WEB        = getProp_('LEGAL_WEB','');
    ctx.LEGAL_PRIVACY_URL= getProp_('LEGAL_PRIVACY_URL','');

    // 送信
    sendAutoReply_(ctx.EMAIL, ctx, mailAttachments);
    sendNotify_(ctx, mailAttachments);

    return json_({ ok:true, id: acceptId });

  }catch(err){
    console.error('doPost Error: ' + err.toString() + '\\nStack: ' + err.stack);
    return json_({ ok:false, error:String(err) });
  }
}

function doGet(){ return HtmlService.createHtmlOutput('OK'); }

function onOpen(){
  SpreadsheetApp.getUi()
    .createMenu('フォーム設定')
    .addItem('設定を開く','showSettingsSidebar')
    .addSeparator()
    .addItem('使い方ガイドはこちら','createGuideSheet_')
    .addSeparator()
    .addItem('現在の設定をシートに書き出す','dumpPropsToSheet_')
    .addToUi();
}

/* ★テンプレート不要: Sidebar.html をそのまま出力 */
function showSettingsSidebar(){
  const P = PropertiesService.getScriptProperties();
  if(!P.getProperty('AUTO_REPLY_SUBJECT')) P.setProperty('AUTO_REPLY_SUBJECT', DEFAULT_AUTO_REPLY_SUBJECT);
  if(!P.getProperty('AUTO_REPLY_BODY'))    P.setProperty('AUTO_REPLY_BODY',    DEFAULT_AUTO_REPLY_BODY);
  if(!P.getProperty('NOTIFY_SUBJECT'))     P.setProperty('NOTIFY_SUBJECT',     DEFAULT_NOTIFY_SUBJECT);
  if(!P.getProperty('NOTIFY_BODY'))        P.setProperty('NOTIFY_BODY',        DEFAULT_NOTIFY_BODY);

  const html = HtmlService.createHtmlOutputFromFile('Sidebar')
    .setTitle('フォーム設定')
    .setWidth(380);
  SpreadsheetApp.getUi().showSidebar(html);
}

/* ===== 設定のエクスポート等（日本語文面は原型維持） ===== */
function getAllProps_(){
  const P=PropertiesService.getScriptProperties(); const all=P.getProperties();
  const keys=[
    'ID_PREFIX','NOTIFY_TO','REPLY_TO','SENDER_NAME',
    'LEGAL_COMPANY','LEGAL_ADDRESS','LEGAL_TEL','LEGAL_REP','LEGAL_CONTACT',
    'LEGAL_EMAIL','LEGAL_HOURS','LEGAL_WEB','LEGAL_PRIVACY_URL',
    'AUTO_REPLY_SUBJECT','AUTO_REPLY_BODY','NOTIFY_SUBJECT','NOTIFY_BODY',
    'UPLOAD_FOLDER_ID','SHEET_ID','RECAPTCHA_SECRET'
  ];
  const out={}; keys.forEach(function(k){ out[k]=all[k] || ''; });
  return out;
}

function saveProps_(obj){
  const P=PropertiesService.getScriptProperties();
  Object.keys(obj||{}).forEach(function(k){ P.setProperty(k, String(obj[k] ?? '')); });
  return getAllProps_();
}

function dumpPropsToSheet_(){
  const sh=getSheet_(); const props=getAllProps_();
  const rows=Object.keys(props).map(function(k){ return [k, props[k]]; });
  const ws=SpreadsheetApp.getActive().insertSheet('設定_' + Utilities.formatDate(new Date(), tz_(), 'MMdd_HHmm'));
  ws.getRange(1,1,1,2).setValues([['KEY','VALUE']]);
  if (rows.length) ws.getRange(2,1,rows.length,2).setValues(rows);
  return ws.getName();
}

function api_getProps(){ return getAllProps_(); }
function api_saveProps(obj){ return saveProps_(obj); }
function api_seedDefaults(){
  const P=PropertiesService.getScriptProperties();
  P.setProperty('AUTO_REPLY_SUBJECT', DEFAULT_AUTO_REPLY_SUBJECT);
  P.setProperty('AUTO_REPLY_BODY', DEFAULT_AUTO_REPLY_BODY);
  P.setProperty('NOTIFY_SUBJECT', DEFAULT_NOTIFY_SUBJECT);
  P.setProperty('NOTIFY_BODY', DEFAULT_NOTIFY_BODY);
  return P.getProperties();
}

/* ============================== 使い方ガイド（本文そのまま） ============================== */
function createGuideSheet_(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const guideSheetName = '使い方ガイド';
  let sheet = ss.getSheetByName(guideSheetName);

  if (sheet){
    const ui = SpreadsheetApp.getUi();
    const response = ui.alert('「使い方ガイド」はすでに存在します', '最新の内容で上書きしますか？', ui.ButtonSet.YES_NO);
    if (response == ui.Button.YES) {
      sheet.clear();
    } else {
      sheet.activate(); return;
    }
  } else {
    sheet = ss.insertSheet(guideSheetName, 0);
  }

  const guideData = [
    ['▼ 項目', '▼ 説明', '▼ 補足'],

    ['■■■ 1. このツールの目的と基本的な使い方 ■■■', null, null],
    ['このツールの目的', 'お問い合わせへの自動返信メールと社内向け通知メールの作成と、お問い合わせフォームから送信された内容を保存するシートを作成します。', null],
    ['基本的な使い方', '① メニュー「フォーム設定」>「設定を開く」でサイドバーを表示します。\\n② サイドバーでメールの文面などを自由に編集してください。\\n③ 編集が終わったら、サイドバー一番下の緑の「保存する」ボタンを押します。', 'これで自動返信、通知メールが作成され、実際のメールに反映されます。それと、フォームから送信された内容を保存するシートが自動で作成され、送信されるたびに自動で内容が追加されていきます。'],
    [],
    ['■■■ 2. サイドバー各項目の詳しい説明 ■■■', null, null],
    ['【固有ID】', null, null],
    ['受付IDプレフィックス', '任意の名称を指定すると、任意の名称と日付、その日の連番がセットになった固有のIDを発行します（例: \`SHOP-\`と設定すると、受付IDが \`SHOP-240918-0001\` のようになります）。', '空欄の場合は「日付」＋「その日の連番」のみのIDが自動生成されます。お好みで設定してください。'],
    [' └ 受付IDの仕組み', '受付IDは「任意の名称」+「日付」＋「その日の連番」で自動生成されるため、絶対に重複しない固有の番号になります。', 'その日の最初の問い合わせは「...-0001」、2番目は「...-0002」。日付が変わると連番はリセットされます。'],
    ['【通知・返信ヘッダー】', null, null],
    ['通知宛先', 'お客様から問い合わせがあったことの通知を受け取るメールアドレスです。', '【必須】必ず入力してください。複数人で受け取りたい場合は、カンマ(\`,\`)で区切ります。（例: \`a@mail.com,b@mail.com\`）'],
    ['Reply-To（返信先の予約）', '通知を受け取ったメールからお客様へダイレクトに返信する場合、自動的に宛先（To:）にお客様のメアドが入るようにするための設定です。', 'お客様とのやり取りに使うメアド（サポート窓口など）を設定してください。社内向け通知メールと同じメールアドレスでも構いません。空欄でも問題ありませんが、設定すると返信がとても楽になります。'],
    ['差出人名', 'お客様に届く自動返信メールの「差出人」として表示される名前です。', '「〇〇株式会社 サポート窓口」のように、お客様から見て誰からのメールか分かるようにしてください'],
    ['【リーガル表記（メールのフッター用）】', null, null],
    ['会社名・所在地など', '自動返信メールの一番下に表示される、会社名や住所などの情報です。ここに入力した情報が自動で差し込まれます。', '全て埋める必要はありません。空欄の項目名はメールに表示されません。'],
    ['【自動返信テンプレ（お客様向け）】', null, null],
    ['件名・本文', 'お客様に届くメールの件名と本文です。', '最初から入っている例文を自由に書き換えてください。\`{{NAME}}\`のような文字は下の「差し込みタグ」の説明を見てください。'],
    ['【通知テンプレ（社内向け）】', null, null],
    ['件名・本文', 'あなたやスタッフに新しい問い合わせが来たことを通知するメールの件名と本文です。', '社内で分かりやすいよう自由に書き換えてください。'],
    ['【アップロード保存（上級者向け）】', null, null],
    ['保存フォルダID', '入力フォームに画像が添付されていた場合の保存フォルダのIDです。', '空欄のままで問題ありません。Googleドライブに「Form Uploads」というフォルダが自動作成され、さらにお客様ごとにサブフォルダを作成して保存します。'],
    ['【その他（上級者向け）】', null, null],
    ['回答記録スプレッドシートID など', 'より高度な設定です。これらの項目は、特定のフォルダやシートを使いたい場合などに手動でIDを指定するためのものです。', '特定の場合を除き、空欄のままで問題ありません。スクリプトが自動で作成・管理してくれます。'],
    [],
    ['■■■ 3. 差し込みタグについて ■■■', null, null],
    ['差し込みタグとは？', 'メールの本文中にある \`{{NAME}}\` や \`{{ID}}\` のような \`{{ }}\` で囲まれた文字のことです。これらは、メールを送る際、自動でお客様の情報（名前や受付番号など）に置き換わります。', 'これにより、一人ひとりのお客様に合わせたパーソナルなメールを送ることができます。'],
    ['{{NAME}}', 'お客様の名前に置き換わります。', null],
    ['{{ID}}', '自動で発行される受付IDに置き換わります。', null],
    ['{{DATETIME}}', '受付日時に置き換わります。', null],
    ['{{FORM}}', 'フォームのタイトルに置き換わります。', null],
    ['{{INPUTS_TEXT}}', 'お客様が入力した内容すべてに置き換わります。', null],
    ['{{LEGAL_...}}', '「リーガル表記」で設定した項目に置き換わります。', '例: \`{{LEGAL_COMPANY}}\` は会社名に変わります。'],
  ];

  const COLS = 3;
  const normalizedData = guideData.map(function(row){
    const r = Array.isArray(row) ? row : [row];
    const filled = Array.from({length: COLS}, function(_, i){ return (r[i] === null ? '' : String(r[i] || '')); });
    return filled;
  });

  sheet.getRange(1, 1, normalizedData.length, COLS)
       .setValues(normalizedData)
       .setVerticalAlignment('top')
       .setWrap(true);

  const header = sheet.getRange('A1:C1');
  header.setFontWeight('bold').setBackground('#e0e0e0');

  normalizedData.forEach(function(row, idx){
    const r = idx + 1;
    if (row[0] && row[0].startsWith('■■■')) {
      sheet.getRange('A'+r+':C'+r).merge().setFontWeight('bold').setBackground('#f3f3f3');
    }
    if (row[0] && (row[0].startsWith('{{') || row[0].startsWith('【'))) {
      sheet.getRange('A'+r).setFontWeight('bold');
    }
  });

  sheet.setColumnWidth(1, 180);
  sheet.setColumnWidth(2, 450);
  sheet.setColumnWidth(3, 400);
  sheet.setFrozenRows(1);
  sheet.activate();
  SpreadsheetApp.getUi().alert('新しい「使い方ガイド」シートを作成（更新）しました。');
}
`;