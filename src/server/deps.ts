// -- preact --
export { renderToString } from "https://esm.sh/preact-render-to-string@5.1.20?deps=preact@10.x.x";

// -- std --
export {
  extname,
  fromFileUrl,
  toFileUrl,
} from "https://deno.land/std/path/mod.ts";
export { walk } from "https://deno.land/std/fs/walk.ts";
export { serve,serveTls } from "https://deno.land/std/http/server.ts";
export type {
  ConnInfo,
  Handler as RequestHandler,
} from "https://deno.land/std/http/server.ts";

// -- router --
export * as router from "./router.ts";

// -- media types --
export { lookup as mediaTypeLookup } from "https://deno.land/x/media_types@v2.12.3/mod.ts";

// -- esbuild --
// @deno-types="https://deno.land/x/esbuildx@v0.14.26/mod.d.ts"
import * as esbuildWasm from "./esbuild-wasm/browser.js";
import * as esbuildNative from "https://deno.land/x/esbuildx/mod.js";

// @ts-ignore trust me
const esbuild: typeof esbuildWasm = Deno.run === undefined
  ? esbuildWasm
  : esbuildNative;
export { esbuild, esbuildWasm as esbuildTypes };
export { denoPlugin } from "https://deno.land/x/esbuild_deno_loader/mod.ts";
