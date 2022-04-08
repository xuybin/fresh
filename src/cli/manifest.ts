import { extname, join, resolve, toFileUrl, walk } from "./deps.ts";
import { error } from "./error.ts";

const help = `fresh manifest

Regenerate the fresh.gen.ts manifest for your fresh project.

To regenerate the mapping in the current directory:
  fresh manifest

To regenerate the mapping in the './foobar' subdirectory:
  fresh manifest ./foobar

USAGE:
    fresh manifest [OPTIONS] [DIRECTORY]

OPTIONS:
    -h, --help                 Prints help information
`;

export interface Args {
  help: boolean;
}

// deno-lint-ignore no-explicit-any
export async function manifestSubcommand(rawArgs: Record<string, any>) {
  const args: Args = {
    help: !!rawArgs.help,
  };
  const directory: string | null = typeof rawArgs._[0] === "string"
    ? rawArgs._[0]
    : Deno.cwd();
  if (args.help) {
    console.log(help);
    Deno.exit(0);
  }
  await manifest(directory);
}

export async function manifest(directory: string) {
  directory = resolve(directory);
  const routes = [];
  try {
    const routesDir = join(directory, "./routes");
    const routesUrl = toFileUrl(routesDir);
    // TODO(lucacasonato): remove the extranious Deno.readDir when
    // https://github.com/denoland/deno_std/issues/1310 is fixed.
    for await (const _ of Deno.readDir(routesDir)) {
      // do nothing
    }
    const routesFolder = walk(routesDir, {
      includeDirs: false,
      includeFiles: true,
      exts: ["tsx", "jsx", "ts", "js"],
    });
    for await (const entry of routesFolder) {
      if (entry.isFile) {
        const file = toFileUrl(entry.path).href.substring(
          routesUrl.href.length,
        );
        routes.push(file);
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  routes.sort();

  const islands = [];
  try {
    const islandsDir = join(directory, "./islands");
    const islandsUrl = toFileUrl(islandsDir);
    for await (const entry of Deno.readDir(islandsDir)) {
      if (entry.isDirectory) {
        error(
          `Found subdirectory '${entry.name}' in islands/. The islands/ folder must not contain any subdirectories.`,
        );
      }
      if (entry.isFile) {
        const ext = extname(entry.name);
        if (![".tsx", ".jsx", ".ts", ".js"].includes(ext)) continue;
        const path = join(islandsDir, entry.name);
        const file = toFileUrl(path).href.substring(islandsUrl.href.length);
        islands.push(file);
      }
    }
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      // Do nothing.
    } else {
      throw err;
    }
  }
  islands.sort();

  const output = `/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />
// DO NOT EDIT. This file is generated by \`fresh\`.
// This file SHOULD be checked into source version control.
// To update this file, run \`fresh manifest\`.

${
    routes.map((file, i) => `import * as $${i} from "./routes${file}";`).join(
      "\n",
    )
  }
${
    islands.map((file, i) => `import * as $$${i} from "./islands${file}";`)
      .join("\n")
  }

const manifest = {
  routes: {
    ${
    routes.map((file, i) => `${JSON.stringify(`./routes${file}`)}: $${i},`)
      .join("\n    ")
  }
  },
  islands: {
    ${
    islands.map((file, i) => `${JSON.stringify(`./islands${file}`)}: $$${i},`)
      .join("\n    ")
  }
  },
  baseUrl: import.meta.url,
};

export default manifest;
`;

  const manifestPath = join(directory, "./fresh.gen.ts");
  await Deno.writeTextFile(manifestPath, output);
  const proc = Deno.run({
    cmd: [Deno.execPath(), "fmt", manifestPath],
    stdin: "null",
    stdout: "null",
    stderr: "null",
  });
  await proc.status();
  proc.close();

  console.log(
    `%cThe manifest has been generated for ${routes.length} routes and ${islands.length} islands.`,
    "color: blue; font-weight: bold",
  );
}
