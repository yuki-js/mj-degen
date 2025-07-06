/**
 * Generic Suspense resource factory for data fetching.
 * Handles status, promise, result, and error for Suspense-ready hooks.
 */
type Status = "pending" | "success" | "error";

interface SuspenseResource<T> {
  status: Status;
  promise: Promise<T> | null;
  result: T | null;
  error: Error | null;
}

export function createSuspenseResource<T>(fetcher: () => Promise<T>) {
  const resource: SuspenseResource<T> = {
    status: "pending",
    promise: null,
    result: null,
    error: null,
  };

  function load(): Promise<T> {
    if (resource.status === "pending" && !resource.promise) {
      resource.promise = fetcher()
        .then((data) => {
          resource.status = "success";
          resource.result = data;
          return data;
        })
        .catch((err) => {
          resource.status = "error";
          resource.error = err;
          throw err;
        });
    }
    return resource.promise!;
  }

  function read(): T {
    if (resource.status === "pending") {
      throw load();
    } else if (resource.status === "error") {
      throw resource.error!;
    } else if (resource.status === "success") {
      return resource.result!;
    }
    throw new Error("Unexpected state in SuspenseResource");
  }

  return {
    read,
    load,
    get status() {
      return resource.status;
    },
  };
}
