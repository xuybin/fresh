/** @jsx h */

import { h, PageConfig, PageProps } from "../../client_deps.ts";

export default function Page(props: PageProps) {
  return <div>Book {props.params.id}</div>;
}

export const config: PageConfig = {
  routeOverride: "/books/:id(\\d+)",
};
