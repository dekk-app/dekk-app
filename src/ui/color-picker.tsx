import styled, {css} from "styled-components";
import {palette} from "../theme";
import React from "react";
import {Dropdown} from "./dropdown";
import {Icon, StyledSvg} from "./icon";
import {getPointer} from "./window-utils";
import {
	ColorPickerEvent,
	useBroadcast,
	useSubscribe
} from "./broadcast";

const colorSwatches = [
	palette.indigo[300],
	palette.teal[300],
	palette.green[300],
	palette.amber[300],
	palette.red[300],
	palette.pink[300],
	palette.indigo[500],
	palette.teal[500],
	palette.green[500],
	palette.amber[500],
	palette.red[500],
	palette.pink[500],
	palette.indigo[700],
	palette.teal[700],
	palette.green[700],
	palette.amber[700],
	palette.red[700],
	palette.pink[700],
	palette.indigo[900],
	palette.teal[900],
	palette.green[900],
	palette.amber[900],
	palette.red[900],
	palette.pink[900],
	palette.white,
	palette.grey[300],
	palette.grey[500],
	palette.grey[700],
	palette.grey[900],
	palette.black
];
const Swatch = styled.button<{isSelected?: boolean}>`
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 0;
	border: 0;
	margin: 0.5px;
	background-image: linear-gradient(-210deg, black 50%, white 50%);
	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: inherit;
		box-shadow: inset 0 0 1px 1px rgba(255, 255, 255, 0.25);
		pointer-events: none;
	}
	&:focus {
		z-index: 2;
	}
	${props =>
		props.isSelected &&
		css`
			z-index: 1;
			box-shadow: 0 0 0 2px ${props.theme.palette.white},
				inset 0 0 0 1px ${props.theme.palette.white};
		`}
`;
const Swatches = styled.div`
	width: 200px;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(5, 20px);
	grid-gap: 1px;
	padding: 5px;
	overflow: visible;
`;
const ColorPickerWrapper = styled.div`
	position: relative;
	display: flex;
	width: 72px;
`;
const ColorPickerLabel = styled.label`
	position: relative;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	width: 24px;
	height: 24px;
	box-shadow: 0 0 0 1px ${props => props.theme.colorpicker.borderColor};
	background: ${props => props.theme.colorpicker.background1};
	border-radius: 0 5px 5px 0;
	overflow: hidden;

	&:hover {
		background: ${props => props.theme.colorpicker.background2};
	}
`;
const ColorPickerSwatches = styled.a.attrs({href: "#"})<{transparent?: boolean}>`
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: flex-end;
	box-shadow: 0 0 0 1px ${props => props.theme.colorpicker.borderColor};
	background-image: linear-gradient(-206.5deg, black 50%, white 50%);
	position: relative;
	overflow: hidden;
	width: 48px;
	height: 24px;
	padding: 0 4px;
	border-radius: 5px 0 0 5px;

	${StyledSvg} {
		font-size: 16px;
		position: relative;
		z-index: 1;
		display: none;
		pointer-events: none;
	}
	&:hover ${StyledSvg} {
		display: block;
	}
	&:focus {
		outline: 0;
		${StyledSvg} {
			display: block;
		}
	}
	&::after {
		content: "";
		position: absolute;
		border-radius: inherit;
		top: 0;
		left: 0;
		height: inherit;
		width: inherit;
		background-color: inherit;
		pointer-events: none;
	}
`;
const ColorPickerInput = styled.input.attrs({
	type: "color"
})`
	position: absolute;
	top: 0;
	right: 100%;
`;

export const ColorPickerWindow: React.ForwardRefExoticComponent<{
	value: string | null;
	onChange: (colorValue: string) => void;
	tipOffset?: number;
	isVisible?: boolean;
	ref: React.Ref<HTMLDivElement>;
}> = React.forwardRef((props, ref) => {
	return (
		<Dropdown
			ref={ref}
			isVisible={props.isVisible}
			tipOffset={props.tipOffset}
			standAlone={true}>
			<Swatches>
				{colorSwatches.map(colorValue => (
					<Swatch
						key={colorValue}
						isSelected={props.value === colorValue}
						style={{backgroundColor: colorValue}}
						onClick={(e: React.MouseEvent) => {
							e.preventDefault();
							props.onChange(colorValue);
						}}
						onMouseDown={(e: React.MouseEvent) => {
							e.preventDefault();
						}}
					/>
				))}
			</Swatches>
		</Dropdown>
	);
});

export const ColorPicker: React.FunctionComponent<{
	value: string;
	onChange: (colorValue: string) => void;
	propPath: string;
}> = props => {
	const swatchesRef = React.createRef<HTMLAnchorElement>();
	const wrapperRef = React.createRef<HTMLDivElement>();
	const [pointer, setPointer] = React.useState();
	const request = {
		path: props.propPath,
		value: props.value
	};
	useSubscribe({
		[ColorPickerEvent.OnChange]: (event, {response}) => {
			if (props.propPath === response.path && response.colorValue)  {
				console.log(props.propPath, response.path);
				props.onChange(response.colorValue);
			}
		}
	});
	useBroadcast(
		{
			[ColorPickerEvent.OnRequest]: {pointer, request}
		},
		[pointer]
	);
	return (
		<ColorPickerWrapper ref={wrapperRef}>
			<ColorPickerSwatches
				tabIndex={0}
				transparent={props.value === "transparent"}
				style={{backgroundColor: props.value}}
				ref={swatchesRef as React.Ref<HTMLAnchorElement>}
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					if (e.target === swatchesRef.current) {
						const point = getPointer(e.target as HTMLButtonElement);
						setPointer(point);
					}
				}}>
				<Icon icon="chevronDown" color={palette.white} background="rgba(0,0,0,0.5)" round />
			</ColorPickerSwatches>
			<ColorPickerLabel>
				<Icon icon="circle" color="url(#rainbowSwirl)" />
				<ColorPickerInput
					value={props.value}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						const {value} = e.target;
						props.onChange(value);
					}}
				/>
			</ColorPickerLabel>
		</ColorPickerWrapper>
	);
};
