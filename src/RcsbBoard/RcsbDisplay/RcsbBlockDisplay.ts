import {RcsbCoreDisplay} from "./RcsbCoreDisplay";
import {Selection, BaseType} from "d3-selection";
import {RcsbDisplayInterface} from "./RcsbDisplayInterface";
import {
	MoveBlockInterface,
	PlotBlockInterface,
	RcsbD3BlockManager
} from "../RcsbD3/RcsbD3DisplayManager/RcsbD3BlockManager";
import {RcsbFvTrackDataElementInterface} from "../../RcsbDataManager/RcsbDataManager";

export class RcsbBlockDisplay extends RcsbCoreDisplay implements RcsbDisplayInterface{

	private dx: number = 0.5;

    plot(elements:Selection<SVGGElement,RcsbFvTrackDataElementInterface,BaseType,undefined>): void {
        super.plot(elements);
        const config: PlotBlockInterface = {
        	elements: elements,
        	dy: this._height*(2/3),
			dx: this.dx,
			y_o: this._height*(1/6),
			xScale: this.xScale,
			color: this._displayColor as string,
			height:this._height
		};
		RcsbD3BlockManager.plot(config);
    }

    move(): void{
        const blocks: Selection<SVGGElement,RcsbFvTrackDataElementInterface,BaseType,undefined> = this.getElements();
		const config: MoveBlockInterface = {
			elements: blocks,
			dx: this.dx,
			xScale: this.xScale,
			height:this._height
		};
		RcsbD3BlockManager.move(config);
    }

}
