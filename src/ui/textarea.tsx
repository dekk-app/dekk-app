import React from "react";
import styled from "styled-components";

const StyledTextarea = styled.textarea`
	height: 100%;
	width: 100%;
	border: 0;
	font-size: inherit;
	background: none;
	color: inherit;
	resize: none;
	overflow: hidden;
	text-align: center;
`;

export const Textarea: React.FunctionComponent = props => <StyledTextarea {...props} />;
