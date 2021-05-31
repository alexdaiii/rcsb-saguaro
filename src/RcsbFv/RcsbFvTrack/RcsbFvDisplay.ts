import {RcsbFvDisplayTypes} from '../RcsbFvConfig/RcsbFvDefaultConfigValues';
import {RcsbFvDisplayConfigInterface, RcsbFvRowConfigInterface} from "../RcsbFvConfig/RcsbFvConfigInterface";
import {RcsbDisplayInterface} from "../../RcsbBoard/RcsbDisplay/RcsbDisplayInterface";
import {RcsbAxisDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbAxisDisplay";
import {RcsbPinDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbPinDisplay";
import {RcsbBondDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbBondDisplay";
import {RcsbSequenceDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbSequenceDisplay";
import {RcsbCompositeDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbCompositeDisplay";
import {RcsbBlockDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbBlockDisplay";
import {RcsbLineDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbLineDisplay";
import {RcsbAreaDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbAreaDisplay";
import {RcsbVariantDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbVariantDisplay";
import {RcsbVlineDisplay} from "../../RcsbBoard/RcsbDisplay/RcsbVlineDisplay";
import {RcsbFvColorGradient} from "../../RcsbDataManager/RcsbDataManager";

export class RcsbFvDisplay {

    private displayIds: Array<string> = [];
    private readonly displayConfig: RcsbFvRowConfigInterface;

    constructor(config: RcsbFvRowConfigInterface){
        this.displayConfig = config;
    }

    public initDisplay() : RcsbDisplayInterface{
        const config = this.displayConfig;
        if (typeof config.displayType === "string" && config.displayType != RcsbFvDisplayTypes.COMPOSITE) {
            const out: RcsbDisplayInterface | null = RcsbFvDisplay.singleDisplay(config.displayType, config);
            if(out!= null)
                return out;
            else
                throw "Display config "+config+" not supported";
        }else if(typeof config.displayType === "string" && config.displayType == RcsbFvDisplayTypes.COMPOSITE){
            return this.composedDisplay(config);
        }else{
            throw "Display type "+config.displayType+" not supported";
        }
    }

    public getDisplayIds(){
        return this.displayIds;
    }

    private composedDisplay(config: RcsbFvRowConfigInterface) : RcsbDisplayInterface{
        const display:RcsbCompositeDisplay = new RcsbCompositeDisplay();
        let i = 0;
        if(config.displayConfig != undefined)
            for(let displayItem of config.displayConfig){
                let displayId: string = "displayId_"+Math.random().toString(36).substr(2);
                if(typeof displayItem.displayId === "string"){
                    displayId = displayItem.displayId;
                }
                const displayType: string = displayItem.displayType;
                let displayConfig: RcsbFvRowConfigInterface = config;
                if(config.displayConfig) {
                    displayConfig = RcsbFvDisplay.setDisplayConfig(config, config.displayConfig[i]);
                    i++;
                }
                const singleDisplay: RcsbDisplayInterface | null = RcsbFvDisplay.singleDisplay(displayType, displayConfig);
                if( singleDisplay != null) {
                    display.addDisplay(displayId, singleDisplay);
                    this.displayIds.push(displayId);
                }else{
                    throw "Display type "+displayConfig+" not supported";
                }
            }
        return display;
    }

    private static setDisplayConfig(config: RcsbFvRowConfigInterface, displayConfig: RcsbFvDisplayConfigInterface) : RcsbFvRowConfigInterface{
        return {...config,...displayConfig};
    }

    private static singleDisplay(type: string, config: RcsbFvRowConfigInterface): RcsbDisplayInterface {
        let out:RcsbDisplayInterface;
        if(config.boardId != undefined && config.trackId != undefined && config.displayColor != undefined) {
            switch (type) {
                case RcsbFvDisplayTypes.AXIS:
                    out = RcsbFvDisplay.axisDisplay(config.boardId, config.trackId, config.length);
                    break;
                case RcsbFvDisplayTypes.BLOCK:
                    out = RcsbFvDisplay.blockDisplay(config.boardId, config.trackId, config.displayColor as string);
                    break;
                case RcsbFvDisplayTypes.PIN:
                    if(config.displayDomain != undefined)
                        out = RcsbFvDisplay.pinDisplay(config.boardId, config.trackId, config.displayColor as string, config.displayDomain);
                    else
                        throw "Track displayDomain (yScale) not defined";
                    break;
                case RcsbFvDisplayTypes.BOND:
                    out = RcsbFvDisplay.bondDisplay(config.boardId, config.trackId, config.displayColor as string);
                    break;
                case RcsbFvDisplayTypes.SEQUENCE:
                    const dynamicDisplay: boolean = config.dynamicDisplay != undefined ? config.dynamicDisplay: false;
                    const nonEmptyDisplay: boolean = config.nonEmptyDisplay != undefined ? config.nonEmptyDisplay : false;
                    out = RcsbFvDisplay.sequenceDisplay(config.boardId, config.trackId, config.displayColor as string, dynamicDisplay, nonEmptyDisplay);
                    break;
                case RcsbFvDisplayTypes.LINE:
                    if(config.displayDomain != undefined)
                        out = RcsbFvDisplay.lineDisplay(config.boardId, config.trackId, config.displayColor as string, config.displayDomain, config.interpolationType);
                    else
                        throw "Track displayDomain (yScale) not defined";
                    break;
                case RcsbFvDisplayTypes.AREA:
                    if(config.displayDomain != undefined)
                        out = RcsbFvDisplay.areaDisplay(config.boardId, config.trackId, config.displayColor as string|RcsbFvColorGradient, config.displayDomain, config.interpolationType);
                    else
                        throw "Track displayDomain (yScale) not defined";
                    break;
                case RcsbFvDisplayTypes.VARIANT:
                    out = RcsbFvDisplay.variantDisplay(config.boardId, config.trackId, config.displayColor as string);
                    break;
                case RcsbFvDisplayTypes.VLINE:
                    out = RcsbFvDisplay.vlineDisplay(config.boardId, config.trackId, config.displayColor as string);
                    break;
                default:
                    throw "Track type " + config.displayType + " is not supported";
            }
            if (out != null && typeof config.elementClickCallBack === "function") {
                out.setElementClickCallBack(config.elementClickCallBack);
            }
            if (out != null && typeof config.elementEnterCallBack === "function") {
                out.setElementEnterCallBack(config.elementEnterCallBack);
            }
            if (out != null && typeof config.elementLeaveCallBack === "function") {
                out.setElementLeaveCallBack(config.elementLeaveCallBack);
            }
            if (out != null && typeof config.updateDataOnMove === "function") {
                out.setUpdateDataOnMove(config.updateDataOnMove);
            }
            if (out != null && typeof config.includeTooltip === "boolean") {
                out.setTooltip(config.includeTooltip);
            }
            if(out!=null && typeof config.minRatio === "number"){
                out.setMinRatio(config.minRatio);
            }
            if(out!=null && typeof config.selectDataInRangeFlag === "boolean"){
                out.setSelectDataInRange(config.selectDataInRangeFlag);
            }
            if(out!=null && typeof config.hideEmptyTrackFlag === "boolean"){
                out.setHideEmptyTrack(config.hideEmptyTrackFlag);
            }
        }else{
            console.error(config);
            throw "Single Display failed missing boardId or displayColor";
        }
        return out;
    }

    private static axisDisplay(boardId:string, trackId:string, length:number|undefined): RcsbDisplayInterface{
        return new RcsbAxisDisplay(boardId,trackId,length);
    }

    private static sequenceDisplay(boardId: string, trackId: string, color:string, dynamicDisplayFlag:boolean, nonEmptyDisplayFlag:boolean) : RcsbDisplayInterface{
        const display: RcsbSequenceDisplay = new RcsbSequenceDisplay(boardId, trackId);
        display.setDisplayColor(color);
        if(dynamicDisplayFlag === true) {
            display.setDynamicDisplay();
        }
        if(nonEmptyDisplayFlag === true){
            display.setNonEmptyDisplay(true);
        }
        return display;
    }

    private static blockDisplay(boardId: string, trackId: string, color:string): RcsbDisplayInterface{
        const display: RcsbBlockDisplay = new RcsbBlockDisplay(boardId,trackId);
        display.setDisplayColor(color);
        return display;
    }

    private static pinDisplay(boardId: string, trackId: string, color: string, domain:[number,number]): RcsbDisplayInterface{
        const display: RcsbPinDisplay = new RcsbPinDisplay(boardId,trackId);
        display.setDisplayColor(color);
        display.yDomain(domain);
        return display;
    }

    private static bondDisplay(boardId: string, trackId: string, color: string): RcsbDisplayInterface{
        const display: RcsbBondDisplay = new RcsbBondDisplay(boardId, trackId);
        display.setDisplayColor(color);
        return display;
    }

    private static lineDisplay(boardId: string, trackId: string, color: string, domain:[number,number], interpolationType?: string) : RcsbDisplayInterface{
        const display: RcsbLineDisplay = new RcsbLineDisplay(boardId,trackId);
        display.setDisplayColor(color);
        display.yDomain(domain);
        if(interpolationType != undefined)
            display.setInterpolationType(interpolationType);
        return display;
    }

    private static areaDisplay(boardId: string, trackId: string, color: string | RcsbFvColorGradient, domain:[number,number], interpolationType?: string) : RcsbDisplayInterface{
        const display: RcsbAreaDisplay = new RcsbAreaDisplay(boardId,trackId);
        display.setDisplayColor(color);
        display.yDomain(domain);
        if(interpolationType != undefined)
            display.setInterpolationType(interpolationType);
        return display;
    }

    private static variantDisplay(boardId: string, trackId: string, color: string) :RcsbDisplayInterface{
        const display: RcsbVariantDisplay = new RcsbVariantDisplay(boardId,trackId);
        display.setDisplayColor(color);
        return display;
    }

    private static vlineDisplay(boardId: string, trackId: string, color:string) : RcsbDisplayInterface{
        const display: RcsbVlineDisplay = new RcsbVlineDisplay(boardId, trackId);
        display.setDisplayColor(color);
        return display;
    }

}
