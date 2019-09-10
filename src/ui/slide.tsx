import styled, {css} from "styled-components";
import Dekk from "../types";

export const Slide = styled.div<Dekk.SlideProps>`
	background: white;
	position: relative;
	z-index: 0;
	height: 800px;
	width: 1200px;
	min-height: 800px;
	min-width: 1200px;
	flex: 0 0 1200px;
	box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
	${props => css`
		background: ${props.background};
		color: ${props.color};
		transform-origin: ${props.asThumb ? "0 0" : "50% 50%"};
		transform: scale(${props.zoomLevel});
		
		${props.guides && props.guides.x && css`
			&::before {
				content: "";
				position: absolute;
				z-index: 1;
				top: 0;
				bottom: 0;
				left: ${props.guides.x}px;
				width: 2px;
				margin-left: -1px;
				background: ${props.theme.palette.amber[500]};
			}
		`};
		${props.guides && props.guides.y && css`
			&::after {
				content: "";
				position: absolute;
				z-index: 1;
				left: 0;
				right: 0;
				top: ${props.guides.y}px;
				height: 2px;
				margin-top: -1px;
				background: ${props.theme.palette.amber[500]};
			}
		`};
	`}
`;
