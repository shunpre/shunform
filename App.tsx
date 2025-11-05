
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Step, FormData, FormItem, GroupedItem } from './types';
import { FORM_ITEMS, HTML_TEMPLATE, ROUTER_HTML_TEMPLATE, AB_TEST_ITEMS } from './constants';
import { arrayMoveImmutable as arrayMove } from 'array-move';

const initialFormData: FormData = {
  title: '',
  subtitle: '',
  useAnalytics: false,
  gtmId: '',
  ga4Id: '',
  selectedItems: [],
  otherItems: '',
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

// --- Helper Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 ${className}`}>{children}</div>
);

const Title: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{children}</h2>
);

const Description: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <p className="text-sm text-gray-600 mb-6 whitespace-pre-wrap">{children}</p>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none bg-white ${props.className}`} />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} className={`py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-teal-500 focus:ring-teal-500 disabled:opacity-50 disabled:pointer-events-none bg-white ${props.className}`} />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }> = ({ children, variant = 'primary', ...props }) => {
    const baseClasses = "py-2 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none";
    const variantClasses = variant === 'primary'
        ? "border-transparent bg-teal-600 text-white hover:bg-teal-700"
        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50 shadow-sm";
    return <button {...props} className={`${baseClasses} ${variantClasses}`}>{children}</button>;
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

// --- Main App Component ---

export default function App() {
    const [step, setStep] = useState<Step>(Step.Q1_1);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [generatedOutput, setGeneratedOutput] = useState<{ a?: string; b?: string; router?: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'a' | 'b' | 'router'>('a');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (formData.selectedItems.length > 0 && formData.abTestItemOrderB.length === 0) {
            setFormData(prev => ({ ...prev, abTestItemOrderB: [...prev.selectedItems] }));
        }
    }, [formData.selectedItems, formData.abTestItemOrderB.length]);

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

    const handleItemToggle = useCallback((item: FormItem) => {
        setFormData(prev => {
            const newSelectedItems = prev.selectedItems.some(i => i.id === item.id)
                ? prev.selectedItems.filter(i => i.id !== item.id)
                : [...prev.selectedItems, item];
            return { ...prev, selectedItems: newSelectedItems };
        });
        setErrors(prevErrors => {
            if (prevErrors.selectedItems) {
                const newErrors = { ...prevErrors };
                delete newErrors.selectedItems;
                return newErrors;
            }
            return prevErrors;
        });
    }, []);

    const handleOptionalItemToggle = useCallback((item: FormItem) => {
        setFormData(prev => {
            const newOptionalItems = prev.optionalItems.some(i => i.id === item.id)
                ? prev.optionalItems.filter(i => i.id !== item.id)
                : [...prev.optionalItems, item];
            return { ...prev, optionalItems: newOptionalItems };
        });
    }, []);

    const groupedItems = useMemo((): GroupedItem[] => {
        const items = [...formData.selectedItems];
        const grouped: GroupedItem[] = [];
        const usedIds = new Set<number>();

        const findAndRemove = (id: number) => {
            const index = items.findIndex(item => item.id === id);
            if (index !== -1) {
                const [item] = items.splice(index, 1);
                usedIds.add(item.id);
                return item;
            }
            return null;
        };
        
        const originalOrder = formData.selectedItems.map(i => i.id);

        for (const id of originalOrder) {
            if (usedIds.has(id)) continue;

            const currentItem = FORM_ITEMS.find(i => i.id === id)!;
            
            // (1+2)
            if (id === 1 || id === 2) {
                const name = findAndRemove(1);
                const kana = findAndRemove(2);
                if (name && kana) grouped.push([name, kana]);
                else if (name) grouped.push(name);
                else if (kana) grouped.push(kana);
                continue;
            }
            // (3-6)
            if ([3, 4, 5, 6].includes(id)) {
                const companyItems = [findAndRemove(3), findAndRemove(4), findAndRemove(5), findAndRemove(6)].filter(Boolean) as FormItem[];
                if (companyItems.length > 0) grouped.push(companyItems);
                continue;
            }
            // (8+9)
            if (id === 8 || id === 9) {
                const birth = findAndRemove(8);
                const gender = findAndRemove(9);
                if (birth && gender) grouped.push([birth, gender]);
                else if (birth) grouped.push(birth);
                else if (gender) grouped.push(gender);
                continue;
            }
            // (10+11)
            if (id === 10 || id === 11) {
                const email = findAndRemove(10);
                const tel = findAndRemove(11);
                if (email && tel) grouped.push([email, tel]);
                else if (email) grouped.push(email);
                else if (tel) grouped.push(tel);
                continue;
            }
            // (13+14)
            if (id === 13 || id === 14) {
                const inquiry = findAndRemove(13);
                const file = findAndRemove(14);
                if (inquiry && file) grouped.push([inquiry, file]);
                else if (inquiry) grouped.push(inquiry);
                else if (file) grouped.push(file);
                continue;
            }
            
            const item = findAndRemove(id);
            if (item) grouped.push(item);
        }

        return grouped;
    }, [formData.selectedItems]);
    
    const handleMoveItem = useCallback((listKey: 'selectedItems' | 'abTestItemOrderB', oldIndex: number, newIndex: number) => {
        setFormData(prev => {
            const list = prev[listKey];
            if (newIndex < 0 || newIndex >= list.length) {
                return prev;
            }
            return {
                ...prev,
                [listKey]: arrayMove(list, oldIndex, newIndex),
            };
        });
    }, []);

    const validateAndProceed = (nextStep: Step, validationLogic: () => boolean) => {
        if (validationLogic()) {
            setStep(nextStep);
        }
    };

    const handleNext = () => {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        switch (step) {
            case Step.Q1_1:
                if (!formData.title.trim()) newErrors.title = 'フォームタイトルを入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                setStep(Step.Q1_2);
                break;
            case Step.Q1_2:
                if (formData.useAnalytics) {
                    if (!formData.gtmId.trim().match(/^GTM-[A-Z0-9]{7,}$/)) newErrors.gtmId = '正しいGTMコンテナIDを入力してください (例: GTM-XXXXXXX)。';
                    if (!formData.ga4Id.trim().match(/^G-[A-Z0-9]{10,}$/)) newErrors.ga4Id = '正しいGA4測定IDを入力してください (例: G-XXXXXXXXXX)。';
                }
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                setStep(Step.Q1_3);
                break;
            case Step.Q1_3:
                if (formData.selectedItems.length === 0) newErrors.selectedItems = 'フォームに入れる項目を1つ以上選択してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                
                const hasItem = (id: number) => formData.selectedItems.some(i => i.id === id);
                if (hasItem(15)) setStep(Step.Q1_4);
                else if (hasItem(16)) setStep(Step.Q1_5);
                else if (hasItem(17)) setStep(Step.Q1_6);
                else if (hasItem(18)) setStep(Step.Q1_7);
                else setStep(Step.Q1_8);
                break;
            case Step.Q1_4:
                if (!formData.otherItems.trim()) newErrors.otherItems = 'その他の項目を入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                const hasItemAfterOther = (ids: number[]) => formData.selectedItems.some(i => ids.includes(i.id));
                if (hasItemAfterOther([16])) setStep(Step.Q1_5);
                else if (hasItemAfterOther([17])) setStep(Step.Q1_6);
                else if (hasItemAfterOther([18])) setStep(Step.Q1_7);
                else setStep(Step.Q1_8);
                break;
            case Step.Q1_5:
                if (!formData.radioItems.title.trim()) newErrors.radioItems = 'タイトルを入力してください。';
                if (!formData.radioItems.options.trim()) newErrors.radioItems = (newErrors.radioItems || '') + '選択肢を1つ以上入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                const hasItemAfterRadio = (ids: number[]) => formData.selectedItems.some(i => ids.includes(i.id));
                if (hasItemAfterRadio([17])) setStep(Step.Q1_6);
                else if (hasItemAfterRadio([18])) setStep(Step.Q1_7);
                else setStep(Step.Q1_8);
                break;
            case Step.Q1_6:
                if (!formData.checkboxItems.title.trim()) newErrors.checkboxItems = 'タイトルを入力してください。';
                if (!formData.checkboxItems.options.trim()) newErrors.checkboxItems = (newErrors.checkboxItems || '') + '選択肢を1つ以上入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                if (formData.selectedItems.some(i => i.id === 18)) setStep(Step.Q1_7);
                else setStep(Step.Q1_8);
                break;
            case Step.Q1_7:
                if (!formData.pulldownItems.title.trim()) newErrors.pulldownItems = 'タイトルを入力してください。';
                if (!formData.pulldownItems.options.trim()) newErrors.pulldownItems = (newErrors.pulldownItems || '') + '選択肢を1つ以上入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                setStep(Step.Q1_8);
                break;
            case Step.Q1_8:
                setStep(Step.Q2_1);
                break;
            case Step.Q2_1:
                setStep(Step.Q2_2);
                break;
            case Step.Q2_2:
                setStep(Step.Q2_3);
                break;
            case Step.Q2_3:
                setStep(Step.Q2_4);
                break;
            case Step.Q2_4:
                if (!formData.privacyPolicyUrl.trim().match(/^https?:\/\//)) newErrors.privacyPolicyUrl = '有効なURLを入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                setStep(Step.Q2_5);
                break;
            case Step.Q2_5:
                setStep(Step.Q2_6);
                break;
            case Step.Q2_6:
                setStep(Step.Q2_7);
                break;
            case Step.Q2_7:
                setStep(Step.Q2_8);
                break;
            case Step.Q2_8:
                setStep(Step.Q2_9);
                break;
            case Step.Q2_9:
                if (formData.useAbTest) setStep(Step.Q3_0);
                else setStep(Step.Summary);
                break;
            case Step.Q3_0:
                if (!formData.formA_url.trim().match(/^https?:\/\//) && !formData.formA_url.trim().startsWith('/')) newErrors.formA_url = '有効なURLまたは相対パスを入力してください。';
                if (!formData.formB_url.trim().match(/^https?:\/\//) && !formData.formB_url.trim().startsWith('/')) newErrors.formB_url = '有効なURLまたは相対パスを入力してください。';
                if (Object.keys(newErrors).length > 0) return setErrors(newErrors);
                setStep(Step.PatternB_1);
                break;
            case Step.PatternB_1:
                 setStep(Step.PatternB_2);
                break;
             case Step.PatternB_2:
                setStep(Step.Summary);
                break;
            case Step.Summary:
                handleGenerate();
                break;
        }
    };
    
    const handlePrev = () => {
        switch (step) {
            case Step.Q1_2: setStep(Step.Q1_1); break;
            case Step.Q1_3: setStep(Step.Q1_2); break;
            case Step.Q1_4: case Step.Q1_5: case Step.Q1_6: case Step.Q1_7: case Step.Q1_8:
                const hasItem = (id: number) => formData.selectedItems.some(i => i.id === id);
                if (step === Step.Q1_8) {
                    if (hasItem(18)) setStep(Step.Q1_7);
                    else if (hasItem(17)) setStep(Step.Q1_6);
                    else if (hasItem(16)) setStep(Step.Q1_5);
                    else if (hasItem(15)) setStep(Step.Q1_4);
                    else setStep(Step.Q1_3);
                } else if (step === Step.Q1_7) {
                     if (hasItem(16)) setStep(Step.Q1_5);
                     else if (hasItem(15)) setStep(Step.Q1_4);
                     else setStep(Step.Q1_3);
                } else if (step === Step.Q1_6) {
                    if (hasItem(15)) setStep(Step.Q1_4);
                    else setStep(Step.Q1_3);
                } else if (step === Step.Q1_5) {
                    if (hasItem(15)) setStep(Step.Q1_4);
                    else setStep(Step.Q1_3);
                }
                else { setStep(Step.Q1_3); }
                break;
            case Step.Q2_1: setStep(Step.Q1_8); break;
            case Step.Q2_2: setStep(Step.Q2_1); break;
            case Step.Q2_3: setStep(Step.Q2_2); break;
            case Step.Q2_4: setStep(Step.Q2_3); break;
            case Step.Q2_5: setStep(Step.Q2_4); break;
            case Step.Q2_6: setStep(Step.Q2_5); break;
            case Step.Q2_7: setStep(Step.Q2_6); break;
            case Step.Q2_8: setStep(Step.Q2_7); break;
            case Step.Q2_9: setStep(Step.Q2_8); break;
            case Step.Q3_0: setStep(Step.Q2_9); break;
            case Step.PatternB_1: setStep(Step.Q3_0); break;
            case Step.PatternB_2: setStep(Step.PatternB_1); break;
            case Step.Summary: 
                if (formData.useAbTest) setStep(Step.PatternB_2);
                else setStep(Step.Q2_9);
                break;
        }
    };

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
        
        const cfg = {
            title: finalData.title,
            subtitle: finalData.subtitle,
            analytics: {
                gtm_id: finalData.useAnalytics ? finalData.gtmId : "",
                ga4_id: finalData.useAnalytics ? finalData.ga4Id : "",
            },
            operator: {
                default_icon: "https://shungene.lm-c.jp/ef/opr.jpg",
                step_icons: { ...finalData.bubbleTexts }
            },
            options: {
                submit_label: finalData.submitButtonText || '送信',
                privacy_policy_url: finalData.privacyPolicyUrl,
                newsletter: {
                    enabled: finalData.useNewsletter,
                    label: finalData.newsletterText || 'ニュースレター/最新情報を受け取る'
                },
                recaptcha_site_key: finalData.recaptchaSiteKey,
                gas_endpoint_url: finalData.gasUrl,
            },
            thanks_url_patterns_input: finalData.conversionUrl,
            fields: [] as any[]
        };

        const optionalIds = new Set(finalData.optionalItems.map(i => i.id));
        const itemOrderMap = new Map(itemOrder.map((item, index) => [item.id, index]));
        
        itemOrder.forEach(item => {
            const isRequired = !optionalIds.has(item.id);
            switch(item.id) {
                case 1: cfg.fields.push({ id: 'name_full1', type: 'name_full1', label: item.name, required: isRequired }); break;
                case 2: cfg.fields.push({ id: 'kana_full1', type: 'kana_full1', label: item.name, required: isRequired }); break;
                case 3: cfg.fields.push({ id: 'industry', type: 'text', label: item.name, required: isRequired }); break;
                case 4: cfg.fields.push({ id: 'company_name', type: 'text', label: item.name, required: isRequired }); break;
                case 5: cfg.fields.push({ id: 'department', type: 'text', label: item.name, required: isRequired }); break;
                case 6: cfg.fields.push({ id: 'position', type: 'text', label: item.name, required: isRequired }); break;
                case 7: cfg.fields.push({ id: 'address', type: 'address', label: item.name, required: isRequired }); break;
                case 8: cfg.fields.push({ id: 'birth', type: 'birth', label: item.name, required: isRequired }); break;
                case 9: cfg.fields.push({ id: 'gender', type: 'gender', label: item.name, required: isRequired }); break;
                case 10: cfg.fields.push({ id: 'email', type: 'email', label: item.name, required: isRequired }); break;
                case 11: cfg.fields.push({ id: 'tel', type: 'tel', label: item.name, required: isRequired }); break;
                case 12: cfg.fields.push({ id: 'website', type: 'url', label: item.name, required: isRequired }); break;
                case 13: cfg.fields.push({ id: 'inquiry', type: 'textarea', label: item.name, required: isRequired }); break;
                case 14: cfg.fields.push({ id: 'file_upload', type: 'file', label: item.name, required: isRequired }); break;
                case 15:
                    finalData.otherItems.split(/[\n,、]+/).forEach((other, i) => {
                        if(other.trim()) cfg.fields.push({ id: `other_${i}`, type: 'text', label: other.trim(), required: isRequired });
                    });
                    break;
                case 16:
                    cfg.fields.push({ id: 'custom_radio', type: 'radio', label: finalData.radioItems.title, choices: finalData.radioItems.options.split(/[\n,、]+/).map(s => s.trim()), required: isRequired });
                    break;
                case 17:
                    cfg.fields.push({ id: 'custom_checkbox', type: 'checkbox', label: finalData.checkboxItems.title, choices: finalData.checkboxItems.options.split(/[\n,、]+/).map(s => s.trim()), required: isRequired });
                    break;
                case 18:
                    cfg.fields.push({ id: 'custom_select', type: 'select', label: finalData.pulldownItems.title, choices: finalData.pulldownItems.options.split(/[\n,、]+/).map(s => s.trim()), required: isRequired });
                    break;
            }
        });

        cfg.fields.sort((a, b) => {
            const aId = FORM_ITEMS.find(i => i.name === a.label)?.id || -1;
            const bId = FORM_ITEMS.find(i => i.name === b.label)?.id || -1;
            const aOrder = itemOrderMap.get(aId) ?? Infinity;
            const bOrder = itemOrderMap.get(bId) ?? Infinity;
            return aOrder - bOrder;
        });

        return cfg;
    };
    
    const handleGenerate = () => {
        const generateFinalHtml = (cfg: any) => {
            let html = HTML_TEMPLATE;
            const cfgString = JSON.stringify(cfg, null, 2);
            html = html.replace('<script>\n// Will be replaced by the generator\n</script>', `<script>window.CFG = ${cfgString};</script>`);
            html = html.replace(/{{FORM_TITLE}}/g, cfg.title);
            html = html.replace(/{{FORM_SUBTITLE}}/g, cfg.subtitle);
            return html;
        };

        const cfgA = generateWindowCfg(formData, 'A');
        const htmlA = generateFinalHtml(cfgA);

        if (formData.useAbTest) {
            const cfgB = generateWindowCfg(formData, 'B');
            const htmlB = generateFinalHtml(cfgB);
            const routerHtml = ROUTER_HTML_TEMPLATE
                .replace('{{FORM_A_URL}}', formData.formA_url)
                .replace('{{FORM_B_URL}}', formData.formB_url);
            setGeneratedOutput({ a: htmlA, b: htmlB, router: routerHtml });
        } else {
            setGeneratedOutput({ a: htmlA });
        }
        setStep(Step.Output);
    };
    
    const handleCopy = () => {
        if (!generatedOutput) return;
        const content = activeTab === 'a' ? generatedOutput.a : activeTab === 'b' ? generatedOutput.b : generatedOutput.router;
        if (content) {
            navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    const renderStep = () => {
        switch (step) {
            case Step.Q1_1: return <>
                <Title>Q1.1 フォームのタイトル文</Title>
                <Description>{`以下を改行区切りで入力してください。\n1行目：フォームタイトル（例：かんたんお問い合わせ）\n2行目：サブタイトル（例：所要時間：約1分・入力途中でも保存されます）`}</Description>
                <div className="space-y-4">
                    <Input placeholder="フォームタイトル" value={formData.title} onChange={e => handleChange('title', e.target.value)} />
                    <ErrorMessage message={errors.title} />
                    <Textarea placeholder="サブタイトル" value={formData.subtitle} onChange={e => handleChange('subtitle', e.target.value)} rows={3} />
                </div>
            </>;
            case Step.Q1_2: return <>
                <Title>Q1.2 GTMとGA4 ID</Title>
                <Description>{`データ解析をしますか？（はい／いいえ）\n解析する場合はGTMコンテナIDとGA4測定IDを入力して下さい。\n解析しない場合は「いいえ」と入力してください。`}</Description>
                <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                        <input type="radio" name="useAnalytics" checked={!formData.useAnalytics} onChange={() => handleChange('useAnalytics', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">いいえ</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="useAnalytics" checked={formData.useAnalytics} onChange={() => handleChange('useAnalytics', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">はい</span>
                    </label>
                </div>
                {formData.useAnalytics && <div className="space-y-4">
                    <Input placeholder="GTM-XXXXXXX" value={formData.gtmId} onChange={e => handleChange('gtmId', e.target.value)} />
                    <ErrorMessage message={errors.gtmId} />
                    <Input placeholder="G-XXXXXXXXXX" value={formData.ga4Id} onChange={e => handleChange('ga4Id', e.target.value)} />
                    <ErrorMessage message={errors.ga4Id} />
                </div>}
            </>;
            case Step.Q1_3: return <>
                <Title>Q1.3 フォームに入れる項目の選択</Title>
                <Description>{`フォームに入れたい項目を選択してください。\n右側の矢印ボタンで表示順を変更できます。`}</Description>
                 <ErrorMessage message={errors.selectedItems as string} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                        <h3 className="font-semibold mb-2">利用可能な項目</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto p-2 border rounded-lg">
                            {FORM_ITEMS.map(item => (
                                <label key={item.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                                    <input type="checkbox" checked={formData.selectedItems.some(i => i.id === item.id)} onChange={() => handleItemToggle(item)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                                    <span className="ml-3 text-sm text-gray-700">{item.name}</span>
                                </label>
                            ))}
                        </div>
                   </div>
                    <div>
                        <h3 className="font-semibold mb-2">選択した項目（順序変更可）</h3>
                         <div className="p-2 border rounded-lg min-h-[24rem]">
                            {formData.selectedItems.length > 0 ? (
                                <ReorderableList
                                    items={formData.selectedItems}
                                    onMove={(oldIndex, newIndex) => handleMoveItem('selectedItems', oldIndex, newIndex)}
                                />
                            ) : (
                                <div className="text-center text-gray-500 py-10">項目を選択してください</div>
                            )}
                        </div>
                    </div>
                </div>
            </>;
             case Step.Q1_4: return <>
                <Title>Q1.4 その他の項目</Title>
                <Description>{`その他の項目を入力してください。\n例：\n紹介コード`}</Description>
                <Textarea placeholder="紹介コード" value={formData.otherItems} onChange={e => handleChange('otherItems', e.target.value)} rows={4} />
                <ErrorMessage message={errors.otherItems} />
            </>;
            case Step.Q1_5: return <>
                <Title>Q1.5 ラジオボタンの項目</Title>
                <Description>{`ラジオボタンのタイトルと選択肢（上限なし）を入力してください。\n選択肢に "その他"を入れると、クリックで自由記述できるようになります。\n例：\nお問い合わせ種別\n見積もり、相談、資料請求`}</Description>
                 <div className="space-y-4">
                    <Input placeholder="タイトル" value={formData.radioItems.title} onChange={e => handleChange('radioItems', { ...formData.radioItems, title: e.target.value })} />
                    <Textarea placeholder="選択肢（改行区切り）" value={formData.radioItems.options} onChange={e => handleChange('radioItems', { ...formData.radioItems, options: e.target.value })} rows={4} />
                 </div>
                 <ErrorMessage message={errors.radioItems as string} />
            </>;
            case Step.Q1_6: return <>
                <Title>Q1.6 チェックボックスの項目</Title>
                <Description>{`チェックボックスのタイトルと選択肢（上限なし）を入力してください。\n選択肢に "その他"を入れると、クリックで自由記述できるようになります。\n例：\n興味・関心\nABテスト、データ解析`}</Description>
                 <div className="space-y-4">
                    <Input placeholder="タイトル" value={formData.checkboxItems.title} onChange={e => handleChange('checkboxItems', { ...formData.checkboxItems, title: e.target.value })} />
                    <Textarea placeholder="選択肢（改行区切り）" value={formData.checkboxItems.options} onChange={e => handleChange('checkboxItems', { ...formData.checkboxItems, options: e.target.value })} rows={4} />
                 </div>
                 <ErrorMessage message={errors.checkboxItems as string} />
            </>;
            case Step.Q1_7: return <>
                <Title>Q1.7 プルダウンの項目</Title>
                <Description>{`プルダウンのタイトルと選択肢（上限なし）を入力してください。\n例：\n検討度合い\nすぐにでも、1〜3ヶ月、未定`}</Description>
                 <div className="space-y-4">
                    <Input placeholder="タイトル" value={formData.pulldownItems.title} onChange={e => handleChange('pulldownItems', { ...formData.pulldownItems, title: e.target.value })} />
                    <Textarea placeholder="選択肢（改行区切り）" value={formData.pulldownItems.options} onChange={e => handleChange('pulldownItems', { ...formData.pulldownItems, options: e.target.value })} rows={4} />
                 </div>
                 <ErrorMessage message={errors.pulldownItems as string} />
            </>;
            case Step.Q1_8: return <>
                <Title>Q1.8 任意にする項目の指定</Title>
                <Description>{`任意にしたい項目があれば、選択してください（複数可／すべて必須なら選択なし）。`}</Description>
                <div className="space-y-2">
                    {formData.selectedItems.map(item => (
                        <label key={item.id} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer">
                            <input type="checkbox" checked={formData.optionalItems.some(i => i.id === item.id)} onChange={() => handleOptionalItemToggle(item)} className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                            <span className="ml-3 text-sm text-gray-700">{item.name}</span>
                        </label>
                    ))}
                </div>
            </>;
            case Step.Q2_1: return <>
                <Title>Q2.1 吹き出し用の画像</Title>
                <Description>{`吹き出し用の画像URL（128px×128px推奨）を入力してください。\nステップごとに画像を変えることもできます。`}</Description>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">全ステップ共通の画像</label>
                        <Input placeholder="https://.../avatar.jpg" value={formData.avatarImages.common} onChange={e => handleChange('avatarImages', {...formData.avatarImages, common: e.target.value})} />
                    </div>
                </div>
            </>;
            case Step.Q2_2: return <>
                <Title>Q2.2 吹き出し用のセリフ</Title>
                <Description>{`各ステップの吹き出し文を入力してください。\n同じグループの項目には同じセリフが適用されます。`}</Description>
                <div className="space-y-4">
                    {groupedItems.map((item, index) => {
                         const groupName = Array.isArray(item) ? item.map(i => i.name).join('・') : item.name;
                         return (
                            <div key={index}>
                                <label className="text-sm font-medium">{groupName}</label>
                                <Input placeholder={`「${groupName}」のセリフ`} value={formData.bubbleTexts[groupName] || ''} onChange={e => handleChange('bubbleTexts', {...formData.bubbleTexts, [groupName]: e.target.value})} />
                            </div>
                         )
                    })}
                     <div>
                        <label className="text-sm font-medium">確認画面</label>
                        <Input placeholder="確認画面のセリフ" value={formData.bubbleTexts['確認画面'] || ''} onChange={e => handleChange('bubbleTexts', {...formData.bubbleTexts, '確認画面': e.target.value})} />
                    </div>
                </div>
            </>;
            case Step.Q2_3: return <>
                <Title>Q2.3 送信ボタンの文言</Title>
                <Description>{`送信ボタン内の文言を変更しますか？\nデフォルトは「送信」です。`}</Description>
                <Input placeholder="送信" value={formData.submitButtonText} onChange={e => handleChange('submitButtonText', e.target.value)} />
            </>;
            case Step.Q2_4: return <>
                <Title>Q2.4 個人情報の取り扱いリンク</Title>
                <Description>{`同意チェックの『個人情報の取り扱い』のリンクURLを入力してください。`}</Description>
                <Input type="url" placeholder="https://example.com/privacy" value={formData.privacyPolicyUrl} onChange={e => handleChange('privacyPolicyUrl', e.target.value)} />
                <ErrorMessage message={errors.privacyPolicyUrl} />
            </>;
            case Step.Q2_5: return <>
                <Title>Q2.5 ニュースレターのチェックボックス</Title>
                <Description>{`送信ボタンの上に、ニュースレター等の購読許可チェックボックスは必要ですか？`}</Description>
                <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                        <input type="radio" name="useNewsletter" checked={!formData.useNewsletter} onChange={() => handleChange('useNewsletter', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">いいえ</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="useNewsletter" checked={formData.useNewsletter} onChange={() => handleChange('useNewsletter', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">はい</span>
                    </label>
                </div>
                {formData.useNewsletter && <Input placeholder="ニュースレター/最新情報を受け取る" value={formData.newsletterText} onChange={e => handleChange('newsletterText', e.target.value)} />}
            </>;
            case Step.Q2_6: return <>
                <Title>Q2.6 reCAPTCHA v3 サイトキー（任意）</Title>
                <Description>{`reCAPTCHA v3 を使用する場合はサイトキーを入力してください。不要なら空欄にしてください。`}</Description>
                <Input placeholder="サイトキー" value={formData.recaptchaSiteKey} onChange={e => handleChange('recaptchaSiteKey', e.target.value)} />
            </>;
            case Step.Q2_7: return <>
                <Title>Q2.7 GASのWebアプリURL</Title>
                <Description>{`GAS（Google Apps Script）のWebアプリURLを入力してください。設定しない場合は空欄のままで構いません。`}</Description>
                <Input type="url" placeholder="https://script.google.com/macros/s/.../exec" value={formData.gasUrl} onChange={e => handleChange('gasUrl', e.target.value)} />
            </>;
             case Step.Q2_8: return <>
                <Title>Q2.8 コンバージョン地点（サンクスページ）のURL</Title>
                <Description>{`コンバージョン地点（サンクスページ）のURLまたはその一部を入力してください。正規表現も可。\n例：\nhttps://example.com/thanks`}</Description>
                <Textarea placeholder="thanks, complete" value={formData.conversionUrl} onChange={e => handleChange('conversionUrl', e.target.value)} rows={3}/>
            </>;
            case Step.Q2_9: return <>
                <Title>Q2.9 フォームのABテスト</Title>
                <Description>{`フォームのABテストを行いますか？`}</Description>
                 <div className="flex items-center space-x-4 mb-4">
                    <label className="flex items-center">
                        <input type="radio" name="useAbTest" checked={!formData.useAbTest} onChange={() => handleChange('useAbTest', false)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">いいえ</span>
                    </label>
                    <label className="flex items-center">
                        <input type="radio" name="useAbTest" checked={formData.useAbTest} onChange={() => handleChange('useAbTest', true)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                        <span className="ml-2">はい</span>
                    </label>
                </div>
            </>;
             case Step.Q3_0: return <>
                <Title>Q3.0 フォームA/BのURL</Title>
                <Description>{`フォームのURLを2行で入力してください（上がA、下がB）。\n例：\nhttps://example.com/formA/\nhttps://example.com/formB/`}</Description>
                 <div className="space-y-4">
                    <Input placeholder="フォームAのURL" value={formData.formA_url} onChange={e => handleChange('formA_url', e.target.value)} />
                     <ErrorMessage message={errors.formA_url} />
                    <Input placeholder="フォームBのURL" value={formData.formB_url} onChange={e => handleChange('formB_url', e.target.value)} />
                     <ErrorMessage message={errors.formB_url} />
                </div>
            </>;
            case Step.PatternB_1: return <>
                <Title>パターンBでテストする項目</Title>
                <Description>テストする項目を1つ選んでください。</Description>
                <div className="space-y-2">
                    {AB_TEST_ITEMS.map(item => (
                        <label key={item} className="flex items-center p-3 rounded-lg border border-gray-200 has-[:checked]:bg-teal-50 has-[:checked]:border-teal-200">
                             <input type="radio" name="abTestItem" value={item} checked={formData.abTestItem === item} onChange={() => handleChange('abTestItem', item)} className="h-4 w-4 border-gray-300 text-teal-600 focus:ring-teal-500" />
                            <span className="ml-3">{item}</span>
                        </label>
                    ))}
                </div>
            </>;
            case Step.PatternB_2: return <>
                <Title>パターンBの設定</Title>
                <Description>パターンAとの変更点を入力してください。</Description>
                {formData.abTestItem === 'フォームタイトル' && <div>
                    <label className="text-sm font-medium">新しいフォームタイトル</label>
                    <Input value={formData.abTestTitleB} onChange={e => handleChange('abTestTitleB', e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">パターンA: {formData.title}</p>
                </div>}
                {formData.abTestItem === 'フォームサブタイトル' && <div>
                    <label className="text-sm font-medium">新しいサブタイトル</label>
                    <Textarea value={formData.abTestSubtitleB} onChange={e => handleChange('abTestSubtitleB', e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">パターンA: {formData.subtitle}</p>
                </div>}
                 {formData.abTestItem === '送信ボタンの文言' && <div>
                    <label className="text-sm font-medium">新しい送信ボタンの文言</label>
                    <Input value={formData.abTestSubmitButtonTextB} onChange={e => handleChange('abTestSubmitButtonTextB', e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">パターンA: {formData.submitButtonText || '送信'}</p>
                </div>}
                {formData.abTestItem === '質問の順番' && <div>
                    <label className="text-sm font-medium">新しい質問の順番</label>
                    <ReorderableList
                        items={formData.abTestItemOrderB}
                        onMove={(oldIndex, newIndex) => handleMoveItem('abTestItemOrderB', oldIndex, newIndex)}
                    />
                </div>}
            </>;
            case Step.Summary: return <>
                <Title>設定内容の確認</Title>
                <Description>設定内容を確認し、問題なければ「OK」ボタンを押してHTMLを生成してください。</Description>
                <div className="space-y-3 text-sm max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50">
                    <p><strong>フォームタイトル:</strong> {formData.title}</p>
                    <p><strong>サブタイトル:</strong> {formData.subtitle}</p>
                    <p><strong>選択項目:</strong> {formData.selectedItems.map(i => i.name).join(', ')}</p>
                    {formData.useAbTest && <p><strong>ABテスト:</strong> 有効（テスト項目: {formData.abTestItem}）</p>}
                </div>
            </>;
            default: return null;
        }
    };
    
    if (generatedOutput) {
        const currentContent = activeTab === 'a' ? generatedOutput.a : activeTab === 'b' ? generatedOutput.b : generatedOutput.router;
        return (
            <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
                <div className="max-w-4xl mx-auto">
                    <Title>生成されたHTMLコード</Title>
                    <Description>以下のコードをコピーして、HTMLファイルとして保存・公開してください。</Description>
                     {generatedOutput.b && (
                        <div className="mb-4 border-b border-gray-200">
                            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                                <button onClick={() => setActiveTab('a')} className={`${activeTab === 'a' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>パターンA HTML</button>
                                <button onClick={() => setActiveTab('b')} className={`${activeTab === 'b' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>パターンB HTML</button>
                                <button onClick={() => setActiveTab('router')} className={`${activeTab === 'router' ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>ルーター HTML</button>
                            </nav>
                        </div>
                    )}
                    <div className="relative">
                        <pre className="bg-gray-800 text-white p-4 rounded-lg text-xs overflow-auto max-h-[60vh]">
                            <code>{currentContent}</code>
                        </pre>
                        <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-md text-xs inline-flex items-center gap-1">
                             {copied ? <><CheckIcon />コピーしました</> : <><CopyIcon />コピー</>}
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-3xl">
                <Card>
                    {renderStep()}
                    <div className="mt-8 flex justify-between">
                        {step > Step.Q1_1 && step < Step.Summary && <Button variant="ghost" onClick={handlePrev}>戻る</Button>}
                        <div></div> {/* For spacing */}
                        {step < Step.Output && <Button onClick={handleNext}>
                            {step === Step.Summary ? 'OK, HTMLを生成' : '次へ'}
                        </Button>}
                    </div>
                </Card>
            </div>
        </div>
    );
}
