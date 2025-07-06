import { ShrinkMapItem } from "../types";
import { createSuspenseResource } from "../utils/createSuspenseResource";

const fetchShrinkMap = () =>
  fetch("/shrinkmap.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const shrinkMap = new Map<string, ShrinkMapItem>();
      data.content.forEach((item: ShrinkMapItem) => {
        shrinkMap.set(item.MJ文字図形名, item);
      });
      return shrinkMap;
    });

const shrinkMapResource =
  createSuspenseResource<Map<string, ShrinkMapItem>>(fetchShrinkMap);

export const useShrinkMap = (): Map<string, ShrinkMapItem> => {
  return shrinkMapResource.read();
};
