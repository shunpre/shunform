
import { FormItem } from './types';

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
      const fName = take(f => f.type==='name_full1' || /(^|\s)(お?名前)\b/.test(f.label||''));
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
    const escHtml = (s) => String(s||'').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
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
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));
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
    box.innerHTML = \`<div class="confirm-panel">\${items.map(it=>\`<div class="confirm-item"><div class="confirm-label">\${esc(it.l)}</div><div class="confirm-value-wrapper"><div class="confirm-value">\${esc(it.v)}</div><button type="button" class="btn ghost" data-edit-step="\${it.step}" \${it.focus?\`data-focus="\${it.focus}"\`:''}>修正</button></div></div>\`).join('')}</div>\`;
  }

  // [パッチ適用] submitNow全体を差し替え
  function submitNow() {
    const btn = $('#submitBtn');
    btn.disabled = true;
    showSendingOverlay(true, '送信中です...');

    const finalize = async () => {
      // reCAPTCHAはfinalizeの前に移動
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
      
      // 送信成否に関わらず、後処理とリダイレクトを実行
      localStorage.removeItem(S.storageKey);

      if (S.conversionUrl) {
        // [パッチ適用] location.hrefからlocation.replaceに変更
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
            .catch(() => finalize()); // reCAPTCHA失敗でも送信試行
        });
      } catch (_) {
        finalize(); // reCAPTCHAライブラリでエラーでも送信試行
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

export const ROUTER_HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<title>リダイレクト中...</title>
<script>
(function() {
  const formAUrl = '{{FORM_A_URL}}';
  const formBUrl = '{{FORM_B_URL}}';
  const storageKey = 'form-ab-variant-2024';
  const ttl = 30 * 24 * 60 * 60 * 1000; // 30 days

  let variant = null;
  let stored = null;
  try {
    stored = JSON.parse(localStorage.getItem(storageKey));
  } catch (e) {
    console.error("Error reading from localStorage", e);
  }

  if (stored && stored.variant && Date.now() < stored.expires) {
    variant = stored.variant;
  } else {
    variant = Math.random() < 0.5 ? 'a' : 'b';
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        variant: variant,
        expires: Date.now() + ttl
      }));
    } catch (e) {
      console.error("Error writing to localStorage", e);
    }
  }

  const baseUrl = variant === 'a' ? formAUrl : formBUrl;
  
  // 現在のページのクエリパラメータを維持
  const currentParams = new URLSearchParams(window.location.search);
  
  // 新しいURLオブジェクトを作成し、クエリパラメータをマージ
  const finalUrl = new URL(baseUrl, window.location.href);
  currentParams.forEach((value, key) => {
    finalUrl.searchParams.set(key, value);
  });

  // ABテストのバリアント情報をクエリパラメータに追加
  finalUrl.searchParams.set('ab_variant', variant);

  window.location.replace(finalUrl.href);
})();
</script>
</head>
<body>
  <p>フォームへリダイレクトしています...</p>
</body>
</html>
`;
