import styled, {css} from "styled-components";
import Dekk from "../types";

export const Slide = styled.div<Dekk.SlideProps>`
	position: relative;
	z-index: 0;
	height: 800px;
	width: 1200px;
	min-height: 800px;
	min-width: 1200px;
	flex: 0 0 1200px;
	${props => css`
		background: ${props.background};
		color: ${props.color};
		transform-origin: ${props.asThumb ? "0 0" : "50% 50%"};
		overflow: ${props.asThumb ? "hidden" : "visible"};
		transform: scale(${props.zoomLevel});

		${!props.asThumb &&
			css`
				&::after {
					content: "";
					position: absolute;
					z-index: 99999;
					left: 0;
					right: 0;
					top: 0;
					bottom: 0;
					box-shadow: 0 14px 28px hsla(0, 0%, 0%, 0.5), 0 10px 10px hsla(0, 0%, 0%, 0.25),
						0 0 0 50vmax hsla(0, 0%, 30%, 0.65);
					pointer-events: none;
				}
			`}
	`}
`;
