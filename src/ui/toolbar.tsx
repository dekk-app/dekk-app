import React from "react";
import styled, {css} from "styled-components";
import {StyledButton, StyledButtonLabel, StyledButtonWrapper} from "./button";
import {StyledHeader} from "./header";
import {Icon} from "./icon";

const StyledToolbar = styled(StyledHeader)`
	-webkit-app-region: drag;
	display: flex;
	padding: 24px 4px 0;
	${({theme}) => css`
		background: linear-gradient(
			0deg,
			${theme.toolbar.background2},
			${theme.toolbar.background1}
		);
		color: ${theme.toolbar.color};
		border-bottom: 1px solid ${theme.toolbar.borderColor};
	`}
`;
const StyledToolbarTitle = styled.h1`
	position: absolute;
	top: 0;
	left: 50%;
	margin: 0;
	transform: translate(-50%, 0);
	font-size: 14px;
	padding: 4px;
	font-weight: normal;
`;

const StyledToolbarButton = styled(StyledButton)``;

const StyledToolbarFlex = styled.div`
	flex: 1;
`;
export const ToolbarFlex: React.FunctionComponent = () => <StyledToolbarFlex />;

export const Toolbar: React.FunctionComponent<{title: string}> = ({children, title}) => (
	<StyledToolbar>
		<StyledToolbarTitle>{title}</StyledToolbarTitle>
		{children}
	</StyledToolbar>
);

export const ToolbarButton: React.FunctionComponent<{
	disabled?: boolean;
	onClick?: () => void;
	icon: string;
	iconColor?: string;
	isActive?: boolean;
	label: string;
}> = ({disabled, icon, iconColor, isActive, label, onClick}) => {
	return (
		<StyledButtonWrapper>
			<StyledToolbarButton onClick={onClick} isActive={isActive} disabled={disabled}>
				<Icon icon={icon} color={iconColor} />
			</StyledToolbarButton>
			<StyledButtonLabel>{label}</StyledButtonLabel>
		</StyledButtonWrapper>
	);
};
