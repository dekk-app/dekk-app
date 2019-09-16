import styled from "styled-components";
import {StyledSvg} from "./icon";

export const StyledList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

export const StyledListItem = styled.li`
	margin: 0;
	padding: 0;
	list-style: none;
	border-bottom: 1px solid ${props => props.theme.button.borderColor1};
`;

export const StyledListButton = styled.button`
	display: flex;
	align-items: center;
	align-content: center;
	margin: 0;
	padding: 8px 48px 8px 8px;
	width: 100%;
	min-width: max-content;
	white-space: nowrap;
	text-align: left;
	background: none;
	color: inherit;
	font-size: 1em;
	border: 0;
	${StyledSvg} {
		margin-right: 10px;
	}
`;
