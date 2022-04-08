/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import * as $0 from "./routes/api/joke.ts";
import * as $1 from "./routes/index.tsx";
import * as $$0 from "./islands/Counter.tsx";
import * as $5 from "https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/routes/index.tsx";
import * as $$1 from 'https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/islands/Counter.tsx';
import { start } from "./server_deps.ts";
const manifest = {
  routes: {
    "./routes/api/joke.ts": $0,
    "./routes/index.tsx": $1,
    "./routes/bin.tsx": {
      url:'https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/routes/index.tsx',
      module:$5
    },
  },
  islands: {
    "./islands/Counter.tsx": $$0,
    "./islands/Counter1.tsx": {
      url:'https://raw.githubusercontents.com/xuybin/fresh/main/examples/counter/islands/Counter.tsx',
      module:$$1
    },
  },
  baseUrl: import.meta.url,
};

export default manifest;

if (import.meta.main) {
  await start(manifest);
}