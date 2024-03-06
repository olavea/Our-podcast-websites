/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TRANSISTOR_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
