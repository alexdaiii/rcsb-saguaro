"use client";

// import {
//   RcsbFv,
//   RcsbFvDisplayTypes,
//   RcsbFvRowConfigInterface,
// } from "@alexdaiii/rcsb-saguaro";
import {useEffect} from "react";

import {
  RcsbFv,
  RcsbFvDisplayTypes,
  RcsbFvRowConfigInterface,
} from "../../../src";

const sequence =
  "MTTQAPTFTQPLQSVVVLEGSTATFEAHISGFPVPEVSWFRDGQVISTSTLPGVQISFSD" +
  "GRAKLTIPAVTKANSGRYSLKATNGSGQATSTAELLVKAETAPPNFVQRLQSMTVRQGSQ" +
  "VRLQVRVTGIPTPVVKFYRDGAEIQSSLDFQISQEGDLYSLLIAEAYPEDSGTYSVNATN" +
  "SVGRATSTAELLVQGEEEVPAKKTKTIVSTAQISESRQTRIEKKIEAHFDARSIATVEMV";

const compositeConfig: RcsbFvRowConfigInterface = {
  trackId: "compositeSequence1",
  trackHeight: 20,
  trackColor: "#F9F9F9",
  displayType: RcsbFvDisplayTypes.COMPOSITE,
  rowTitle: "Track 1",
  displayConfig: [
    {
      displayType: RcsbFvDisplayTypes.BLOCK_AREA,
      displayColor: "#9999FF",
      displayId: "compositeBlockSequence",
      displayData: [
        {
          begin: 1,
          end: sequence.length,
        },
      ],
    },
    {
      displayType: RcsbFvDisplayTypes.BLOCK,
      displayColor: "#000000",
      displayId: "compositeSeqeunce",
      displayData: [
        {
          begin: 1,
          label: sequence,
        },
      ],
    },
  ],
};

const boardConfigData = {
  length: sequence.length,
  trackWidth: 940,
  includeAxis: true,
  includeTooltip: true,
  highlightHoverElement: true,
  hideInnerBorder: true,
  hideRowGlow: false,
};

export default function Home() {
  useEffect(() => {
    const createFv = async () => {
      const fv = new RcsbFv({
        elementId: "pfv",
        boardConfigData,
        rowConfigData: Array(500)
          .fill(undefined)
          .map((i, n) => {
            return {
              ...compositeConfig,
              rowTitle: `Track ${n}`,
              trackId: "compositeSequence_" + n,
              trackVisibility: n % 2 == 0,
            };
          }),
      });
    };

    createFv().catch((e) => console.error(e));
  }, []);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-between
    p-24"
    >
      <div id={"pfv"}></div>
    </main>
  );
}
