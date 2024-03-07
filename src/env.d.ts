/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TRANSISTOR_API_KEY: string;
  readonly TRANSISTOR_SHOW_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
