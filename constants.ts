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
    <label>代表者</label><input id="LEGAL_REP" type="text">
    <label>お問い合わせ窓口</label><input id="LEGAL_CONTACT" type="text">
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
<html>
<head>
<title>Form Router</title>
<script>
(function() {
  var FORM_A_URL = '{{FORM_A_URL}}';
  var FORM_B_URL = '{{FORM_B_URL}}';
  var STORAGE_KEY = 'form_ab_variant';
  var COOKIE_TTL_DAYS = 30;

  function getVariant() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'A' || stored === 'B') {
        return stored;
      }
    } catch (e) { console.warn('localStorage not available'); }
    return null;
  }

  function setVariant(variant) {
    try {
      localStorage.setItem(STORAGE_KEY, variant);
    } catch (e) { console.warn('localStorage not available'); }
  }

  function redirect(url) {
    // URLのクエリパラメータを維持したままリダイレクト
    var newUrl = url;
    if (window.location.search) {
      newUrl += (url.indexOf('?') > -1 ? '&' : '?') + window.location.search.substring(1);
    }
    window.location.replace(newUrl);
  }

  var variant = getVariant();
  if (variant) {
    redirect(variant === 'A' ? FORM_A_URL : FORM_B_URL);
  } else {
    var chosenVariant = Math.random() < 0.5 ? 'A' : 'B';
    setVariant(chosenVariant);
    redirect(chosenVariant === 'A' ? FORM_A_URL : FORM_B_URL);
  }
})();
</script>
</head>
<body>
<p>Redirecting...</p>
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
<script>
// Will be replaced by the generator
</script>
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
      if(!CFG || typeof CFG !== 'object') return;
      F.formTitle = CFG.title || '';
      F.formDescription = CFG.subtitle || '';
      if(CFG.analytics){ F.ga4Id = CFG.analytics.ga4_id || ''; }
      if(CFG.operator){ F.operator.defaultIcon = CFG.operator.default_icon || F.operator.defaultIcon; }
      if(CFG.options){
        F.recaptchaSiteKey = CFG.options.recaptcha_site_key || '';
        F.gasEndpointUrl = CFG.options.gas_endpoint_url || '';
      }
      F.conversionUrl = CFG.thanks_url_patterns_input || '';

      const grouped = [];
      const usedIds = new Set();
      const groupDefs = {
          name_full1: [ 'name_full1', 'kana_full1' ],
          company: [ 'industry', 'company_name', 'department', 'position' ],
          birth: [ 'birth', 'gender' ],
          contact: [ 'email', 'tel' ],
          inquiry_file: [ 'inquiry', 'file_upload' ],
      };
      const findGroupKey = id => Object.keys(groupDefs).find(k => groupDefs[k].includes(id));
      
      const fields = CFG.fields || [];
      fields.forEach(field => {
          if (usedIds.has(field.id)) return;
          const groupKey = findGroupKey(field.id);
          if (groupKey) {
              const groupFields = fields.filter(f => groupDefs[groupKey].includes(f.id));
              const groupStep = {
                  id: groupKey,
                  message: groupFields[0].message,
                  operatorIcon: CFG.operator.step_icons ? CFG.operator.step_icons[groupFields.map(f => f.label).join('・')] : undefined,
                  fields: groupFields.map(f => {
                      usedIds.add(f.id); return f;
                  })
              };
              grouped.push(groupStep);
          } else {
              usedIds.add(field.id);
              grouped.push({
                  id: field.id,
                  message: field.message,
                  operatorIcon: CFG.operator.step_icons ? CFG.operator.step_icons[field.label] : undefined,
                  fields: [field]
              });
          }
      });
      F.steps = grouped;
      F.steps.push({ id: 'confirm', message: CFG.options.confirm_message, operatorIcon: CFG.operator.step_icons ? CFG.operator.step_icons['確認画面'] : undefined, fields: [] });
    } catch(e) {
      console.error("CFG conversion error:", e);
    }
  }
  if (window.CFG) {
    applyCFGToFormSettingsSimple(formSettings, window.CFG);
  }
})();
// 以下、フォーム本体のスクリプト...
</script>
<div class="wrap" id="app"></div>
<div id="sendingOverlay" class="overlay"><div class="modal"><div class="bd"><div class="spinner"></div><div class="lead">送信中です...</div><div class="muted">しばらくお待ちください</div></div></div></div>
<div id="toast"></div>
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
  { id: 15, name: "その他（text項目のみ追加できます）" },
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
*  フォーム受付 完全版（Webアプリ）- カスタムメール & ガイド作成機能付き
*  - 初心者向け改善パッチ Ver.4.1 (最終修正版)
*  - 追加修正: 添付リンク（スプシのみ）/ メールはサムネのみ / 重複添付防止 / 先頭0維持 / 共有＝固定anyone
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
  '・お急ぎの場合は下記までお電話ください。','',
  '―― 発信者情報（リーガル表記）――',
  '会社名  : {{LEGAL_COMPANY}}',
  '所在地  : {{LEGAL_ADDRESS}}',
  '電話   : {{LEGAL_TEL}}',
  'メール  : {{LEGAL_EMAIL}}',
  '営業時間 : {{LEGAL_HOURS}}',
  'Web   : {{LEGAL_WEB}}',
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
  'UA     : {{USER_AGENT}}','',
  '▼入力内容',
  '{{INPUTS_TEXT}}','',
  '▼対応メモ',
  '・1～2営業日以内に一次返信。',
  '・見積りのため要ヒアリング：現行ページ数、CMS有無、素材有無、納期。','',
  '―― フッター（自動挿入）――',
  '会社名  : {{LEGAL_COMPANY}} / {{LEGAL_WEB}}',
  '連絡先  : {{LEGAL_TEL}} / {{LEGAL_EMAIL}}',
  '個人情報保護方針: {{LEGAL_PRIVACY_URL}}'
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
  return String(tpl || '').replace(/(\\{\\{|\\[\\[)\\s*(.+?)\\s*(\\}\\}|\\]\\])/g, function(_, __, raw){
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
var LEGAL_LABELS_ = ['会社名','所在地','電話','メール','営業時間','Web','個人情報保護方針'];
function stripEmptyLegalLines_(text){
  // 「ラベル : 」で終わる行を削除（対象ラベル限定）
  var esc = function(s){ return s.replace(/[-/\\^$*+?.()|[\\\]{}]/g,'\\\\$&'); };
  var re = new RegExp('^\\\\s*(?:' + LEGAL_LABELS_.map(esc).join('|') + ')\\\\s*:\\\\s*$', 'u');
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
