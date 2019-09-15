import React from "react";
import {remote} from "electron";
import {ColorPickerEvent, useBroadcast, useSubscribe} from "../ui/broadcast";
import {GlobalStyle} from "../ui/global-style";
import Patterns from "../ui/patterns";
import {ColorPickerWindow} from "../ui/color-picker";

export const ColorPicker = () => {
	const ref = React.useRef<HTMLDivElement>();
	const [propsPath, setPropsPath] = React.useState<null|string>(null);
	const [isVisible, setVisible] = React.useState(false);
	const [colorValue, setColorValue] = React.useState<null|string>(null);
	const [selectedColor, setSelectedColor] = React.useState<null|string>(null);
	const [tipOffset, setTipOffset] = React.useState(0);
	const colorpicker = React.useMemo(() => remote.getCurrentWindow(), [setColorValue]);
	useSubscribe(
		{
			[ColorPickerEvent.OnRequest]: (event, {pointer, request}) => {
				if (!ref.current) {
					return;
				}
				if (ref.current) {
					setPropsPath(request.path);
					setSelectedColor(request.value);
					const {clientX, clientY} = pointer as {clientX: number; clientY: number};
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
			},
			[ColorPickerEvent.OnClose]: () => {
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
			[ColorPickerEvent.OnChange]: {response: {colorValue, path: propsPath}}
		},
		[colorValue, propsPath]
	);

	const handleChange = React.useCallback(
		value => {
			setColorValue(value);
			setVisible(false);
			colorpicker.hide();
			colorpicker.once("hide", () => {
				setPropsPath(null);
				setColorValue(null);
				setSelectedColor(null);
			})
		},
		[setColorValue, setVisible, setSelectedColor]
	);
	return (
		<React.Fragment>
			<GlobalStyle />
			<Patterns />
			<ColorPickerWindow
				value={selectedColor}
				ref={ref as React.Ref<HTMLDivElement>}
				isVisible={isVisible}
				tipOffset={tipOffset}
				onChange={handleChange}
			/>
		</React.Fragment>
	);
};
