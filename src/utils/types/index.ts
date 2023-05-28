export interface IHtmlToImageOptions {
  url: string;
  screenshotSize: { width: number; height: number };
  imageType: 'jpeg' | 'png' | 'webp';
}
