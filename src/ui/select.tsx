import React from "react";
import styled, {css} from "styled-components";
import {Icon} from "./icon";

export const Select: React.FunctionComponent<{
	name?: string;
	value?: string;
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	options: {value: string; label: string}[];
}> = ({children, onChange, name, options, value}) => (
	<SelectWrapper>
	<StyledSelect onChange={onChange} name={name} value={value}>
		{options.map(option => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</StyledSelect>
	<DropdownIcon/>
	</SelectWrapper>
);

const SelectWrapper = styled.div`
	position: relative;
`;

const DropdownIcon = styled(Icon).attrs({
	icon: "menuDown"
})`
	position: absolute;
	z-index: 2;
	top: 50%;
	right: 0;
	transform: translateY(-50%);
	pointer-events: none;
	${({theme}) => css`
		color: ${theme.input.color};
	`};
`;

export const StyledSelect = styled.select`
	appearance: none;
	position: relative;
	display: inline-block;
	padding: 4px 24px 4px 8px;
	height: 24px;
	line-height: 1;
	width: auto;
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
