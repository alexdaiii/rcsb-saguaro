import {RcsbFvTrackDataElementInterface} from "../RcsbDataManager/RcsbDataManager";

export interface BoardSelectionInterface {
  rcsbFvTrackDataElement: RcsbFvTrackDataElementInterface;
  domId: string;
}

//TODO add a callback for the 'hover' case
export class RcsbSelection {
  private selectedElements: Array<BoardSelectionInterface> =
    new Array<BoardSelectionInterface>();
  private hoverHighlightElements: Array<BoardSelectionInterface> =
    new Array<BoardSelectionInterface>();
  private selectionChangeCallback: (
    selection: Array<RcsbFvTrackDataElementInterface>,
  ) => void;

  public setSelectionChangeCallback(
    f: (selection: Array<RcsbFvTrackDataElementInterface>) => void,
  ): void {
    this.selectionChangeCallback = f;
  }

  public getSelected(mode: "select" | "hover"): Array<BoardSelectionInterface> {
    if (mode == null || mode === "select") return this.selectedElements;
    else return this.hoverHighlightElements;
  }

  public setSelected(
    elements: Array<BoardSelectionInterface> | BoardSelectionInterface,
    mode: "select" | "hover",
  ): void {
    if (mode == null || mode === "select") {
      if (elements instanceof Array) {
        this.selectedElements = elements;
      } else {
        this.selectedElements = [elements];
      }
    } else {
      if (elements instanceof Array) {
        this.hoverHighlightElements = elements;
      } else {
        this.hoverHighlightElements = [elements];
      }
    }
    this.callback(mode);
  }

  public addSelected(
    elements: Array<BoardSelectionInterface> | BoardSelectionInterface,
    mode: "select" | "hover",
    replaceLast?: boolean,
  ): void {
    if (mode == null || mode === "select") {
      if (elements instanceof Array) {
        this.selectedElements = this.selectedElements.concat(elements);
      } else {
        if (replaceLast)
          this.selectedElements[
            this.selectedElements.length - 1
          ].rcsbFvTrackDataElement = elements.rcsbFvTrackDataElement;
        else this.selectedElements.push(elements);
      }
    } else {
      if (elements instanceof Array) {
        this.hoverHighlightElements = this.selectedElements.concat(elements);
      } else {
        this.hoverHighlightElements.push(elements);
      }
    }
    this.callback(mode);
  }

  public clearSelection(mode: "select" | "hover"): void {
    if (mode == null || mode === "select") {
      this.selectedElements = new Array<BoardSelectionInterface>();
    } else {
      this.hoverHighlightElements = new Array<BoardSelectionInterface>();
    }
    this.callback(mode);
  }

  public reset(): void {
    this.selectedElements = new Array<BoardSelectionInterface>();
    this.hoverHighlightElements = new Array<BoardSelectionInterface>();
  }

  private callback(mode: "select" | "hover"): void {
    if (mode == null || mode === "select") {
      if (typeof this.selectionChangeCallback === "function") {
        this.selectionChangeCallback(
          this.selectedElements.map((e) => e.rcsbFvTrackDataElement),
        );
      }
    }
  }
}
