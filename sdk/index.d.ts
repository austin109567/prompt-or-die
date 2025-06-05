export interface PromptBlock {
  id: string;
  type: 'intent' | 'tone' | 'format' | 'context' | 'persona';
  label: string;
  value: string;
}

export declare function buildPrompt(blocks: PromptBlock[]): string;
export declare function injectPrompt(base: string, injection: string, mode?: 'prepend' | 'append' | 'replace'): string;
export { buildPrompt as build };
