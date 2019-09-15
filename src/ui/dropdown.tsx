import React from "react";
import styled from "styled-components";
import {remote} from "electron";

export const DropShadow = () => (
	<filter id="dropshadow" height="150%">
		<feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
		{/*
		<feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur2" />
		*/}
		<feColorMatrix
			in="blur"
			result="blurAlpha"
			type="matrix"
			values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0 "
		/>
		{/*
		<feColorMatrix
			in="blur2"
			result="blurAlpha2"
			type="matrix"
			values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.75 0 "
		/>
		*/}
		<feOffset in="blurAlpha" dx="0" dy="0" result="offsetBlur" />
		{/*
		<feOffset in="blurAlpha2" dx="0" dy="2" result="offsetBlur2" />
		*/}
		<feMerge>
			<feMergeNode in="offsetBlur" />
			{/*<feMergeNode in="offsetBlur2" />*/}
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
);

//function polarToCartesian(
//	centerX: number,
//	centerY: number,
//	radius: number,
//	angleInDegrees: number
//) {
//	const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
//	return {
//		x: centerX + radius * Math.cos(angleInRadians),
//		y: centerY + radius * Math.sin(angleInRadians)
//	};
//}

//function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number, dir: number = 0) {
//	const start = polarToCartesian(x, y, radius, endAngle);
//	const end = polarToCartesian(x, y, radius, startAngle);
//	const arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
//	return [
//		"L",
//		start.x,
//		start.y,
//		"A",
//		radius,
//		radius,
//		0,
//		arcSweep,
//		dir,
//		end.x,
//		end.y
//	].join(" ");
//}

const createD = (width: number, height: number, tipOffset: number = 0): string => {
	//const radius = 16;
	//const cornerRadius = 6;
	//const tipRadius = 3;
	//const tipDiff = tipRadius * tipRadius * Math.PI;
	//const tipStartAngle = 90 + tipDiff;
	//const tipEndAngle = 270 - tipDiff;
	//return [
	//	`M ${cornerRadius} ${radius}`,
	//	describeArc(width / 2 - radius - tipRadius, 0, radius, tipStartAngle, 180),
	//	describeArc(width / 2, tipRadius, tipRadius, 90, 270, 1),
	//	describeArc(width / 2 + radius + tipRadius, 0, radius, 180, tipEndAngle),
	//	describeArc(width, radius, cornerRadius, 180, 270, 1),
	//	describeArc(width, height, cornerRadius, 270, 360, 1),
	//	describeArc(0, height, cornerRadius, 0, 90, 1),
	//	describeArc(0, radius, cornerRadius, 90, 180, 1),
	//].join(" ");

	const centerX = width / 2;
	const tY = 12.5;
	const tX = 11;
	const tR = 1;
	const XX = 3;
	const YY = 2;
	const cR = 6;

	const tO = tipOffset;

	return [
		// Top Left corner
		"M",
		[0, tY + cR],
		"C",
		[0, tY + cR, 0, tY, cR, tY],
		// Top Left
		"L",
		[centerX + tO - tX - XX, tY],
		// Left Tip corner
		"C",
		[centerX + tO - tX - XX, tY, centerX + tO - tX, tY, centerX + tO - tX + YY, tY - YY],
		// Tip
		"L",
		[centerX + tO - tR, tR],
		"C",
		[centerX + tO - tR, tR, centerX + tO, 0, centerX + tO + tR, tR],
		"L",
		[centerX + tO + tX - YY, tY - YY],
		// Right Tip corner
		"C",
		[centerX + tO + tX - YY, tY - YY, centerX + tO + tX, tY, centerX + tO + tX + XX, tY],
		// Top Right
		"L",
		[width - cR, tY],
		// Top Right corner
		"C",
		[width - cR, tY, width, tY, width, tY + cR],
		// Right corner
		"L",
		[width, height - cR],
		// Bottom Right corner
		"C",
		[width, height - cR, width, height, width - cR, height],
		// Bottom
		"L",
		[cR, height],
		// Bottom Left corner
		"C",
		[cR, height, 0, height, 0, height - cR],
		// Left
		"L",
		[0, tY + cR]
	]
		.map(x => (Array.isArray(x) ? x.join(",") : x))
		.join(" ");
};
const DropdownContent = styled.div<{
	onPointerOver: (e: React.PointerEvent) => void;
	onPointerOut: (e: React.PointerEvent) => void;
}>`
	position: relative;
	max-width: 260px;
	margin: 12px 0 0;
	border-radius: 6px;
	overflow: hidden;
	pointer-events: all;
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
	border-bottom: 1px solid ${props => props.theme.dropdown.borderColor};
`;

const DropdownWrapper = styled.div<{isVisible?: boolean; tipOffset?: number; standAlone?: boolean}>`
	display: flex;
	position: absolute;
	z-index: 10;
	top: ${props => (props.standAlone ? "1px" : "100%")};
	left: ${props =>
		props.standAlone ? "1px" : props.tipOffset ? `${-1 * props.tipOffset + 35}px` : "35px"};
	transform: ${props => (props.standAlone ? "none" : "translate(-50%, -7.5px)")};
	visibility: ${props => (props.isVisible ? "visible" : "hidden")};
	pointer-events: none;
`;

const StyledSvg = styled.svg`
	position: absolute;
	top: 0;
	left: 0;
	overflow: visible;
`;

const StyledPath = styled.path<{
	onPointerOver: (e: React.PointerEvent) => void;
	onPointerOut: (e: React.PointerEvent) => void;
}>`
	vector-effect: non-scaling-stroke;
	fill-rule: nonzero;
	fill: ${props => props.theme.dropdown.background};
	stroke: ${props => props.theme.dropdown.borderColor};
	stroke-width: 1;
	pointer-events: all;
	filter: url(#dropshadow);
`;

export const Dropdown: React.ForwardRefExoticComponent<any> = React.forwardRef(
	({children, standAlone, ...props}, ref) => {
		const [dimensions, setDimensions] = React.useState<{width: number; height: number}>({
			width: 0,
			height: 0
		});
		const contentRef = React.useRef<HTMLDivElement>();
		React.useEffect(() => {
			if (contentRef.current) {
				const {
					height,
					width
				} = (contentRef.current as HTMLDivElement).getBoundingClientRect();
				setDimensions({width, height: height + 12});
			}
		}, [contentRef, children, standAlone]);

		const clickThrough = React.useCallback(
			(e: React.PointerEvent) => {
				if (standAlone) {
					remote.getCurrentWindow().setIgnoreMouseEvents(true, {forward: true});
				}
			},
			[standAlone]
		);
		const clickInside = React.useCallback(
			(e: React.PointerEvent) => {
				if (standAlone) {
					remote.getCurrentWindow().setIgnoreMouseEvents(false);
				}
			},
			[standAlone]
		);
		return (
			<DropdownWrapper
				ref={ref as React.Ref<HTMLDivElement>}
				isVisible={props.isVisible}
				standAlone={standAlone}
				tipOffset={props.tipOffset}>
				{(props.isVisible || standAlone) && (
					<StyledSvg
						viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
						height={dimensions.height}
						width={dimensions.width}>
						<StyledPath
							onPointerOver={clickInside}
							onPointerOut={clickThrough}
							d={createD(dimensions.width, dimensions.height, props.tipOffset)}
						/>
					</StyledSvg>
				)}
				<DropdownContent
					ref={contentRef as React.RefObject<any>}
					onPointerOver={clickInside}
					onPointerOut={clickThrough}>
					{props.title && <DropdownTitle>{props.title}</DropdownTitle>}
					<DropdownScroller>{children}</DropdownScroller>
				</DropdownContent>
			</DropdownWrapper>
		);
	}
);
