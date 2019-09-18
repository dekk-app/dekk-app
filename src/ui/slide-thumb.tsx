import React from "react";
import styled, {css} from "styled-components";

const StyledSlideThumb = styled.div`
	display: flex;
	height: 104px;
	width: 156px;
	background: #000;
	box-shadow: 0 0 0 1px hsla(0, 0%, 100%, 0.25);
	pointer-events: none;
`;
const StyledSlideLink = styled.div<{isActive?: boolean}>`
	padding: 8px 16px 8px 8px;
	display: flex;
	text-decoration: none;
	color: currentColor;
	user-select: none;
	${props => css`
		background: ${props.isActive ? props.theme.colors.blue : "none"};
	`}
	${StyledSlideThumb} {
		${props =>
			props.isActive &&
			css`
				box-shadow: 0 0 0 2px ${props.theme.colors.yellow};
			`};
	}
`;
const StyledSlideIndex = styled.div`
	width: 20px;
	display: flex;
	padding-right: 8px;
	align-content: flex-end;
	align-items: flex-end;
	justify-content: flex-end;
	font-size: 12px;
`;
export const SlideLink: React.ForwardRefExoticComponent<{
	ref?: React.Ref<HTMLDivElement>;
	slideIndex: number;
	onMouseDown?: (e: React.MouseEvent) => void;
	isActive?: boolean;
	children: React.ReactChild | React.ReactChild[],
	style?: React.CSSProperties
}> = React.forwardRef(({children, slideIndex, isActive, onMouseDown, ...props}, ref) => {
	const handleEvent = (e: React.MouseEvent) => {
		e.preventDefault();
		onMouseDown && onMouseDown(e);
	};
	return (
		<StyledSlideLink {...props} ref={ref} tabIndex={0} onMouseDown={handleEvent} isActive={isActive}>
			<StyledSlideIndex>{slideIndex}</StyledSlideIndex>
			<StyledSlideThumb>{children}</StyledSlideThumb>
		</StyledSlideLink>
	);
});
