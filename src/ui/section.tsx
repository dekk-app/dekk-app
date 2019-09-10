import React from "react";
import styled from "styled-components";

const StyledSection = styled.section`
	position: relative;
	padding: 12px 0;
	background: rgba(0,0,0,0.25);
	border-bottom: 1px solid ${props => props.theme.sidebar.borderColor2};
`;
export const Section: React.FunctionComponent = ({children}) =>
	<StyledSection>{children}</StyledSection>;
