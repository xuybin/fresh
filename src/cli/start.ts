/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
/// <reference types="../../types.d.ts" />

import { Manifest, start } from "../server/mod.ts";
import { error } from "./error.ts";
import { resolve, toFileUrl } from "https://deno.land/std/path/mod.ts";
import { parseArgs } from "./deps.ts";

const help = `fresh start

Start from route file.

To start local route file:
  fresh start ./fresh.gen.ts

To start remote route file:
  fresh start https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/fresh.gen.ts

USAGE:
    fresh start <ROUTE>

OPTIONS:
    -h, --help                 Prints help information
`;
export interface Args {
  help: boolean;
}

export async function startSubcommand(rawArgs: Record<string, any>) {
  const args: Args = {
    help: !!rawArgs.help,
  };
  const directory: string | null = typeof rawArgs._[0] === "string"
    ? rawArgs._[0]
    : null;
  if (args.help) {
    console.log(help);
    Deno.exit(0);
  }
  if (directory === null) {
    //console.error(help);
    error("No route file given.");
  }
  let importUrl = directory;
  if (!directory.toLowerCase().startsWith("http")) {
    try {
      importUrl = resolve(Deno.cwd(), directory);
      //console.log(importUrl)
      const fileInfo = await Deno.stat(importUrl);
      if (!fileInfo.isFile) {
        error("given route file not isFile.");
      }
      importUrl = toFileUrl(importUrl).href;
      //console.log(importUrl)
    } catch (err) {
      error("given route file not isFile.");
    }
  }
  const manifest = await import(importUrl);
  //console.error(JSON.stringify(manifest.default));
  await start(manifest.default as Manifest);
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "help": "h",
      "version": "V",
    },
    boolean: [
      "help",
      "version",
    ],
  });
  if (args.version) {
    console.log(`${import.meta.url}`);
    Deno.exit(0);
  }else{
    await startSubcommand(args);
  }
}