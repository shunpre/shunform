export interface FormItem {
  id: number;
  name: string;
}

export interface FormData {
  // Q1
  title: string;
  subtitle: string;
  useAnalytics: boolean;
  gtmId: string;
  ga4Id: string;
  selectedItems: FormItem[];
  customItem: { title: string; label: string };
  radioItems: { title: string; options: string };
  checkboxItems: { title: string; options: string };
  pulldownItems: { title: string; options: string };
  optionalItems: FormItem[];

  // Q2
  avatarImages: { common: string; specific: { itemName: string; url: string }[] };
  bubbleTexts: { [key: string]: string };
  submitButtonText: string;
  privacyPolicyUrl: string;
  useNewsletter: boolean;
  newsletterText: string;
  useRecaptcha: boolean;
  recaptchaSiteKey: string;
  gasUrl: string;
  conversionUrl: string;
  useAbTest: boolean;

  // Q3
  formA_url: string;
  formB_url: string;

  // Pattern B
  abTestItem: string;
  abTestTitleB: string;
  abTestSubtitleB: string;
  abTestSubmitButtonTextB: string;
  abTestItemOrderB: FormItem[];
}

export type GroupedItem = FormItem | FormItem[];