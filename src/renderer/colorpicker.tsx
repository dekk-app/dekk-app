import React from "react";
import {remote} from "electron";
import {ColorpickerEvent, useBroadcast, useSubscribe} from "../ui/broadcast";
import {GlobalStyle} from "../ui/global-style";
import Patterns from "../ui/patterns";
import {ColorpickerPopover} from "../ui/colorpicker";

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
					const {clientX, clientY} = pointer;
					const parent = colorpicker.getParentWindow();
					const [parentX, parentY] = parent.getPosition();
					const {size} = remote.screen.getPrimaryDisplay();
					const {
						height: popoverHeight,
						width: popoverWidth
					} = ref.current.getBoundingClientRect();
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
					if (diffE > 0) {
						setTipOffset(Math.min(maxArrow, diffE));
					} else if (diffW < 0) {
						setTipOffset(Math.max(-maxArrow, diffW));
					} else {
						setTipOffset(0);
					}
					colorpicker.setContentSize(popoverWindowWidth, popoverWindowHeight);
					colorpicker.setPosition(
						Math.round(Math.max(minW, Math.min(maxE, spaceX))),
						Math.round(Math.max(maxS, Math.min(maxN, spaceY)))
					);
					colorpicker.show();
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
