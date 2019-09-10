import styled, {css} from "styled-components";
import {palette} from "../theme";
import React from "react";
import Patterns from "./patterns";
import {OutsideClick} from "./outside-click";
import {Dropdown} from "./dropdown";
import {Icon, StyledSvg} from "./icon";

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
	palette.grey[200],
	palette.grey[500],
	palette.grey[800],
	palette.black,
	"transparent"
];
const Swatch = styled.button<{isSelected?: boolean}>`
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 0;
	border: 0;
	margin: 0.5px;
	box-shadow: inset 0 0 1px 1px rgba(255, 255, 255, 0.25);
	background-image: linear-gradient(30deg, black 50%, white 50%);
	&:focus {
		z-index: 2;
	}
	${props =>
		props.isSelected &&
		css`
			z-index: 1;
			box-shadow: 0 0 0 2px ${props.theme.palette.white}, inset 0 0 0 1px ${props.theme.palette.white};
		`}
`;
const Swatches = styled.div`
	width: 220px;
	display: grid;
	grid-template-columns: repeat(6, 1fr);
	grid-template-rows: repeat(5, 20px);
	grid-gap: 1px;
	padding: 10px;
	overflow: visible;
`;
const ColorPickerWrapper = styled.div`
	position: relative;
	display: flex;
	margin: 4px;
	width: 96px;
`;
const ColorPickerLabel = styled.label`
	position: relative;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	width: 32px;
	height: 32px;
	border: 1px solid ${props => props.theme.colorpicker.borderColor};
	background: ${props => props.theme.colorpicker.background1};
	border-left: 0;
	border-radius: 0 3px 3px 0;
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
	border: 1px solid ${props => props.theme.colorpicker.borderColor};
	background: ${props => props.theme.colorpicker.background1};
	position: relative;
	overflow: hidden;
	width: 64px;
	height: 32px;
	padding: 4px;
	border-radius: 3px 0 0 3px;
	${StyledSvg} {
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
	${props => props.transparent && css`
		&::before {
			content: "";
			position: absolute;
			border-radius: inherit;
			top: 0;
			left: 0;
			height: inherit;
			width: inherit;
			background: ${props => props.theme.palette.white};
			pointer-events: none;
		}
		&::after {
			content: "";
			position: absolute;
			top: 0;
			right: 0;
			height: 1px;
			width: 72px;
			background: ${props => props.theme.palette.red[500]};
			margin-top: -1px;
			transform-origin: 100% 0;
			transform: rotate(-26.5deg);
			pointer-events: none;
		}
	`};
`;
const ColorPickerInput = styled.input.attrs({
	type: "color"
})`
	position: absolute;
	top: 0;
	right: 100%;
`;

const ColorPickerDropdown: React.ForwardRefExoticComponent<{
	value?: string;
	isVisible?: boolean;
	onChange: (colorValue: string) => void;
	setDropdown: (bool: boolean) => void;
}> = React.forwardRef((props, ref) => (
	<Dropdown ref={ref} isVisible={props.isVisible}>
		<Swatches>
			{colorSwatches.map(colorValue => (
				<Swatch
					key={colorValue}
					isSelected={props.value === colorValue}
					style={colorValue !== "transparent" ? {background: colorValue} : undefined}
					onClick={(e: React.MouseEvent) => {
						e.preventDefault();
						props.setDropdown(false);
						props.onChange(colorValue);
					}}
				/>
			))}
		</Swatches>
	</Dropdown>
));

export const ColorPicker: React.FunctionComponent<{
	value: string;
	onChange: (colorValue: string) => void;
}> = props => {
	const swatchesRef = React.createRef<HTMLAnchorElement>();
	const [withDropdown, setDropdown] = React.useState(false);
	return (
		<ColorPickerWrapper>
			<Patterns />
			<ColorPickerSwatches
				tabIndex={0}
				transparent={props.value === "transparent"}
				style={{background: props.value}}
				ref={swatchesRef as React.Ref<HTMLAnchorElement>}
				onClick={(e: React.MouseEvent) => {
					e.preventDefault();
					if (e.target === swatchesRef.current) {
						setDropdown(isOpen => !isOpen);
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
						setDropdown(false);
						props.onChange(value);
					}}
				/>
			</ColorPickerLabel>
			<OutsideClick
				onOutsideClick={e => {
					if (withDropdown && e.target !== swatchesRef.current) {
						setDropdown(false);
					}
				}}
				componentProps={{
					setDropdown,
					onChange: props.onChange,
					value: props.value,
					isVisible: withDropdown
				}}
				component={ColorPickerDropdown}
			/>
		</ColorPickerWrapper>
	);
};
