import {Rnd} from "react-rnd";
import styled, {css} from "styled-components";

export const Slot = styled(Rnd)`
	overflow: visible;
	${props => !props.disableDragging && css`
		* {
			user-select: none;
		}
	`};
	span:last-child {
		div::before {
				content: "";
				position: absolute;
				height: 10px;
				width:  10px;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background: white;
				border: 1px solid black;
			}
		}
	}
`;

