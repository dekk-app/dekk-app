import React from "react";
import styled, {css} from "styled-components";
import {StyledSelect} from "./select";
import {Flex, Flexbox} from "./layout";

export const StyledRange = styled.input.attrs({
	type: "range"
})`
	${({theme}) => css`
		appearance: none;
		position: relative;
		margin: 0;
		padding: 0;
		height: 24px;
		width: 100%;
		background: none;

		&::-webkit-slider-thumb {
			position: relative;
			appearance: none;
			border: 0;
			height: 12px;
			width: 12px;
			border-radius: 8px;
			background: ${theme.rangeInput.background2};
			cursor: pointer;
			margin-top: -4px;
			box-shadow: inset 0 1px 0 ${theme.rangeInput.borderColor1},
				inset 0 -1px 0 ${theme.rangeInput.borderColor2}, 0 2px 7px rgba(0, 0, 0, 0.5);
			z-index: 2;
		}
		&::-webkit-slider-runnable-track {
			width: 100%;
			height: 4px;
			cursor: pointer;
			box-shadow: inset 0 -1px 0 ${theme.rangeInput.borderColor1},
				inset 0 1px 0 ${theme.rangeInput.borderColor2};
			background: ${theme.rangeInput.background1};
			border-radius: 2px;
			border: 0;
		}
		&:focus {
			outline: 0;
		}
	`};
`;

const StyledRangeWrapper = styled.div`
	position: relative;
	display: flex;
	width: calc(100% - 8px);
		height: 24px;

	margin-right: 8px;
`;
const StyledNumberRangeWrapper = styled.div`
	padding: 8px 0;
`;

const StyledRangeProgress = styled.div`
	position: absolute;
	z-index: 1;
	top: 50%;
	left: 0;
	border-radius: 2px 0 0 2px;
	height: 4px;
	margin-top: -2px;
	cursor: pointer;
	border: 0;
	${({theme}) => css`
		background: ${theme.rangeInput.backgroundActive};
		box-shadow: inset 0 -1px 0 ${theme.rangeInput.borderColor1},
			inset 0 1px 0 ${theme.rangeInput.borderColor2};
	`}
`;

export const Range: React.FunctionComponent<any> = props => {
	return (
		<StyledRangeWrapper>
			<StyledRange {...props} />
			<StyledRangeProgress style={{width: `${(props.value / props.max) * 100}%`}} />
		</StyledRangeWrapper>
	);
};

export const NumberRange: React.FunctionComponent<any> = props => (
	<StyledNumberRangeWrapper>
		<StyledRangeLabel>{props.label}</StyledRangeLabel>
		<Flexbox>
			<Flex>
				<Range
					min={props.min}
					max={props.max}
					step={props.step}
					value={props.value}
					onChange={props.onChange}
				/>
			</Flex>
			<StyledNumberInput
				min={props.min}
				max={props.max}
				step={props.step}
				value={props.value}
				onChange={props.onChange}
			/>
		</Flexbox>
	</StyledNumberRangeWrapper>
);

export const StyledRangeLabel = styled.span`
	display: block;
	width: 100%;
	font-family: sans-serif;
	text-align: left;
	font-size: 12px;
`;

export const StyledInput = styled.input`
	position: relative;
	display: inline-block;
	padding: 4px 8px;
	height: 24px;
	line-height: 16px;
	min-width: 30px;
	border: 0;
	border-radius: 3px;

	${({theme}) => css`
		background: ${theme.input.background1};
		color: ${theme.input.color};
		box-shadow: inset 0 1px 0 ${theme.input.borderColor1},
			inset 0 -1px 0 ${theme.input.borderColor2};
	`};

	&:focus {
		z-index: 1;
		outline: 2px solid highlight;
		outline-offset: 2px;
	}
	&[disabled] {
		pointer-events: none;
		opacity: 0.5;
	}
`;
export const Input: React.FunctionComponent<{
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: string;
	type?: string;
}> = ({children, onChange, type, value}) => (
	<StyledInput onChange={onChange} type={type} value={value}>
		{children}
	</StyledInput>
);

export const StyledNumberInput = styled.input.attrs({
	type: "number"
})`
	position: relative;
	display: inline-block;
	padding: 0 24px 0 0;
	height: 24px;
	line-height: 16px;
	min-width: 30px;
	border: 0;
	border-radius: 0;
	background: none;

	${({theme}) => css`
		color: ${theme.input.color};

		&::-webkit-textfield-decoration-container {
			padding: 4px 0 4px 8px;
			margin-right: -4px;
			border-radius: 3px;
			background: ${theme.input.background1};
			box-shadow: inset 0 1px 0 ${theme.input.borderColor1},
				inset 0 -1px 0 ${theme.input.borderColor2};
		}
		&::-webkit-inner-spin-button {
			opacity: 1;
			transform: translateX(16px);
		}
	`};

	&:focus {
		outline: 0;
	}
	&[disabled] {
		pointer-events: none;
		opacity: 0.5;
	}
`;

export const StyledInputWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	margin: 0 4px;
	user-select: none;
`;

export const StyledInputLabel = styled.span`
	padding: 4px;
	font-family: sans-serif;
	text-align: center;
	font-size: 12px;
`;

export const StyledGroupedInput = styled.div`
	display: flex;
	${StyledInputWrapper} {
		margin: 0;
		align-content: stretch;
		align-items: stretch;
		flex: 1;
		&:first-child ${StyledInput}, &:first-child ${StyledSelect} {
			border-radius: 3px 0 0 3px;
			${({theme}) => css`
				box-shadow: inset 0 1px 0 ${theme.input.borderColor1},
					inset 0 -1px 0 ${theme.input.borderColor2};
			`};
		}
		&:last-child ${StyledInput}, &:last-child ${StyledSelect} {
			border-radius: 0 3px 3px 0;
		}
	}
	${StyledInput}, ${StyledSelect} {
		width: 100%;
		border-radius: 0;
		${({theme}) => css`
			box-shadow: inset 0 1px 0 ${theme.input.borderColor1},
				inset 0 -1px 0 ${theme.input.borderColor2},
				inset 1px 0 0 ${theme.input.borderColor2};
		`};
	}
`;
