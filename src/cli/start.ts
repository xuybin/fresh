// deno-lint-ignore-file
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
/// <reference types="../../types.d.ts" />

import { Manifest, ServerContext,serveTls,serve } from "../server/mod.ts";
import { error } from "./error.ts";
import { parseArgs,resolve, toFileUrl } from "./deps.ts";

const help = `fresh start

Start from route file.

To start local route file:
  COMMAND ./fresh.gen.ts

To start remote route file:
  COMMAND https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/fresh.gen.ts

USAGE:
    COMMAND [OPTIONS] <ROUTE>

OPTIONS:
    -h, --help                 Prints help information
    -p, --port                 serve port
    -s,--static                serve static directory
    -c,--certFile              serveTls certFile
    -k,--keyFile               serveTls keyFile
    -i,--info                  Prints this command info   
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
  const manifest = ((await import(importUrl)) as any).default as Manifest;
  // command line variable override
  console.log('manifest.static:'+manifest.static)
  console.log('rawArgs.static:'+rawArgs.static)
  if(rawArgs.static){
    if(manifest.static){
      error("given routes file already contains static files.");
    }
    manifest.static = {'_':toFileUrl(resolve(Deno.cwd(), rawArgs.static)).href};
    console.log('manifest.static:'+manifest.static)
  }
  const ctx = await ServerContext.fromManifest(manifest);
  console.log("Server listening on http://localhost:8000");
  if(rawArgs.certFile && rawArgs.keyFile){
    serveTls(ctx.handler(), {
      port: rawArgs.port,
      certFile: rawArgs.certFile,
      keyFile: rawArgs.keyFile,
    });
  }else{
    await serve(ctx.handler(), {
      port: rawArgs.port,
    });
  }
}

if (import.meta.main) {
  const args = parseArgs(Deno.args, {
    alias: {
      "help": "h",
      "info": "i",
      "port":"p",
      "static":["s","public"],
      "certFile":["c","cert"],
      "keyFile":["k","key"],
    },
    boolean: [
      "help",
      "info",
    ],
    string:["port","static","certFile","keyFile"],
    default:{
      "port":8000
    },
  });
  if (args.info) {
    console.log(`${import.meta.url}`);
    Deno.exit(0);
  }else{
    await startSubcommand(args);
  }
}