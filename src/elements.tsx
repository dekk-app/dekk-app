import styled, {css} from "styled-components";
import Dekk from "./types";

export const ALIGN_ITEMS = {
	top: "flex-start",
	bottom: "flex-end",
	middle: "center"
};

const slotMixinRaw = css<{verticalAlignment?: Dekk.VerticalAlignment}>`
	margin: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
	user-select: none;
	display: flex;
	line-height: 1.5em;

	${props =>
		props.verticalAlignment &&
		css`
			align-items: ${ALIGN_ITEMS[props.verticalAlignment]};
		`};
`;

const slotMixin = css`
	${slotMixinRaw};
	${props => css`
		&.selected {
			outline: 1px solid ${props.theme.palette.grey[300]};
		}
	`};
`;

export const StyledHeadline = styled.h1`
	${slotMixin};
	font-size: 3em;
	text-align: center;
`;

export const StyledHeadlineSmall = styled.h1`
	${slotMixin};
	font-size: 2.5em;
	text-align: center;
`;

export const StyledSubHeadline = styled.h2`
	${slotMixin};
	font-size: 2em;
	font-weight: normal;
	text-align: center;
`;

export const StyledText = styled.div`
	${slotMixin};
`;

export const StyledCaption = styled.div`
	${slotMixin};
	font-weight: bold;
`;

export const StyledCaptionRed = styled(StyledCaption)`
	color: ${props => props.theme.palette.red[500]}
`;

export const StyledQuote = styled.blockquote`
	${slotMixin};
	border-left: 10px solid ${props => props.theme.palette.red[500]};
	padding-left: 10px;
`;

export const StyledAttribution = styled.div`
	${slotMixin};
	font-style: italic;
`;

export const StyledImage = styled.img`
	${slotMixin};
	object-fit: contain;
	object-position: 50% 50%;
`;

export const StyledPre = styled.pre`
	${slotMixin};
`;

export const StyledCode = styled.code`
	${slotMixin};
	padding: 4px;
	margin: -4px 0;
	color: ${props => props.theme.palette.red[800]};
`;

export const TextAlignCenter = styled.div`
	flex: 1;
	text-align: center;
`;

export const TextAlignLeft = styled.div`
	flex: 1;
	text-align: left;
`;

export const TextAlignRight = styled.div`
	flex: 1;
	text-align: right;
`;

export const TextAlignJustify = styled.div`
	flex: 1;
	text-align: justify;
`;
