import React, { CSSProperties, MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import cx from "classnames";

import "./Tooltip.scss";
import { IS_TOUCH } from "config/env";
import Portal from "../Common/Portal";
import { TooltipPosition } from "./Tooltip";
import { DEFAULT_TOOLTIP_POSITION, TOOLTIP_CLOSE_DELAY, TOOLTIP_OPEN_DELAY } from "config/ui";
import { computePosition, flip, shift } from "@floating-ui/dom";

type Props = {
  handle: React.ReactNode;
  renderContent: () => React.ReactNode;
  position?: TooltipPosition;
  trigger?: string;
  className?: string;
  portalClassName?: string;
  disableHandleStyle?: boolean;
  handleClassName?: string;
  isHandlerDisabled?: boolean;
  fitHandleWidth?: boolean;
  closeOnDoubleClick?: boolean;
  openDelay?: number;
  closeDelay?: number;
  shouldStopPropagation?: boolean;
};

type Coords = {
  height?: number;
  width?: number;
  left?: number;
  top?: number;
};

export default function TooltipWithPortal({
  handle,
  renderContent,
  position = DEFAULT_TOOLTIP_POSITION,
  trigger = "hover",
  className,
  portalClassName,
  disableHandleStyle,
  handleClassName,
  isHandlerDisabled,
  fitHandleWidth,
  closeOnDoubleClick,
  openDelay = TOOLTIP_OPEN_DELAY,
  closeDelay = TOOLTIP_CLOSE_DELAY,
  shouldStopPropagation,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<Coords>({});
  const [tooltipWidth, setTooltipWidth] = useState<string>();
  const intervalCloseRef = useRef<ReturnType<typeof setTimeout> | null>();
  const intervalOpenRef = useRef<ReturnType<typeof setTimeout> | null>();

  const handlerRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const [computedPlacement, setComputedPlacement] = useState<TooltipPosition | undefined>(position);

  useEffect(() => {
    if (handlerRef.current && popupRef.current) {
      computePosition(handlerRef.current, popupRef.current, {
        middleware: [flip(), shift()],
        placement: position,
      }).then(({ placement }) => {
        setComputedPlacement(placement);
      });
    }
  }, [visible, position]);

  const updateTooltipCoords = useCallback(() => {
    const rect = handlerRef?.current?.getBoundingClientRect();

    if (rect) {
      setCoords({
        height: rect.height,
        width: rect.width,
        left: rect.x,
        top: rect.y + window.scrollY,
      });
      if (fitHandleWidth) {
        setTooltipWidth(`${rect.width}px`);
      }
    }
  }, [handlerRef, fitHandleWidth]);

  const onMouseEnter = useCallback(() => {
    if (trigger !== "hover" || IS_TOUCH) return;

    if (intervalCloseRef.current) {
      clearInterval(intervalCloseRef.current);
      intervalCloseRef.current = null;
    }
    if (!intervalOpenRef.current) {
      intervalOpenRef.current = setTimeout(() => {
        setVisible(true);
        intervalOpenRef.current = null;
      }, openDelay);
    }
    updateTooltipCoords();
  }, [setVisible, trigger, updateTooltipCoords, openDelay]);

  const onMouseClick = useCallback(
    (event: MouseEvent) => {
      if (shouldStopPropagation) {
        event.stopPropagation();
      }
      if (trigger !== "click" && !IS_TOUCH) return;
      if (intervalCloseRef.current) {
        clearInterval(intervalCloseRef.current);
        intervalCloseRef.current = null;
      }
      if (intervalOpenRef.current) {
        clearInterval(intervalOpenRef.current);
        intervalOpenRef.current = null;
      }
      updateTooltipCoords();

      if (closeOnDoubleClick) {
        setVisible((old) => !old);
      } else {
        setVisible(true);
      }
    },
    [closeOnDoubleClick, shouldStopPropagation, trigger, updateTooltipCoords]
  );

  const onMouseLeave = useCallback(() => {
    intervalCloseRef.current = setTimeout(() => {
      setVisible(false);
      intervalCloseRef.current = null;
    }, closeDelay);

    if (intervalOpenRef.current) {
      clearInterval(intervalOpenRef.current);
      intervalOpenRef.current = null;
    }
    updateTooltipCoords();
  }, [setVisible, updateTooltipCoords, closeDelay]);

  const onHandleClick = useCallback((event: MouseEvent) => {
    event.preventDefault();
  }, []);

  const portalStyle = useMemo<CSSProperties>(() => ({ ...coords, position: "absolute" }), [coords]);
  const popupStyle = useMemo(() => ({ width: tooltipWidth }), [tooltipWidth]);

  return (
    <span
      className={cx("Tooltip", className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onMouseClick}
    >
      <span
        className={cx({ "Tooltip-handle": !disableHandleStyle }, [handleClassName], { active: visible })}
        onClick={onHandleClick}
        ref={handlerRef}
      >
        {/* For onMouseLeave to work on disabled button https://github.com/react-component/tooltip/issues/18#issuecomment-411476678 */}
        {isHandlerDisabled ? <div className="Tooltip-disabled-wrapper">{handle}</div> : <>{handle}</>}
      </span>
      {visible && coords.left && (
        <Portal>
          <div style={portalStyle} className={portalClassName}>
            <div ref={popupRef} className={cx(["Tooltip-popup z-index-1001", computedPlacement])} style={popupStyle}>
              {renderContent()}
            </div>
          </div>
        </Portal>
      )}
    </span>
  );
}
