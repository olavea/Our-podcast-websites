/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly TRANSISTOR_API_KEY: string;
  readonly TRANSISTOR_SHOW_ID: string;
  readonly SITE_TITLE: string;
  readonly SITE_DESCRIPTION: string;
  readonly SHOW_TITLE?: string;
  readonly SHOW_DESCRIPTION?: string;
  readonly URLBOX_PUB_KEY?: string;
  readonly URLBOX_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
