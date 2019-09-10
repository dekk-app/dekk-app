import styled, {css} from "styled-components";
import React from "react";
import {resizeCursors, rotationCursors} from "./cursors";

const Handle = styled.a.attrs(() => ({
	href: "#",
	onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
	}
}))<{ metaKey?: boolean; rotationSlice: number }>`
	position: absolute;
	z-index: 2;
	cursor: ${props => {
	const rotationSlice = rotationCursors[props.rotationSlice];
	const resizeSlice = resizeCursors[props.rotationSlice];
	return props.metaKey
		? `-webkit-image-set(url("${rotationSlice["1x"]}") 1x, url("${rotationSlice["2x"]}") 2x) 9 9, row-resize;`
		: resizeSlice;
}};
	&::before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		height: 5px;
		width: 5px;
		transform: translate(-50%, -50%);
		background: white;
		box-shadow: 0 0 0 1px black;
		pointer-events: none;
	}
`;
export const HandleTop = styled(Handle)`
	top: -10px;
	left: 50%;
	margin-left: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleRight = styled(Handle)`
	right: -10px;
	top: 50%;
	margin-top: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleLeft = styled(Handle)`
	left: -10px;
	top: 50%;
	margin-top: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleBottom = styled(Handle)`
	bottom: -10px;
	left: 50%;
	margin-left: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleTopLeft = styled(Handle)`
	top: -10px;
	left: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleTopRight = styled(Handle)`
	top: -10px;
	right: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleBottomLeft = styled(Handle)`
	bottom: -10px;
	left: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleBottomRight = styled(Handle)`
	bottom: -10px;
	right: -10px;
	height: 20px;
	width: 20px;
`;
export const Handles = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	box-shadow: 0 0 0 1px hsla(200, 100%, 25%, 0.75);
	${Handle} {
		visibility: visible;
	}
`;
export const Wrapper = styled.div<{ draggable?: boolean; resizable?: boolean }>`
	z-index: 0;
	position: absolute;
	top: 0;
	left: 0;
	display: inline-flex;
	vertical-align: top;
`;
export const Content = styled.div`
	flex: 1;
	z-index: 1;
	max-width: 100%;
	max-height: 100%;
	${props =>
	props.onMouseDown &&
	css`
			cursor: move;
		`};
`;
