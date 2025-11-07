

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { FormData, FormItem, GroupedItem } from './types';
import { FORM_ITEMS, HTML_TEMPLATE, ROUTER_HTML_TEMPLATE, AB_TEST_ITEMS, GAS_CODE_TEMPLATE, SIDEBAR_HTML_TEMPLATE } from './constants';
import { arrayMoveImmutable as arrayMove } from 'array-move';

// --- ▼ 動画URL設定 ▼ ---
// GASの設定方法を解説する動画のURLをここに設定してください
const GAS_TUTORIAL_VIDEO_URL = 'https://drive.google.com/file/d/1TLE39YEVd9fFemRQb0fpFzDAJx0O-3Rr/view?usp=sharing';
// -------------------------


const initialFormData: FormData = {
  title: '',
  subtitle: '',
  useAnalytics: false,
  gtmId: '',
  ga4Id: '',
  selectedItems: [],
  customItem: { title: '', label: '' },
  radioItems: { title: '', options: '' },
  checkboxItems: { title: '', options: '' },
  pulldownItems: { title: '', options: '' },
  optionalItems: [],
  avatarImages: { common: '', specific: [] },
  bubbleTexts: {},
  submitButtonText: '',
  privacyPolicyUrl: '',
  useNewsletter: false,
  newsletterText: '',
  useRecaptcha: false,
  recaptchaSiteKey: '',
  gasUrl: '',
  conversionUrl: '',
  useAbTest: false,
  formA_url: '',
  formB_url: '',
  abTestItem: AB_TEST_ITEMS[0],
  abTestTitleB: '',
  abTestSubtitleB: '',
  abTestSubmitButtonTextB: '',
  abTestItemOrderB: [],
};

// --- Custom Hooks ---
const useCopyToClipboard = (onSuccess?: () => void): [(text: string) => void, boolean] => {
    const [isCopied, setIsCopied] = useState(false);

    const copyToClipboard = useCallback((text: string) => {
        if (isCopied) return;
        navigator.clipboard.writeText(text).then(() => {
            setIsCopied(true);
            onSuccess?.();
            setTimeout(() => {
                setIsCopied(false);
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    }, [isCopied, onSuccess]);

    return [copyToClipboard, isCopied];
};


// --- Helper Functions ---

const groupFormItems = (selectedItems: FormItem[]): GroupedItem[] => {
    const items = [...selectedItems];
    const grouped: GroupedItem[] = [];
    const usedIds = new Set<number>();

    const findAndRemove = (id: number): FormItem | null => {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            const [item] = items.splice(index, 1);
            usedIds.add(item.id);
            return item;
        }
        return null;
    };

    const originalOrder = selectedItems.map(i => i.id);

    for (const id of originalOrder) {
        if (usedIds.has(id)) continue;

        if ([1, 2].includes(id)) {
            const name = findAndRemove(1); const kana = findAndRemove(2);
            if (name && kana) grouped.push([name, kana]); else if (name) grouped.push(name); else if (kana) grouped.push(kana);
        } else if ([3, 4, 5, 6].includes(id)) {
            const companyItems = [findAndRemove(3), findAndRemove(4), findAndRemove(5), findAndRemove(6)].filter(Boolean) as FormItem[];
            if (companyItems.length > 0) grouped.push(companyItems);
        } else if ([8, 9].includes(id)) {
            const birth = findAndRemove(8); const gender = findAndRemove(9);
            if (birth && gender) grouped.push([birth, gender]); else if (birth) grouped.push(birth); else if (gender) grouped.push(gender);
        } else if ([10, 11].includes(id)) {
            const email = findAndRemove(10); const tel = findAndRemove(11);
            if (email && tel) grouped.push([email, tel]); else if (email) grouped.push(email); else if (tel) grouped.push(tel);
        } else if ([13, 14].includes(id)) {
            const inquiry = findAndRemove(13); const file = findAndRemove(14);
            if (inquiry && file) grouped.push([inquiry, file]); else if (inquiry) grouped.push(inquiry); else if (file) grouped.push(file);
        } else {
            const item = findAndRemove(id); if (item) grouped.push(item);
        }
    }
    return grouped;
};

// --- Helper Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>{children}</div>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 border-b pb-3">{children}</h2>
);

const SectionTitle: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
    <h3 className="text-md font-semibold text-gray-800 mb-3">
        {children}
        {required && <span className="text-red-600 text-sm ml-2">必須</span>}
    </h3>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none bg-white ${props.className}`} />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none bg-white ${props.className}`} />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "py-2 px-4 inline-flex items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";
    const variantClasses = variant === 'primary'
        ? "border-transparent bg-teal-600 text-white hover:bg-teal-700"
        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-sm";
    return <button {...props} className={`${baseClasses} ${variantClasses} ${props.className}`}>{children}</button>;
};

const ErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-xs text-red-600 mt-2">{message}</p>;
};

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const CodeBlock: React.FC<{ title: string; code: string; onCopy?: () => void; }> = ({ title, code, onCopy }) => {
    const [copy, isCopied] = useCopyToClipboard(onCopy);

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center bg-gray-700 px-4 py-2">
                <h4 className="text-xs font-semibold text-gray-300">{title}</h4>
                <button
                    onClick={() => copy(code)}
                    className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded-md text-xs inline-flex items-center gap-1"
                >
                    {isCopied ? <><CheckIcon />コピーしました</> : <><CopyIcon />コピー</>}
                </button>
            </div>
            <pre className="text-white p-4 text-xs overflow-auto max-h-80">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const ReorderableList: React.FC<{
    items: FormItem[];
    onMove: (oldIndex: number, newIndex: number) => void;
}> = ({ items, onMove }) => (
    <div className="space-y-2">
        {items.map((item, index) => (
            <div key={item.id} className="flex items-center justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                <span className="text-sm text-gray-700">{item.name}</span>
                <div className="flex items-center gap-x-1">
                    <button
                        onClick={() => onMove(index, index - 1)}
                        disabled={index === 0}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Move ${item.name} up`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </button>
                    <button
                        onClick={() => onMove(index, index + 1)}
                        disabled={index === items.length - 1}
                        className="p-1 rounded-md text-gray-500 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label={`Move ${item.name} down`}
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </button>
                </div>
            </div>
        ))}
    </div>
);

// --- Video Modal Component ---
const VideoModal: React.FC<{ isOpen: boolean; onClose: () => void; videoUrl: string }> = ({ isOpen, onClose, videoUrl }) => {
    if (!isOpen) return null;

    const getEmbedInfo = (url: string): { type: 'iframe' | 'video'; src: string } => {
        const googleDriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const match = url.match(googleDriveRegex);

        if (match && match[1]) {
            const fileId = match[1];
            return { type: 'iframe', src: `https://drive.google.com/file/d/${fileId}/preview` };
        }
        return { type: 'video', src: url };
    };

    const embedInfo = getEmbedInfo(videoUrl);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl w-full max-w-4xl" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">GASの設定方法</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none font-bold">&times;</button>
                </div>
                <div className="bg-black aspect-video">
                    {embedInfo.type === 'video' ? (
                        <video controls autoPlay className="w-full h-full">
                            <source src={embedInfo.src} type="video/mp4" />
                            お使いのブラウザはビデオ再生に対応していません。
                        </video>
                    ) : (
                        <iframe
                            src={embedInfo.src}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---

export default function App() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<any>({});
    const [generatedOutput, setGeneratedOutput] = useState<{ a?: string; b?: string; router?: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'a' | 'b' | 'router'>('a');
    const [itemSelectionError, setItemSelectionError] = useState<string | null>(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [toastText, setToastText] = useState('');
    const [showGasCode, setShowGasCode] = useState(false);

    const showToast = (text: string) => {
        setToastText(text);
        setTimeout(() => setToastText(''), 2500);
    };

    const [copyToClipboard] = useCopyToClipboard();

    // Auto-sort selected items to keep groups together
    useEffect(() => {
        const autoSortSelectedItems = (items: FormItem[]): FormItem[] => {
            const reordered: FormItem[] = [];
            const processedIds = new Set<number>();
            const groupDefs = [
                [1, 2], // お名前, フリガナ
                [3, 4, 5, 6], // 業種, 会社名/屋号, 部署名, 役職
                [8, 9], // 生年月日, 性別
                [10, 11], // メールアドレス, 電話番号
                [13, 14], // お問い合わせ内容, 画像添付
            ];
            const findGroup = (id: number) => groupDefs.find(g => g.includes(id));

            items.forEach(item => {
                if (processedIds.has(item.id)) return;
                const group = findGroup(item.id);
                if (group) {
                    const itemsInGroup = group.map(gid => items.find(i => i.id === gid)).filter((i): i is FormItem => !!i);
                    reordered.push(...itemsInGroup);
                    itemsInGroup.forEach(i => processedIds.add(i.id));
                } else {
                    reordered.push(item);
                    processedIds.add(item.id);
                }
            });
            return reordered;
        };

        const sorted = autoSortSelectedItems(formData.selectedItems);
        const isSameOrder = formData.selectedItems.length === sorted.length && formData.selectedItems.every((item, index) => item.id === sorted[index].id);

        if (!isSameOrder) {
            setFormData(prev => ({ ...prev, selectedItems: sorted }));
        }
    }, [formData.selectedItems]);

    // Synchronize the items for the Pattern B order list with the main selected items.
    useEffect(() => {
        const selectedIds = new Set(formData.selectedItems.map(item => item.id));
        const preservedBItems = formData.abTestItemOrderB.filter(item => selectedIds.has(item.id));
        const preservedBItemIds = new Set(preservedBItems.map(item => item.id));
        const newItemsForB = formData.selectedItems.filter(item => !preservedBItemIds.has(item.id));
        const newAbTestItemOrderB = [...preservedBItems, ...newItemsForB];
        if (newAbTestItemOrderB.length !== formData.abTestItemOrderB.length || 
            !newAbTestItemOrderB.every((item, index) => item.id === formData.abTestItemOrderB[index]?.id)) {
            setFormData(prev => ({ ...prev, abTestItemOrderB: newAbTestItemOrderB }));
        }
    }, [formData.selectedItems, formData.abTestItemOrderB]);


    const handleChange = useCallback(<K extends keyof FormData>(field: K, value: FormData[K] | string) => {
        setFormData(prev => ({ ...prev, [field]: value as any }));
        setErrors(prevErrors => {
            if (prevErrors[field]) {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            }
            return prevErrors;
        });
    }, []);
    
    const handleAvatarChange = useCallback((groupName: string, url: string) => {
        setFormData(prev => {
            if (groupName === 'common') {
                return { ...prev, avatarImages: { ...prev.avatarImages, common: url } };
            }
            const specific = [...prev.avatarImages.specific];
            const existingIndex = specific.findIndex(s => s.itemName === groupName);
            if (url.trim()) {
                if (existingIndex > -1) specific[existingIndex] = { ...specific[existingIndex], url };
                else specific.push({ itemName: groupName, url });
            } else {
                if (existingIndex > -1) specific.splice(existingIndex, 1);
            }
            return { ...prev, avatarImages: { ...prev.avatarImages, specific } };
        });
    }, []);


    const handleItemToggle = useCallback((item: FormItem) => {
        setItemSelectionError(null);
        setFormData(prev => {
            const currentSelected = [...prev.selectedItems];
            const isCurrentlySelected = currentSelected.some(i => i.id === item.id);
            let newSelectedItems: FormItem[];

            if (isCurrentlySelected) {
                newSelectedItems = currentSelected.filter(i => i.id !== item.id);
                if (item.id === 13) newSelectedItems = newSelectedItems.filter(i => i.id !== 14);
            } else {
                if (item.id === 14 && !currentSelected.some(i => i.id === 13)) {
                    setItemSelectionError("「画像添付」を選択するには、先に「お問い合わせ内容」を選択してください。");
                    return prev;
                }
                newSelectedItems = [...currentSelected, item];
            }
            return { ...prev, selectedItems: newSelectedItems };
        });
        setErrors(prev => ({ ...prev, selectedItems: undefined }));
    }, []);

    const handleOptionalItemToggle = useCallback((item: FormItem) => {
        setFormData(prev => {
            const newOptionalItems = prev.optionalItems.some(i => i.id === item.id)
                ? prev.optionalItems.filter(i => i.id !== item.id)
                : [...prev.optionalItems, item];
            return { ...prev, optionalItems: newOptionalItems };
        });
    }, []);

    const groupedItems = useMemo((): GroupedItem[] => groupFormItems(formData.selectedItems), [formData.selectedItems]);
    
    const handleMoveItem = useCallback((listKey: 'selectedItems' | 'abTestItemOrderB', oldIndex: number, newIndex: number) => {
        setFormData(prev => {
            const list = prev[listKey];
            if (newIndex < 0 || newIndex >= list.length) return prev;
            return { ...prev, [listKey]: arrayMove(list, oldIndex, newIndex) };
        });
    }, []);

    const generateWindowCfg = (data: FormData, variant: 'A' | 'B' = 'A') => {
        const finalData = { ...data };
        const itemOrder = variant === 'A' ? data.selectedItems : data.abTestItemOrderB;
        if (variant === 'B' && data.useAbTest) {
            switch(data.abTestItem) {
                case 'フォームタイトル': finalData.title = data.abTestTitleB; break;
                case 'フォームサブタイトル': finalData.subtitle = data.abTestSubtitleB; break;
                case '送信ボタンの文言': finalData.submitButtonText = data.abTestSubmitButtonTextB; break;
            }
        }
        const groupedForVariant = groupFormItems(itemOrder);
        const itemToGroupName = new Map<number, string>();
        groupedForVariant.forEach(group => {
            if (Array.isArray(group)) {
                const groupName = group.map(i => i.name).join('・');
                group.forEach(item => itemToGroupName.set(item.id, groupName));
            } else {
                itemToGroupName.set(group.id, group.name);
            }
        });
        const stepIcons: { [key: string]: string } = {};
        finalData.avatarImages.specific.forEach(spec => {
            if (spec.itemName && spec.url) stepIcons[spec.itemName] = spec.url;
        });
        const cfg = {
            title: finalData.title,
            subtitle: finalData.subtitle,
            analytics: {
                gtm_id: finalData.useAnalytics ? finalData.gtmId : "",
                ga4_id: finalData.useAnalytics ? finalData.ga4Id : "",
            },
            operator: {
                default_icon: finalData.avatarImages.common || "https://shungene.lm-c.jp/ef/opr.jpg",
                step_icons: stepIcons
            },
            options: {
                submit_label: finalData.submitButtonText || '送信',
                privacy_policy_url: finalData.privacyPolicyUrl,
                newsletter: { enabled: finalData.useNewsletter, label: finalData.newsletterText || 'ニュースレター/最新情報を受け取る' },
                recaptcha_site_key: finalData.useRecaptcha ? finalData.recaptchaSiteKey : '',
                gas_endpoint_url: data.gasUrl,
                confirm_message: finalData.bubbleTexts['確認画面'],
                conversion_url: finalData.conversionUrl,
            },
            thanks_url_patterns_input: finalData.conversionUrl,
            fields: [] as any[]
        };
        const optionalIds = new Set(finalData.optionalItems.map(i => i.id));
        itemOrder.forEach(item => {
            const isRequired = !optionalIds.has(item.id);
            const groupName = itemToGroupName.get(item.id);
            const message = groupName ? finalData.bubbleTexts[groupName] : undefined;
            const commonProps = { label: item.name, required: isRequired, message: message };
            switch(item.id) {
                case 1: cfg.fields.push({ id: 'name_full1', type: 'name_full1', ...commonProps }); break;
                case 2: cfg.fields.push({ id: 'kana_full1', type: 'kana_full1', ...commonProps }); break;
                case 3: cfg.fields.push({ id: 'industry', type: 'text', ...commonProps }); break;
                case 4: cfg.fields.push({ id: 'company_name', type: 'text', ...commonProps }); break;
                case 5: cfg.fields.push({ id: 'department', type: 'text', ...commonProps }); break;
                case 6: cfg.fields.push({ id: 'position', type: 'text', ...commonProps }); break;
                case 7: cfg.fields.push({ id: 'address', type: 'address', ...commonProps }); break;
                case 8: cfg.fields.push({ id: 'birth', type: 'birth', ...commonProps }); break;
                case 9: cfg.fields.push({ id: 'gender', type: 'gender', ...commonProps }); break;
                case 10: cfg.fields.push({ id: 'email', type: 'email', ...commonProps }); break;
                case 11: cfg.fields.push({ id: 'tel', type: 'tel', ...commonProps }); break;
                case 12: cfg.fields.push({ id: 'website', type: 'url', ...commonProps }); break;
                case 13: cfg.fields.push({ id: 'inquiry', type: 'textarea', ...commonProps }); break;
                case 14: cfg.fields.push({ id: 'file_upload', type: 'file', ...commonProps }); break;
                case 15: {
                    const customTitle = finalData.customItem.title.trim();
                    const customLabel = finalData.customItem.label.trim();
                    if (customLabel) {
                        cfg.fields.push({
                            id: 'custom_text_0',
                            type: 'text',
                            label: customLabel,
                            required: isRequired,
                            message: customTitle || message || customLabel,
                        });
                    }
                    break;
                }
                case 16: cfg.fields.push({ id: 'custom_radio', type: 'radio', label: finalData.radioItems.title, choices: finalData.radioItems.options.split(/[\n,、]+/).map(s => s.trim()).filter(Boolean), required: isRequired, message }); break;
                case 17: cfg.fields.push({ id: 'custom_checkbox', type: 'checkbox', label: finalData.checkboxItems.title, choices: finalData.checkboxItems.options.split(/[\n,、]+/).map(s => s.trim()).filter(Boolean), required: isRequired, message }); break;
                case 18: cfg.fields.push({ id: 'custom_select', type: 'select', label: finalData.pulldownItems.title, choices: finalData.pulldownItems.options.split(/[\n,、]+/).map(s => s.trim()).filter(Boolean), required: isRequired, message }); break;
            }
        });
        return cfg;
    };
    
    const handleGenerate = () => {
        const generateFinalHtml = (cfg: any) => {
            let html = HTML_TEMPLATE;
            const cfgString = JSON.stringify(cfg, null, 2);
            const scriptTag = `<script>\nwindow.CFG = ${cfgString};\n</script>`;
            
            // 正規表現を使用して、開始コメントと終了コメントの間を確実に置換します
            const placeholderRegex = /(<!-- ▼▼▼ ここにAIが生成した window.CFG を貼り付けてください ▼▼▼ -->)[\s\S]*?(<!-- ▲▲▲ ここまで ▲▲▲ -->)/;

            html = html.replace(
                placeholderRegex,
                `$1\n${scriptTag}\n$2`
            );
            return html;
        };
        const cfgA = generateWindowCfg(formData, 'A');
        const htmlA = generateFinalHtml(cfgA);
        if (formData.useAbTest) {
            const cfgB = generateWindowCfg(formData, 'B');
            const htmlB = generateFinalHtml(cfgB);
            const routerHtml = ROUTER_HTML_TEMPLATE.replace('{{FORM_A_URL}}', formData.formA_url).replace('{{FORM_B_URL}}', formData.formB_url);
            setGeneratedOutput({ a: htmlA, b: htmlB, router: routerHtml });
        } else {
            setGeneratedOutput({ a: htmlA });
        }
    };
    
    const handleSubmit = () => {
        const newErrors: any = {};
        if (!formData.title.trim()) newErrors.title = 'フォームタイトルを入力してください。';
        if (formData.useAnalytics) {
            if (!formData.gtmId.trim().match(/^GTM-[A-Z0-9]{7,}$/)) newErrors.gtmId = '正しいGTMコンテナIDを入力してください (例: GTM-XXXXXXX)。';
            if (!formData.ga4Id.trim().match(/^G-[A-Z0-9]{10,}$/)) newErrors.ga4Id = '正しいGA4測定IDを入力してください (例: G-XXXXXXXXXX)。';
        }
        if (formData.selectedItems.length === 0) newErrors.selectedItems = 'フォームに入れる項目を1つ以上選択してください。';
        if (hasItem(15) && !formData.customItem.label.trim()) newErrors.customItem = 'カスタム項目の項目名を入力してください。';
        if (hasItem(16)) { if (!formData.radioItems.title.trim() || !formData.radioItems.options.trim()) newErrors.radioItems = 'ラジオボタンのタイトルと選択肢を両方入力してください。'; }
        if (hasItem(17)) { if (!formData.checkboxItems.title.trim() || !formData.checkboxItems.options.trim()) newErrors.checkboxItems = 'チェックボックスのタイトルと選択肢を両方入力してください。'; }
        if (hasItem(18)) { if (!formData.pulldownItems.title.trim() || !formData.pulldownItems.options.trim()) newErrors.pulldownItems = 'プルダウンのタイトルと選択肢を両方入力してください。'; }
        if (!formData.privacyPolicyUrl.trim().match(/^https?:\/\//)) newErrors.privacyPolicyUrl = '有効なURLを入力してください。';
        if (!formData.gasUrl.trim().match(/^https?:\/\/script\.google\.com\/macros\/s\/.+\/exec$/)) newErrors.gasUrl = '有効なGAS WebアプリURLを入力してください。';
        if (!formData.conversionUrl.trim()) newErrors.conversionUrl = 'サンクスページURLを入力してください。';
        if (formData.useRecaptcha && !formData.recaptchaSiteKey.trim()) newErrors.recaptchaSiteKey = 'reCAPTCHAサイトキーを入力してください。';
        if (formData.useAbTest) {
            if (!formData.formA_url.trim().match(/^https?:\/\//) && !formData.formA_url.trim().startsWith('/')) newErrors.formA_url = '有効なURLまたは相対パスを入力してください。';
            if (!formData.formB_url.trim().match(/^https?:\/\//) && !formData.formB_url.trim().startsWith('/')) newErrors.formB_url = '有効なURLまたは相対パスを入力してください。';
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
            handleGenerate();
        } else {
            const firstErrorKey = Object.keys(newErrors)[0] as keyof FormData;
            document.getElementById(`field-container-${firstErrorKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };
    
    if (generatedOutput) {
        const currentContent = activeTab === 'a' ? generatedOutput.a : activeTab === 'b' ? generatedOutput.b : generatedOutput.router;
        return (
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <Title>生成されたHTMLコード</Title>
                    <p className="text-sm text-gray-600 mb-6">以下のコードをコピーして、HTMLファイルとして保存・公開してください。</p>
                     {generatedOutput.b && (
                        <div className="mb-4 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4" aria-label="Tabs"><button onClick={() => setActiveTab('a')} className={`${activeTab === 'a' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>パターンA HTML</button><button onClick={() => setActiveTab('b')} className={`${activeTab === 'b' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>パターンB HTML</button><button onClick={() => setActiveTab('router')} className={`${activeTab === 'router' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>ルーター HTML</button></nav>
                        </div>
                    )}
                    <div className="relative">
                        <CodeBlock 
                            title={activeTab === 'a' ? "パターンA HTML" : activeTab === 'b' ? "パターンB HTML" : "ルーター HTML"}
                            code={currentContent || ''}
                            onCopy={() => showToast('HTMLコードをコピーしました')}
                        />
                    </div>
                </div>
            </div>
        )
    }
    const hasItem = (id: number) => formData.selectedItems.some(i => i.id === id);
    return (
        <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
            <VideoModal isOpen={showVideoModal} onClose={() => setShowVideoModal(false)} videoUrl={GAS_TUTORIAL_VIDEO_URL} />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center mb-8"><h1 className="text-3xl font-bold text-gray-800">瞬フォーム オーダーシート</h1><p className="mt-2 text-gray-600">必要な項目を入力し、最後に「HTMLを生成」ボタンを押してください。</p></div>
                <Card><Title>1. 基本設定</Title><div className="space-y-6"><div id="field-container-title" className="p-4 border rounded-lg bg-gray-100"><SectionTitle required>フォームタイトルとサブタイトル</SectionTitle><div className="space-y-4"><Input placeholder="フォームタイトル（例：かんたんお問い合わせ）" value={formData.title} onChange={e => handleChange('title', e.target.value)} /><ErrorMessage message={errors.title} /><Textarea placeholder="サブタイトル（例：所要時間：約1分・入力途中でも保存されます）" value={formData.subtitle} onChange={e => handleChange('subtitle', e.target.value)} rows={3} /></div></div><div id="field-container-gtmId" className="p-4 border rounded-lg bg-gray-100"><SectionTitle>データ解析（GTM/GA4）</SectionTitle><div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="useAnalytics" checked={!formData.useAnalytics} onChange={() => handleChange('useAnalytics', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">しない</span></label><label className="flex items-center"><input type="radio" name="useAnalytics" checked={formData.useAnalytics} onChange={() => handleChange('useAnalytics', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">する</span></label></div>{formData.useAnalytics && <div className="space-y-4 mt-4 pl-6 border-l-2 border-teal-100"><Input placeholder="GTM-XXXXXXX" value={formData.gtmId} onChange={e => handleChange('gtmId', e.target.value)} /><ErrorMessage message={errors.gtmId} /><Input placeholder="G-XXXXXXXXXX" value={formData.ga4Id} onChange={e => handleChange('ga4Id', e.target.value)} /><ErrorMessage message={errors.ga4Id} /></div>}</div></div></Card>
                <Card><Title>2. フォーム項目</Title>
                    <div className="space-y-6">
                        <div className="p-3 text-xs text-gray-600 bg-gray-100 rounded-lg"><strong>グルーピング仕様:</strong><br />以下の項目は、同時に選択するとフォームの同じページにまとめて表示されます。このリスト上でも隣り合うように自動で並び替えられます。<br/>・お名前 + フリガナ<br/>・業種, 会社名/屋号, 部署名, 役職 (2つ以上選択時)<br/>・生年月日 + 性別<br/>・メールアドレス + 電話番号<br/>・お問い合わせ内容 + 画像添付</div>
                        <div id="field-container-selectedItems" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <SectionTitle>利用可能な項目<span className="text-red-600 text-sm ml-2 font-normal">(1つ以上の選択必須)</span></SectionTitle>
                                {itemSelectionError && <ErrorMessage message={itemSelectionError} />}
                                <div className="space-y-2 max-h-96 overflow-y-auto p-2 border rounded-lg bg-white">{FORM_ITEMS.map(item => (<label key={item.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer"><input type="checkbox" checked={hasItem(item.id)} onChange={() => handleItemToggle(item)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-3 text-sm text-gray-700">{item.name}</span></label>))}</div>
                            </div>
                            <div>
                                <SectionTitle>選択した項目（順序変更可）</SectionTitle>
                                <div className="p-2 border rounded-lg min-h-[24rem] bg-white">{formData.selectedItems.length > 0 ? (<ReorderableList items={formData.selectedItems} onMove={(oldIndex, newIndex) => handleMoveItem('selectedItems', oldIndex, newIndex)} />) : (<div className="text-center text-gray-500 py-10">項目を選択してください</div>)}</div>
                            </div>
                        </div>
                        <ErrorMessage message={errors.selectedItems as string} />
                        {(hasItem(15) || hasItem(16) || hasItem(17) || hasItem(18)) &&
                            <div className="p-4 border rounded-lg bg-gray-100 space-y-4">
                                {hasItem(15) && <div id="field-container-customItem" className="space-y-2"><SectionTitle>カスタム項目</SectionTitle>
                                    <Input placeholder="タイトル（例：その他情報）" value={formData.customItem.title} onChange={e => handleChange('customItem', { ...formData.customItem, title: e.target.value })} />
                                    <Input placeholder="項目名（例：紹介コード）" value={formData.customItem.label} onChange={e => handleChange('customItem', { ...formData.customItem, label: e.target.value })} />
                                    <ErrorMessage message={errors.customItem} /></div>}
                                {hasItem(16) && <div id="field-container-radioItems" className="space-y-2 mt-4"><SectionTitle>ラジオボタン</SectionTitle><Input placeholder="タイトル" value={formData.radioItems.title} onChange={e => handleChange('radioItems', { ...formData.radioItems, title: e.target.value })} /><Textarea placeholder="選択肢（改行区切り）" value={formData.radioItems.options} onChange={e => handleChange('radioItems', { ...formData.radioItems, options: e.target.value })} rows={3} /><p className="text-xs text-gray-500 mt-1">ヒント：「その他」という選択肢を追加すると、ユーザーが自由入力できるテキスト欄が表示されます。</p><ErrorMessage message={errors.radioItems as string} /></div>}
                                {hasItem(17) && <div id="field-container-checkboxItems" className="space-y-2 mt-4"><SectionTitle>チェックボックス</SectionTitle><Input placeholder="タイトル" value={formData.checkboxItems.title} onChange={e => handleChange('checkboxItems', { ...formData.checkboxItems, title: e.target.value })} /><Textarea placeholder="選択肢（改行区切り）" value={formData.checkboxItems.options} onChange={e => handleChange('checkboxItems', { ...formData.checkboxItems, options: e.target.value })} rows={3} /><p className="text-xs text-gray-500 mt-1">ヒント：「その他」という選択肢を追加すると、ユーザーが自由入力できるテキスト欄が表示されます。</p><ErrorMessage message={errors.checkboxItems as string} /></div>}
                                {hasItem(18) && <div id="field-container-pulldownItems" className="space-y-2 mt-4"><SectionTitle>プルダウン</SectionTitle><Input placeholder="タイトル" value={formData.pulldownItems.title} onChange={e => handleChange('pulldownItems', { ...formData.pulldownItems, title: e.target.value })} /><Textarea placeholder="選択肢（改行区切り）" value={formData.pulldownItems.options} onChange={e => handleChange('pulldownItems', { ...formData.pulldownItems, options: e.target.value })} rows={3} /><p className="text-xs text-gray-500 mt-1">ヒント：「その他」という選択肢を追加すると、ユーザーが自由入力できるテキスト欄が表示されます。</p><ErrorMessage message={errors.pulldownItems as string} /></div>}
                            </div>
                        }
                        <div className="p-4 border rounded-lg bg-gray-100">
                            <SectionTitle>任意にする項目の指定</SectionTitle>
                            <div className="space-y-2 max-h-60 overflow-y-auto">{formData.selectedItems.map(item => (<label key={item.id} className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"><input type="checkbox" checked={formData.optionalItems.some(i => i.id === item.id)} onChange={() => handleOptionalItemToggle(item)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-3 text-sm text-gray-700">{item.name}</span></label>))}</div>
                        </div>
                    </div>
                </Card>
                <Card><Title>3. 表示オプションと連携設定</Title><div className="space-y-6"><div className="p-4 border rounded-lg bg-gray-100 space-y-4"><SectionTitle>吹き出し用の画像</SectionTitle><div><label className="text-sm font-medium text-gray-600">共通アバター画像URL</label><Input placeholder="https://example.com/default-avatar.png" value={formData.avatarImages.common} onChange={e => handleAvatarChange('common', e.target.value)} /></div><div className="mt-4"><label className="text-sm font-medium text-gray-600">項目別アバター画像URL</label><p className="text-xs text-gray-500 mb-2">共通アバターを変更するページのみ記入してください</p><div className="space-y-3 mt-2 max-h-80 overflow-y-auto p-2 border rounded-lg bg-white">{groupedItems.map((item, index) => { const groupName = Array.isArray(item) ? item.map(i => i.name).join('・') : item.name; const specificUrl = formData.avatarImages.specific.find(s => s.itemName === groupName)?.url || ''; return (<div key={index}><label className="text-xs text-gray-500 block mb-1">{groupName}</label><Input placeholder={`「${groupName}」用のアバターURL`} value={specificUrl} onChange={e => handleAvatarChange(groupName, e.target.value)} /></div>)})}{(() => { const groupName = '確認画面'; const specificUrl = formData.avatarImages.specific.find(s => s.itemName === groupName)?.url || ''; return (<div><label className="text-xs text-gray-500 block mb-1">{groupName}</label><Input placeholder={`「${groupName}」用のアバターURL`} value={specificUrl} onChange={e => handleAvatarChange(groupName, e.target.value)} /></div>)})()}</div></div></div>
<div className="p-4 border rounded-lg bg-gray-100"><SectionTitle>吹き出し用のセリフ</SectionTitle><p className="text-xs text-gray-500 mb-3">無記入の場合は、各項目のタイトルがセリフとして表示されます。</p><div className="space-y-4 max-h-96 overflow-y-auto">{groupedItems.map((item, index) => { const groupName = Array.isArray(item) ? item.map(i => i.name).join('・') : item.name; return (<div key={index}><label className="text-sm font-medium text-gray-600">{groupName}</label><Input placeholder={`「${groupName}」のセリフ`} value={formData.bubbleTexts[groupName] || ''} onChange={e => handleChange('bubbleTexts', {...formData.bubbleTexts, [groupName]: e.target.value})} /></div>)})}{<div><label className="text-sm font-medium text-gray-600">確認画面</label><Input placeholder="確認画面のセリフ" value={formData.bubbleTexts['確認画面'] || ''} onChange={e => handleChange('bubbleTexts', {...formData.bubbleTexts, '確認画面': e.target.value})} /></div>}</div></div>
<div id="field-container-submitButtonText" className="p-4 border rounded-lg bg-gray-100"><SectionTitle>送信ボタンの文言</SectionTitle><Input placeholder="送信" value={formData.submitButtonText} onChange={e => handleChange('submitButtonText', e.target.value)} /></div>
<div id="field-container-privacyPolicyUrl" className="p-4 border rounded-lg bg-gray-100"><SectionTitle required>個人情報の取り扱いリンクURL</SectionTitle><Input type="url" placeholder="https://example.com/privacy" value={formData.privacyPolicyUrl} onChange={e => handleChange('privacyPolicyUrl', e.target.value)} /><ErrorMessage message={errors.privacyPolicyUrl} /></div>
<div className="p-4 border rounded-lg bg-gray-100"><SectionTitle>ニュースレター購読チェックボックス</SectionTitle><div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="useNewsletter" checked={!formData.useNewsletter} onChange={() => handleChange('useNewsletter', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">不要</span></label><label className="flex items-center"><input type="radio" name="useNewsletter" checked={formData.useNewsletter} onChange={() => handleChange('useNewsletter', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">必要</span></label></div>{formData.useNewsletter && <Input className="mt-4" placeholder="ニュースレター/最新情報を受け取る" value={formData.newsletterText} onChange={e => handleChange('newsletterText', e.target.value)} />}</div>
<div id="field-container-recaptchaSiteKey" className="p-4 border rounded-lg bg-gray-100"><SectionTitle>reCAPTCHA v3</SectionTitle><div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="useRecaptcha" checked={!formData.useRecaptcha} onChange={() => handleChange('useRecaptcha', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">使わない</span></label><label className="flex items-center"><input type="radio" name="useRecaptcha" checked={formData.useRecaptcha} onChange={() => handleChange('useRecaptcha', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">使う</span></label></div>{formData.useRecaptcha && <div className="mt-4 pl-6 border-l-2 border-teal-100"><Input placeholder="サイトキー" value={formData.recaptchaSiteKey} onChange={e => handleChange('recaptchaSiteKey', e.target.value)} /><ErrorMessage message={errors.recaptchaSiteKey} /></div>}</div>
<div id="field-container-gasUrl" className="p-4 border rounded-lg bg-gray-100">
    <SectionTitle required>Google Apps Script (GAS) 連携</SectionTitle>
    <p className="text-xs text-gray-600 mb-3">フォームの送信データをGASで受信し、自動返信メールやスプレッドシートへの記録を行います。動画の手順に従って設定してください。</p>
    
    <label className="text-sm font-medium text-gray-600 block mt-4">【必須】GAS WebアプリURL</label>
    <Input className="mt-1 w-full" placeholder="https://script.google.com/macros/s/..." value={formData.gasUrl} onChange={e => handleChange('gasUrl', e.target.value)} />
    <ErrorMessage message={errors.gasUrl} />

    <div className="flex items-center gap-4 mt-4">
        <Button variant="ghost" onClick={() => setShowVideoModal(true)}>GASの設定方法を動画で見る</Button>
        <Button variant="ghost" onClick={() => setShowGasCode(p => !p)}>{showGasCode ? 'GASコードを隠す' : 'GASコードを表示'}</Button>
    </div>
    {showGasCode && (
        <div className="mt-4 space-y-4">
            <div>
                <p className="text-sm text-gray-800 mb-2">
                    <span className="font-bold">1. </span>
                    <a href="https://sheets.new" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline hover:text-teal-700">
                        新規Googleスプレッドシート
                    </a>
                    を開き、メニューから「拡張機能」{' > '}「Apps Script」を選択してスクリプトエディタを開きます。その後、以下の2つのファイルを準備してください。
                </p>
            </div>
            <CodeBlock
                title="ファイル1: Code.gs (この内容に書き換える)"
                code={GAS_CODE_TEMPLATE}
                onCopy={() => showToast('Code.gs のコードをコピーしました')}
            />
            <CodeBlock
                title="ファイル2: Sidebar.html (新規HTMLファイルとして作成)"
                code={SIDEBAR_HTML_TEMPLATE}
                onCopy={() => showToast('Sidebar.html のコードをコピーしました')}
            />
        </div>
    )}
</div>
<div id="field-container-conversionUrl" className="p-4 border rounded-lg bg-gray-100"><SectionTitle required>サンクスページ（フォーム送信後の完了画面）URL</SectionTitle><Input placeholder="https://example.com/thanks" value={formData.conversionUrl} onChange={e => handleChange('conversionUrl', e.target.value)} /><ErrorMessage message={errors.conversionUrl} /></div></div></Card>
<Card><Title>4. A/Bテスト設定</Title><div className="p-4 border rounded-lg bg-gray-100"><div className="flex items-center space-x-4"><label className="flex items-center"><input type="radio" name="useAbTest" checked={!formData.useAbTest} onChange={() => handleChange('useAbTest', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">しない</span></label><label className="flex items-center"><input type="radio" name="useAbTest" checked={formData.useAbTest} onChange={() => handleChange('useAbTest', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" /><span className="ml-2 text-sm">する</span></label></div>{formData.useAbTest && <div className="space-y-6 mt-4 pt-4 pl-6 border-l-2 border-teal-100"><div id="field-container-formA_url" className="space-y-2"><SectionTitle>パターンAの公開URL</SectionTitle><Input placeholder="/form-a.html" value={formData.formA_url} onChange={e => handleChange('formA_url', e.target.value)} /><ErrorMessage message={errors.formA_url} /></div><div id="field-container-formB_url" className="space-y-2"><SectionTitle>パターンBの公開URL</SectionTitle><Input placeholder="/form-b.html" value={formData.formB_url} onChange={e => handleChange('formB_url', e.target.value)} /><ErrorMessage message={errors.formB_url} /></div><div className="space-y-2"><SectionTitle>テストする項目</SectionTitle><select value={formData.abTestItem} onChange={e => handleChange('abTestItem', e.target.value)} className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500"><option disabled>選択してください</option>{AB_TEST_ITEMS.map(item => <option key={item} value={item}>{item}</option>)}</select></div>
{formData.abTestItem === 'フォームタイトル' && <div id="field-container-abTestTitleB" className="space-y-2"><SectionTitle>パターンBのフォームタイトル</SectionTitle><Input placeholder="新しいフォームタイトル" value={formData.abTestTitleB} onChange={e => handleChange('abTestTitleB', e.target.value)} /></div>}
{formData.abTestItem === 'フォームサブタイトル' && <div id="field-container-abTestSubtitleB" className="space-y-2"><SectionTitle>パターンBのサブタイトル</SectionTitle><Textarea placeholder="新しいサブタイトル" value={formData.abTestSubtitleB} onChange={e => handleChange('abTestSubtitleB', e.target.value)} rows={3} /></div>}
{formData.abTestItem === '送信ボタンの文言' && <div id="field-container-abTestSubmitButtonTextB" className="space-y-2"><SectionTitle>パターンBの送信ボタン文言</SectionTitle><Input placeholder="送信する" value={formData.abTestSubmitButtonTextB} onChange={e => handleChange('abTestSubmitButtonTextB', e.target.value)} /></div>}
{formData.abTestItem === '質問の順番' && <div id="field-container-abTestItemOrderB" className="space-y-2"><SectionTitle>パターンBの質問順序</SectionTitle><div className="p-2 border rounded-lg min-h-[24rem] bg-white">{formData.abTestItemOrderB.length > 0 ? (<ReorderableList items={formData.abTestItemOrderB} onMove={(oldIndex, newIndex) => handleMoveItem('abTestItemOrderB', oldIndex, newIndex)} />) : (<div className="text-center text-gray-500 py-10">項目を選択してください</div>)}</div></div>}
</div>}</div></Card>
                <div className="mt-8 text-center"><Button onClick={handleSubmit} className="w-full sm:w-auto text-lg font-bold py-4 px-8">HTMLを生成</Button></div>
            </div>
            {toastText && (
                <div className="fixed bottom-5 right-5 bg-gray-900 text-white py-2 px-4 rounded-lg shadow-lg text-sm transition-opacity duration-300 opacity-100">
                    {toastText}
                </div>
            )}
        </div>
    );
}
