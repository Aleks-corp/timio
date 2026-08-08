"use client";

import { useEffect, useState, type DependencyList } from "react";
import { ApiError } from "./api";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

function depsEqual(a: DependencyList, b: DependencyList): boolean {
  if (a.length !== b.length) return false;
  return a.every((value, i) => Object.is(value, b[i]));
}

export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const [fetchedDeps, setFetchedDeps] = useState<DependencyList>(deps);

  if (!depsEqual(deps, fetchedDeps)) {
    setFetchedDeps(deps);
    setState({ status: "loading" });
  }

  useEffect(() => {
    let ignore = false;

    fetcher()
      .then((data) => {
        if (!ignore) setState({ status: "success", data });
      })
      .catch((error) => {
        if (!ignore) {
          setState({
            status: "error",
            message:
              error instanceof ApiError
                ? error.message
                : "Couldn't load the data.",
          });
        }
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
