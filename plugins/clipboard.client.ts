// plugins/clipboard.client.ts
export default defineNuxtPlugin(() => {
    return {
      provide: {
        copyToClipboard: async (text: string): Promise<boolean> => {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch (err) {
            console.error('Failed to copy text: ', err);
            return false;
          }
        }
      }
    }
  })