export {};

declare global {
  interface PuterAI {
    chat<T = unknown>(
      prompt: string,
      input?: File | Blob | string | null,
      options?: Record<string, unknown>,
    ): Promise<T>;
  }

  interface Window {
    puter?: {
      ai: PuterAI;
    };
  }
}
