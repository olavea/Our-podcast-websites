/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TRANSISTOR_API_KEY: string;
  readonly TRANSISTOR_SHOW_ID: string;
  readonly SITE_TITLE: string;
  readonly SITE_DESCRIPTION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
