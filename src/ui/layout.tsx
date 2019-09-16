import React from "react";
import styled, {css} from "styled-components";

export const Flexbox = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(${props => React.Children.count(props.children)}, 1fr);
	grid-gap: 5px;
	justify-items: stretch;
`;

export const Flex = styled.div`
	flex: 1;
`;

export const Box = styled.div`
	padding: 10px;
`;

export const Separator = styled.div`
	margin: 10px;
	height: 1px;
	background: ${props => props.theme.sidebar.borderColor2};
`;

const StyledSidebar = styled.aside`
	overflow: visible;
	${({theme}) => css`
		background: ${theme.sidebar.background1};
		color: ${theme.sidebar.color};
	`}
`;
const StyledSidebarLeft = styled(StyledSidebar)`
	${({theme}) => css`
		border-right: 1px solid ${theme.sidebar.borderColor1};
	`};
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
	grid-area: SidebarLeft;
`;
const StyledSidebarRight = styled(StyledSidebar)`
	${({theme}) => css`
		border-left: 1px solid ${theme.sidebar.borderColor1};
	`};
	grid-area: SidebarRight;
`;

export const StyledSidebarTitle = styled.h3`
	display: flex;
	margin: 0;
	height: 2em;
	font-size: 14px;
	font-weight: bold;
	align-items: center;
	align-content: center;
	justify-content: center;
	text-align: center;
	border-bottom: 1px solid ${props => props.theme.sidebar.borderColor2};
`;
export const StyledSidebarSubtitle = styled.h3`
	display: flex;
	margin: 0;
	padding-bottom: 10px;
	font-size: 12px;
	font-weight: normal;
	align-items: center;
	align-content: center;
`;

export const Sidebar: React.FunctionComponent = ({children}) => (
	<StyledSidebarRight>{children}</StyledSidebarRight>
);
export const Navigator: React.FunctionComponent = ({children}) => (
	<StyledSidebarLeft>{children}</StyledSidebarLeft>
);
const StyledMain = styled.main`
	position: relative;
	grid-area: Main;
	overflow: auto;
	-webkit-overflow-scrolling: touch;
	${props => css`
		background: ${props.theme.main.background};
		color: ${props.theme.main.color};
	`}
`;
export const Main: React.FunctionComponent = ({children}) => <StyledMain>{children}</StyledMain>;

const StyledView = styled.div<{zoomLevel: number}>`
	position: relative;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	min-height: 100%;
	min-width: 100%;
	${props => css`
		width: ${props.zoomLevel * 1200}px;
		height: ${props.zoomLevel * 800}px;
	`}
`;
export const View: React.FunctionComponent<{zoomLevel: number}> = ({children, zoomLevel}) => (
	<StyledView zoomLevel={zoomLevel}>{children}</StyledView>
);

const StyledLayout = styled.div<{sidebarLeft?: boolean; sidebarRight?: boolean}>`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid-template-areas: "Header Header Header" ${props =>
			`"${props.sidebarLeft ? "SidebarLeft" : "Main"} Main ${
				props.sidebarRight ? "SidebarRight" : "Main"
			}"`};
	grid-template-columns: 200px 1fr 270px;
	grid-template-rows: auto 1fr;
`;

export const Layout: React.FunctionComponent<{sidebarLeft?: boolean; sidebarRight?: boolean}> = ({
	children,
	sidebarLeft,
	sidebarRight
}) => (
	<StyledLayout sidebarLeft={sidebarLeft} sidebarRight={sidebarRight}>
		{children}
	</StyledLayout>
);
