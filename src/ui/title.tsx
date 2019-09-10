import React from "react";
import styled from "styled-components";

const StyledTitle = styled.h3`
	border-bottom: 1px solid hsla(0, 0%, 100%, 0.1);
	font-weight: normal;
	font-size: 12px;
	margin: 0;
	padding: 6px 0;
	text-align: center;
	color: hsla(0, 0%, 100%, 0.75);
`;
export const Title: React.FunctionComponent = ({children}) => <StyledTitle>{children}</StyledTitle>;
