"use client";

import { useEffect, useState } from "react";
import { ApiError } from "./api";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

export function useAsyncResource<T>(fetcher: () => Promise<T>): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });

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
  }, []);

  return state;
}
