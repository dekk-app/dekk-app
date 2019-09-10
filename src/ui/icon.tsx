import React from "react";
import styled from "styled-components";
import {icons} from "./icons";

export const StyledSvg = styled.svg<{background?: string; round?: boolean}>`
	height: 1em;
	width: 1em;
	font-size: 24px;
	fill: currentColor;
	background: ${props => props.background};
	border-radius: ${props => (props.round ? "0.5em" : 0)};
`;
const StyledPath = styled.path<{fill?: string}>`
	fill: ${props => props.fill};
`;

StyledPath.defaultProps = {
	fill: "currentColor"
};
export const Icon: React.FunctionComponent<{
	icon: string;
	color?: string;
	background?: string;
	round?: boolean;
	className?: string;
}> = ({icon, color, background, round, className}) => (
	<StyledSvg viewBox="0 0 24 24" background={background} round={round} className={className}>
		<StyledPath d={icons[icon]} fill={color} />
	</StyledSvg>
);
