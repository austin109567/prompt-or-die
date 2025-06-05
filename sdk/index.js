// Prompt or Die SDK
// Helper functions for building and injecting prompt text

/**
 * @typedef {Object} PromptBlock
 * @property {string} id
 * @property {"intent"|"tone"|"format"|"context"|"persona"} type
 * @property {string} label
 * @property {string} value
 */

/** Build a prompt string from ordered blocks */
export function buildPrompt(blocks) {
  return blocks
    .map(b => `## ${b.type.toUpperCase()}: ${b.label}\n${b.value}`)
    .join('\n\n');
}

/** Inject additional text into an existing prompt */
export function injectPrompt(base, injection, mode = 'append') {
  if (mode === 'prepend') return `${injection}\n${base}`;
  if (mode === 'replace') return injection;
  return `${base}\n${injection}`;
}

export { buildPrompt as build };
