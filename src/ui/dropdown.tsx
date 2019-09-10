import React from "react";
import styled from "styled-components";

function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number
) {
	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * Math.sin(angleInRadians)
	};
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, dir: number = 0) {
	const start = polarToCartesian(x, y, radius, endAngle);
	const end = polarToCartesian(x, y, radius, startAngle);
	const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
	return [
		"L",
		start.x,
		start.y,
		"A",
		radius,
		radius,
		0,
		arcSweep,
		dir,
		end.x,
		end.y
	].join(" ");
}

const createD = (width: number, height: number): string => {
	const radius = 16;
	const cornerRadius = 6;
	const tipRadius = 3;
	const tipDiff = tipRadius * tipRadius * Math.PI;
	const tipStartAngle = 90 + tipDiff;
	const tipEndAngle = 270 - tipDiff;
	return [
		`M ${cornerRadius} ${radius}`,
		describeArc(width / 2 - radius - tipRadius, 0, radius, tipStartAngle, 180),
		describeArc(width / 2, tipRadius, tipRadius, 90, 270, 1),
		describeArc(width / 2 + radius + tipRadius, 0, radius, 180, tipEndAngle),
		describeArc(width, radius, cornerRadius, 180, 270, 1),
		describeArc(width, height, cornerRadius, 270, 360, 1),
		describeArc(0, height, cornerRadius, 0, 90, 1),
		describeArc(0, radius, cornerRadius, 90, 180, 1),
	].join(" ");
};
const DropdownContent = styled.div`
	position: relative;
	max-width: 260px;
	padding: 16px 0 0;
	border-radius: 6px;
	overflow: hidden;
`;
const DropdownScroller = styled.div`
	position: relative;
	max-width: 320px;
	max-height: 400px;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
`;
const DropdownTitle = styled.div`
	padding: 4px 10px;
	border-bottom: 1px solid ${props => props.theme.dropdown.borderColor}
`;
const DropdownShadow = styled.div`
	position: absolute;
	top: 16px;
	left: 0;
	right: 0;
	bottom: 0;
	border-radius: 3px;
	box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
`;

const DropdownWrapper = styled.div<{isVisible?: boolean}>`
	display: flex;
	position: absolute;
	z-index: 10;
	top: 100%;
	left: 50%;
	transform: translate(-50%, -7.5px);
	visibility: ${props => props.isVisible ? "visible" : "hidden"};
`;

const StyledSvg = styled.svg`
	position: absolute;
	top: 0;
	left: 0;
	overflow: visible;
`;

const StyledPath = styled.path`
	vector-effect: non-scaling-stroke;
	fill-rule: nonzero;
	fill: ${props => props.theme.dropdown.background};
	stroke: ${props => props.theme.dropdown.borderColor};
	stroke-width: 1;
`;

export const Dropdown: React.ForwardRefExoticComponent<any> = React.forwardRef((props, ref) => {
	const [dimensions, setDimensions] = React.useState<{width: number; height: number}>({
		width: 0,
		height: 0
	});
	const contentRef = React.useRef<HTMLDivElement>();
	React.useEffect(() => {
		const {clientHeight, clientWidth} = contentRef.current as HTMLDivElement;
		setDimensions({width: clientWidth, height: clientHeight});
	}, [props.children]);
	return (
		<DropdownWrapper ref={ref as React.Ref<HTMLDivElement>} isVisible={props.isVisible}>
			<DropdownShadow/>
			<StyledSvg
				viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
				height={dimensions.height}
				width={dimensions.width}>
				<defs>
					<filter id="dropshadow" height="130%">
						<feGaussianBlur in="SourceAlpha" stdDeviation="2"/> // stdDeviation is how much to blur
						<feOffset dx="0" dy="0" result="offsetblur"/> // how much to offset
						<feComponentTransfer>
							<feFuncA type="linear" slope="1"/> // slope is the opacity of the shadow
						</feComponentTransfer>
						<feMerge>
							<feMergeNode/> // this contains the offset blurred image
							<feMergeNode in="SourceGraphic"/>//  this contains the element that the filter is applied to
						</feMerge>
					</filter>
				</defs>
				<StyledPath d={createD(dimensions.width, dimensions.height)} style={{filter: "url(#dropshadow)"}}/>
			</StyledSvg>
			<DropdownContent ref={contentRef as React.RefObject<any>}>
				{props.title && <DropdownTitle>{props.title}</DropdownTitle>}
				<DropdownScroller>{props.children}</DropdownScroller>
			</DropdownContent>
		</DropdownWrapper>
	);
});
