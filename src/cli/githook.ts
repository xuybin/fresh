import { join, resolve } from "./deps.ts";
const PRE_PUSH = `#!/bin/sh

remote="$1"
url="$2"
hasEditRoutes=""
for sha in $(git rev-list origin..HEAD)
do
	hasEditRoutes=$(git show $sha |grep -E "diff --git .*(a|b)/(routes|islands)/")
	if [[ "$hasEditRoutes" != "" ]]
	then
		break
	fi
done

if [[ "$hasEditRoutes" != "" ]]
then
  echo >&2 "Changes in the "routes" and "islands" directories will be push."
  hasNotCommitRoutes=$(git status | grep -E "[^/]+(routes|islands)")
	if [[ "$hasNotCommitRoutes" != "" ]]
	then
	  echo >&2 "Uncommitted changes exist in 'routes' and 'islands' directories."
	  exit 1
  else
    changeRoutesGen=$((deno task gen && git status fresh.gen.ts) | grep fresh.gen.ts)
    if [[ "$changeRoutesGen" != "" ]]
		then
			echo >&2 "Regenerate 'fresh.gen.ts' and commit."
		  git add fresh.gen.ts && git commit -m "automatic update routes"
    	exit 0
    fi
	fi
else
	exit 0  
fi
`;

const directory = resolve("./.git/hooks");
await Deno.mkdir(directory, { recursive: true });
await Deno.writeTextFile(
  join(directory, "pre-push"),
  PRE_PUSH,
);
