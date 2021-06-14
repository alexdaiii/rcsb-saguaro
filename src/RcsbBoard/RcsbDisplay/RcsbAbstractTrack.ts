import {
    HighlightRegionInterface,
    MoveSelectedRegionInterface,
    RcsbD3Manager,
    TrackConfInterface
} from "../RcsbD3/RcsbD3Manager";
import {mouse, Selection} from "d3-selection";
import * as classes from "../scss/RcsbBoard.module.scss";
import {scaleLinear, ScaleLinear} from "d3-scale";
import {
    RcsbFvTrackData,
    RcsbFvTrackDataElementInterface,
    RcsbFvTrackDataMap
} from "../../RcsbDataManager/RcsbDataManager";
import {RcsbFvContextManager} from "../../RcsbFv/RcsbFvContextManager/RcsbFvContextManager";
import {LocationViewInterface} from "../RcsbBoard";

export abstract class RcsbAbstractTrack {
    protected d3Manager: RcsbD3Manager;
    protected contextManager: RcsbFvContextManager;
    private _bgColor: string = "#FFFFFF";
    private _height: number;
    private _width: number;
    private _data: RcsbFvTrackData;
    protected updateDataOnMove:(d:LocationViewInterface)=>Promise<RcsbFvTrackData>;
    protected xScale: ScaleLinear<number,number> = scaleLinear();
    protected g: Selection<SVGGElement,any,null,undefined>;
    private boardHighlight: (d: RcsbFvTrackDataElementInterface, operation: 'set'|'add', mode:'select'|'hover', propFlag?: boolean) => void;
    mouseoutCallBack: ()=>void;
    mouseoverCallBack: ()=>void;
    mousemoveCallBack: (n:number)=>void;

    private dataUpdatedFlag: boolean = false;

    height(h?: number): number{
        if(typeof h === "number"){
            this._height = h;
        }
        return this._height;
    }

    trackColor(c?: string): string{
        if(typeof c === "string"){
            this._bgColor = c;
        }
        return this._bgColor;
    }

    init(width: number, scale:ScaleLinear<number,number>, compositeFlag?: boolean, compositeHeight?: number): void{
        this._width = width;
        this.xScale = scale;
    	if(this.g != null) {
            this.g.remove();
        }
    	let height:number = this._height;
        let compH:number = 0;
    	if(compositeFlag === true){
    	    height = 0;
    	    if(typeof compositeHeight === "number")
                compH = compositeHeight;
    	    else
    	        height = 0;
        }
        const config: TrackConfInterface = {
            trackClass: classes.rcsbTrack,
            height: height,
            compositeHeight:compH,
            bgColor: this._bgColor
        };
        this.g = this.d3Manager.addTrack(config);
    }

    data(d?:  RcsbFvTrackData | RcsbFvTrackDataMap): RcsbFvTrackData {
        if(d!=null) {
            const e: RcsbFvTrackData = d as RcsbFvTrackData;
            if (e != null) {
                this._data = e;
                this.setDataUpdated(false);
            }
        }
        return this._data;
    }

    protected setDataUpdated(flag: boolean){
        this.dataUpdatedFlag = flag;
    }

    protected isDataUpdated(){
        return this.dataUpdatedFlag;
    }

    setUpdateDataOnMove( f:(d:LocationViewInterface)=>Promise<RcsbFvTrackData> ): void{
        this.updateDataOnMove = f;
    }

    setBoardHighlight(f: (d:RcsbFvTrackDataElementInterface, operation:'set'|'add', mode:'select'|'hover', propFlag?: boolean) => void){
        this.boardHighlight = f;
    }

    protected getBoardHighlight(): (d:RcsbFvTrackDataElementInterface, operation:'set'|'add', mode:'select'|'hover', propFlag?: boolean) => void {
        return this.boardHighlight;
    }

    setManagers(d3Manager: RcsbD3Manager, contextManager: RcsbFvContextManager){
        this.d3Manager = d3Manager;
        this.contextManager = contextManager;
    }

    highlightRegion(d:Array<RcsbFvTrackDataElementInterface>|null, options?:{color?:string, rectClass?: string;}): void {
        const height: number = this._height;
        const xScale: ScaleLinear<number,number> = this.xScale;
        if(typeof(height)==="number" && d!= null ) {
            const highlightRegConfig: HighlightRegionInterface = {
                trackG: this.g,
                height: height,
                xScale: xScale,
                rectClass: options?.rectClass ?? classes.rcsbSelectRect,
                color: options?.color,
                elements: d
            };
            this.d3Manager.highlightRegion(highlightRegConfig);
        }else{
            if(options?.rectClass != null)
                this.g.selectAll("."+options.rectClass ).remove();
            else
                this.g.selectAll("."+(options?.rectClass ?? classes.rcsbSelectRect)).remove();
        }

    }

    moveSelection(mode:'select'|'hover'): void{
        const xScale: ScaleLinear<number,number> = this.xScale;
        const moveSelectionConfig: MoveSelectedRegionInterface = {
            trackG: this.g,
            xScale: xScale,
            rectClass: mode === 'select' ? classes.rcsbSelectRect : classes.rcsbHoverRect
        };
        this.d3Manager.moveSelection(moveSelectionConfig);
    }

}
