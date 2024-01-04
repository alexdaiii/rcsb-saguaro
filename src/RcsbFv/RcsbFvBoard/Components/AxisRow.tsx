import React from "react";
import {ReactNode} from "react";
import uniqid from "uniqid";

import {RcsbScaleInterface} from "../../../RcsbBoard/RcsbD3/RcsbD3ScaleFactory";
import {RcsbSelection} from "../../../RcsbBoard/RcsbSelection";
import {
  RcsbFvBoardConfigInterface,
  RcsbFvRowExtendedConfigInterface,
} from "../../RcsbFvConfig/RcsbFvConfigInterface";
import {RcsbFvDisplayTypes} from "../../RcsbFvConfig/RcsbFvDefaultConfigValues";
import {RcsbFvContextManager} from "../../RcsbFvContextManager/RcsbFvContextManager";
import {RcsbFvRow} from "../../RcsbFvRow/RcsbFvRow";
import {RowConfigFactory} from "../Utils/RowConfigFactory";

interface AxisRowInterface {
  readonly boardId: string;
  readonly contextManager: RcsbFvContextManager;
  readonly xScale: RcsbScaleInterface;
  readonly selection: RcsbSelection;
  readonly boardConfigData: RcsbFvBoardConfigInterface;
}

export class AxisRow extends React.Component<
  AxisRowInterface,
  {axisKey: string}
> {
  render(): ReactNode {
    const rowId: string = uniqid("rcsbFvAxis_");
    const rowConfig: RcsbFvRowExtendedConfigInterface = {
      displayType: RcsbFvDisplayTypes.AXIS,
      trackId: rowId,
      boardId: this.props.boardId,
    };
    return (
      <div key={rowId}>
        <RcsbFvRow
          id={rowId}
          boardId={this.props.boardId}
          rowNumber={0}
          rowConfigData={RowConfigFactory.getConfig(
            rowId,
            this.props.boardId,
            rowConfig,
            this.props.boardConfigData,
          )}
          xScale={this.props.xScale}
          selection={this.props.selection}
          contextManager={this.props.contextManager}
          renderSchedule={"fixed"}
        />
      </div>
    );
  }

  shouldComponentUpdate(
    nextProps: Readonly<AxisRowInterface>,
    nextState: Readonly<{axisKey: string}>,
    nextContext: any,
  ): boolean {
    return (
      nextProps.boardConfigData.length != this.props.boardConfigData.length ||
      nextProps.boardConfigData.range?.min !=
        this.props.boardConfigData.range?.min ||
      nextProps.boardConfigData.range?.max !=
        this.props.boardConfigData.range?.max ||
      nextProps.boardConfigData.trackWidth !=
        this.props.boardConfigData.trackWidth
    );
  }
}
