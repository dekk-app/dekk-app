import React from "react";
import {remote} from "electron";
import {ColorpickerEvent, ColorpickerPointer, useBroadcast, useSubscribe} from "../ui/broadcast";
import {GlobalStyle} from "../ui/global-style";
import Patterns from "../ui/patterns";
import {ColorpickerPopover} from "../ui/colorpicker";
import BrowserWindow = Electron.BrowserWindow;

const setPosition = (win: BrowserWindow, node: HTMLElement, pointer: ColorpickerPointer) => {
	const {clientX, clientY} = pointer;
	const parent = win.getParentWindow();
	const [parentX, parentY] = parent.getPosition();
	const {size} = remote.screen.getPrimaryDisplay();
	const {height: popoverHeight, width: popoverWidth} = node.getBoundingClientRect();
	const popoverWindowWidth = popoverWidth + 2;
	const popoverWindowHeight = popoverHeight + 2;
	const {height: screenHeight, width: screenWidth} = size;
	const margin = 10;
	const arrowWidth = 24;
	const maxE = screenWidth - popoverWindowWidth - margin;
	const minW = margin;
	const maxS = margin;
	const maxN = screenHeight - popoverHeight - margin;
	const maxArrow = popoverWindowWidth / 2 - margin - arrowWidth;
	const spaceX = parentX + clientX - popoverWindowWidth / 2;
	const spaceY = parentY + clientY;
	const diffE = spaceX - maxE;
	const diffW = spaceX - minW;
	win.setContentSize(popoverWindowWidth, popoverWindowHeight);
	win.setPosition(
		Math.round(Math.max(minW, Math.min(maxE, spaceX))),
		Math.round(Math.max(maxS, Math.min(maxN, spaceY)))
	);
	win.show();
	return {
		maxArrow,
		diffE,
		diffW
	};
};

export const Colorpicker = () => {
	const ref = React.useRef<HTMLDivElement>();
	const [propsPath, setPropsPath] = React.useState<null | string>(null);
	const [isVisible, setVisible] = React.useState(false);
	const [colorValue, setColorValue] = React.useState<null | string>(null);
	const [selectedColor, setSelectedColor] = React.useState<null | string>(null);
	const [tipOffset, setTipOffset] = React.useState(0);
	const colorpicker = React.useMemo(() => remote.getCurrentWindow(), [setColorValue]);
	useSubscribe(
		{
			[ColorpickerEvent.OnRequest]: (event, {pointer, request: {path, value}}) => {
				if (ref.current && path && value && pointer) {
					setPropsPath(path);
					setSelectedColor(value);
					const {maxArrow, diffE, diffW} = setPosition(colorpicker, ref.current, pointer);
					if (diffE > 0) {
						setTipOffset(Math.min(maxArrow, diffE));
					} else if (diffW < 0) {
						setTipOffset(Math.max(-maxArrow, diffW));
					} else {
						setTipOffset(0);
					}
					setVisible(true);
				}
			}
		},
		[ref, setPropsPath, setVisible, setSelectedColor]
	);
	useSubscribe(
		{
			[ColorpickerEvent.OnClose]: () => {
				setVisible(false);
				setPropsPath(null);
				setColorValue(null);
				setSelectedColor(null);
				colorpicker.hide();
			}
		},
		[ref, setPropsPath, setVisible, setColorValue, setSelectedColor]
	);

	useBroadcast(
		{
			[ColorpickerEvent.OnChange]: {response: {colorValue, path: propsPath}}
		},
		[colorValue]
	);

	const handleChange = React.useCallback(
		value => {
			setColorValue(value);
			setSelectedColor(value);
			colorpicker.hide();
			colorpicker.once("hide", () => {
				setVisible(false);
				setPropsPath(null);
				setColorValue(null);
				setSelectedColor(null);
			});
		},
		[setColorValue, setVisible, setSelectedColor, setPropsPath]
	);
	return (
		<React.Fragment>
			<GlobalStyle />
			<Patterns />
			<ColorpickerPopover
				value={selectedColor}
				ref={ref as React.Ref<HTMLDivElement>}
				isVisible={isVisible}
				tipOffset={tipOffset}
				onChange={handleChange}
			/>
		</React.Fragment>
	);
};
