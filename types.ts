
export enum Step {
  Q1_1, Q1_2, Q1_3, Q1_4, Q1_5, Q1_6, Q1_7, Q1_8,
  Q2_1, Q2_2, Q2_3, Q2_4, Q2_5, Q2_6, Q2_7, Q2_8, Q2_9,
  Q3_0,
  PatternB_1, PatternB_2,
  Summary,
  Output,
}

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
  otherItems: string;
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
