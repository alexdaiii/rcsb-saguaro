/**Interpolation types for line and area displays*/
export enum InterpolationTypes {
  STEP = "step",
  BASIS = "basis",
  CARDINAL = "cardinal",
  LINEAR = "linear",
}

/**Board track display types*/
export enum RcsbFvDisplayTypes {
  BLOCK = "block",
  AXIS = "axis",
  SEQUENCE = "sequence",
  PIN = "pin",
  LINE = "line",
  AREA = "area",
  BLOCK_AREA = "block-area",
  MULTI_AREA = "multi-area",
  VLINE = "vline",
  VARIANT = "variant",
  BOND = "bond",
  COMPOSITE = "composite",
}

/**Default board configuration values definition*/
interface RcsbFvDefaultConfigValuesInterface {
  readonly increasedView: number;
  readonly trackColor: string;
  readonly displayColor: string;
  readonly trackHeight: number;
  readonly trackAxisHeight: number;
  readonly trackWidth: number;
  readonly rowTitleWidth: number;
  readonly displayDomain: [number, number];
  readonly interpolationType: string;
  readonly rowHideTransitionTimeout: number;
  readonly titleAndTrackSpace: number;
  readonly borderWidth: number;
  readonly rowGlowWidth: number;
  readonly rowGlowColor: string;
  readonly borderColor: string;
  readonly hideInnerBorder: boolean;
  readonly hideRowGlow: boolean;
}

/**Default board configuration values*/
export const RcsbFvDefaultConfigValues: RcsbFvDefaultConfigValuesInterface = {
  increasedView: 1.5,
  trackColor: "#FFFFFF",
  displayColor: "#000000",
  trackHeight: 20,
  trackAxisHeight: 30,
  trackWidth: 920,
  rowTitleWidth: 160,
  displayDomain: [0, 1],
  interpolationType: InterpolationTypes.STEP,
  rowHideTransitionTimeout: 500,
  titleAndTrackSpace: 2,
  borderWidth: 1,
  borderColor: "#CCC",
  rowGlowWidth: 1,
  hideInnerBorder: true,
  hideRowGlow: false,
  rowGlowColor: "rgba(255,204,204,0.75)",
};


