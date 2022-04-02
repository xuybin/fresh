> :warning: DO NOT USE. WHILE CERTAIN FEATURES MIGHT BE WORKING, MANY THINGS ARE
> STILL SUBJECT TO CHANGE AT ANY TIME.

# fresh

The next-gen web framework.

Fresh is a web framework that lets you build projects very fast, highly dynamic,
and without the need of a build step. Fresh embraces isomorphic JavaScript like
never before. Write a JSX component, have it render on the edge just-in-time,
and then enhance it with client side JS for great interactivity.

Fresh does not have a build step - you write your code, deploy it to
[Deno Deploy](https://deno.com/deploy), and from there everything is handled by
the framework.

- No build step
- Zero config necessary
- JIT rendering on the edge
- Tiny (example is 0-3KB of runtime JS)<sup>1</sup>
- Optional client side hydration
- TypeScript out of the box
- File-system routing à la Next.js

## Install

To install, run the following command. This will add `fresh` CLI to your PATH.
Make sure to have Deno 1.12.0 or later installed.

```sh
deno install -A -f --no-check -n fresh -r https://deno.land/x/xuybin_fresh/cli.ts
```

## Getting started

The `fresh` CLI can scaffold a new project for you. To scaffold a project in the
`myproject` folder, run the following:

```sh
fresh init my-project
```

To now start the project, call `deno run`:

```
deno run -A --watch main.ts
```

To deploy the script to [Deno Deploy](https://deno.com/deploy), push your
project to GitHub, create a `fresh` project, and link it to `main.ts` file in
the created repository.

For a more in-depth getting started guide, visit the
[Getting Started](./docs/getting-started.md) page in the `fresh` docs.


X [ERROR] Top-level await is not available in the configured target environment ("chrome96", "firefox95", "safari14")

    deno:https://deno.land/std@0.125.0/node/_util/_debuglog.ts:108:11:
      108 │   state = (await Deno.permissions.query({
          ╵            ~~~~~

X [ERROR] [plugin deno] The module was missing and could not be loaded.

    deno:https://deno.land/std@0.125.0/node/_events.js:153:30:
      153 │       isEventTarget = require("internal/event_target").isEventTarget;
An error occured during route handling or page rendering. Error: Build failed with 2 errors:
deno:https://deno.land/std@0.125.0/node/_events.js:153:30: ERROR: [plugin: deno] The module was missing and could not be loaded.
deno:https://deno.land/std@0.125.0/node/_util/_debuglog.ts:108:11: ERROR: Top-level await is not available in the configured target environment ("chrome96", "firefox95", "safari14")       
    at failureErrorWithLog (https://deno.land/x/esbuildx@v0.14.26/mod.js:1568:15)
    at https://deno.land/x/esbuildx@v0.14.26/mod.js:1214:28
    at runOnEndCallbacks (https://deno.land/x/esbuildx@v0.14.26/mod.js:997:63)
    at https://deno.land/x/esbuildx@v0.14.26/mod.js:1321:14
    at https://deno.land/x/esbuildx@v0.14.26/mod.js:629:9
    at handleIncomingPacket (https://deno.land/x/esbuildx@v0.14.26/mod.js:726:9)
    at readFromStdout (https://deno.land/x/esbuildx@v0.14.26/mod.js:596:7)
    at https://deno.land/x/esbuildx@v0.14.26/mod.js:1841:11