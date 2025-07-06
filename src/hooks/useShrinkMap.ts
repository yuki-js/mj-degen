import { ShrinkMapData, ShrinkMapItem } from '../types';

// This will hold the promise and the result/error for Suspense
let shrinkMapResource: {
  status: 'pending' | 'success' | 'error';
  promise: Promise<ShrinkMapData> | null;
  result: ShrinkMapData | null;
  error: Error | null;
  processedResult: Map<string, ShrinkMapItem> | null;
} = {
  status: 'pending',
  promise: null,
  result: null,
  error: null,
};

const fetchShrinkMap = () => {
  if (shrinkMapResource.status === 'pending' && !shrinkMapResource.promise) {
    shrinkMapResource.promise = fetch('/shrinkmap.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        shrinkMapResource.status = 'success';
        shrinkMapResource.result = data;
        const shrinkMap = new Map<string, ShrinkMapItem>();
        data.content.forEach((item: ShrinkMapItem) => {
          shrinkMap.set(item.MJ文字図形名, item);
        });
        shrinkMapResource.processedResult = shrinkMap;
        return data;
      })
      .catch(error => {
        shrinkMapResource.status = 'error';
        shrinkMapResource.error = error;
        throw error; // Re-throw to propagate the error
      });
  }
  return shrinkMapResource.promise;
};

export const useShrinkMap = (): Map<string, ShrinkMapItem> => {
  if (shrinkMapResource.status === 'pending') {
    throw fetchShrinkMap(); // Throw the promise to trigger Suspense
  } else if (shrinkMapResource.status === 'error') {
    throw shrinkMapResource.error!; // Throw the error to trigger ErrorBoundary
  } else if (shrinkMapResource.status === 'success') {
    return shrinkMapResource.processedResult!;
  }
  throw new Error("Unexpected state in useShrinkMap");
};
