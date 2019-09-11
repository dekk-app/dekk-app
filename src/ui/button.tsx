import React from "react";
import styled, {css} from "styled-components";
import {StyledSvg} from "./icon";

export const StyledButton = styled.button<{
	isActive?: boolean;
}>`
	position: relative;
	display: inline-flex;
	align-content: center;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 4px 8px;
	height: 24px;
	line-height: 1;
	min-width: 30px;
	width: max-content;
	border: 0;
	${({theme}) => css`
		background: ${theme.button.background2};
		color: ${theme.button.color};
		box-shadow: inset 0 1px 0 ${theme.button.borderColor1},
			inset 0 -1px 0 ${theme.button.borderColor2};

		&:active {
			background: ${theme.button.background1};
		}
	`};
	border-radius: 3px;

	${StyledSvg} {
		font-size: 16px;
		margin: 0 4px;
	}

	&:focus {
		z-index: 1;
		outline: 2px solid highlight;
		outline-offset: 2px;
	}
	&[disabled] {
		pointer-events: none;
		opacity: 0.5;
	}

	${props =>
		props.isActive &&
		css`
			background: ${props.theme.button.backgroundActive};
			color: ${props.theme.button.color};
		`};
`;
export const Button: React.FunctionComponent<{
	onClick?: (e: React.MouseEvent) => void;
	onMouseDown?: (e: React.MouseEvent) => void;
	isActive?: boolean;
}> = ({children, isActive, onClick}) => (
	<StyledButton onClick={onClick} isActive={isActive}>
		{children}
	</StyledButton>
);

export const StyledButtonWrapper = styled.div`
	-webkit-app-region: no-drag;
	display: flex;
	flex-direction: column;
	align-content: center;
	align-items: center;
	margin: 0 4px;
	user-select: none;
`;

export const StyledButtonLabel = styled.span`
	padding: 4px;
	font-family: sans-serif;
	text-align: center;
	font-size: 12px;
`;

export const StyledGroupedButton = styled.div`
	display: flex;
	${StyledButtonWrapper} {
		margin: 0;
		align-content: stretch;
		align-items: stretch;
		flex: 1;
		&:first-child ${StyledButton} {
			border-radius: 3px 0 0 3px;
			${({theme}) => css`
				box-shadow: inset 0 1px 0 ${theme.button.borderColor1},
					inset 0 -1px 0 ${theme.button.borderColor2};
			`};
		}
		&:last-child ${StyledButton} {
			border-radius: 0 3px 3px 0;
		}
	}
	${StyledButton} {
		width: 100%;
		border-radius: 0;
		${({theme}) => css`
			box-shadow: inset 0 1px 0 ${theme.button.borderColor1},
				inset 0 -1px 0 ${theme.button.borderColor2},
				inset 1px 0 0 ${theme.button.borderColor2};
		`};
	}
`;
