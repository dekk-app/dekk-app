import React from "react";
import {DnrProps, PositionModel, RotationModel, SizeModel, SnapHandler} from "./types";
import {
	coordinatesToDeg,
	to360,
	withAlt,
	withAspectRatio,
	withRotation
} from "./utils";
import {resizeCursors, rotationClasses} from "./cursors";
import {
	useHandle,
	useMeta,
	useMouseMove,
	useMouseMoveEvent,
	useReposition,
	useResize,
	useRotate
} from "./hooks";
import {
	Content,
	HandleBottom,
	HandleBottomLeft,
	HandleBottomRight,
	HandleLeft,
	HandleRight,
	Handles,
	HandleTop,
	HandleTopLeft,
	HandleTopRight,
	Wrapper
} from "./elements";

export const DnR: React.FunctionComponent<DnrProps> = props => {
	const [loaded, setLoaded] = React.useState(false);
	const contentRef = React.useRef<HTMLElement>();
	const [initialSize, setInitialSize] = useResize(props.size as SizeModel);
	const [size, setSize] = useResize(initialSize as SizeModel);
	const [initialPosition, setInitialPosition] = useReposition(props.position as PositionModel);
	const [position, setPosition] = useReposition(initialPosition as PositionModel);
	const [initialRotation, setInitialRotation] = useRotate(props.rotation as RotationModel);
	const [additionalAngle, setAdditionalAngle] = useRotate(props.rotation as RotationModel);
	const [rotation, setRotation] = useRotate(initialRotation as RotationModel);
	const [metaKey, setRotationMetaDown] = useMeta();

	const withSnap = React.useCallback(props.snap as SnapHandler, [props.snap]);

	const onDrag = React.useCallback(() => {
		props.onDrag && props.onDrag({position, rotation, size});
	}, [props.onDrag, size, position, rotation]);
	const onDragStart = React.useCallback(() => {
		props.onDragStart && props.onDragStart({position, rotation, size});
	}, [props.onDragStart, size, position, rotation]);
	const onDragEnd = React.useCallback(() => {
		props.onDragEnd && props.onDragEnd({position, rotation, size});
	}, [props.onDragEnd, size, position, rotation]);

	const onResize = React.useCallback(() => {
		props.onResize && props.onResize({position, rotation, size});
	}, [props.onResize, size, position, rotation]);
	const onResizeStart = React.useCallback(() => {
		props.onResizeStart && props.onResizeStart({position, rotation, size});
	}, [props.onResizeStart, size, position, rotation]);
	const onResizeEnd = React.useCallback(() => {
		props.onResizeEnd && props.onResizeEnd({position, rotation, size});
	}, [props.onResizeEnd, size, position, rotation]);

	const onRotate = React.useCallback(() => {
		props.onRotate && props.onRotate({position, rotation, size});
	}, [props.onRotate, size, position, rotation]);
	const onRotateStart = React.useCallback(() => {
		props.onRotateStart && props.onRotateStart({position, rotation, size});
	}, [props.onRotateStart, size, position, rotation]);
	const onRotateEnd = React.useCallback(() => {
		props.onRotateEnd && props.onRotateEnd({position, rotation, size});
	}, [props.onRotateEnd, size, position, rotation]);

	const [isTopDown, setTopDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			return {
				height: initialSize.height - withAlt(y, altKey),
				width: shiftKey
					? withAspectRatio(initialSize.height - withAlt(y, altKey), initialSize)
					: state.width
			};
		},
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			const d = withRotation(0, y, rotation.z);
			return {
				x: initialPosition.x - (altKey ? 0 : d.x / 2),
				y: initialPosition.y + (altKey ? 0 : d.y / 2)
			};
		}
	});

	const [isRightDown, setRightDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => (
			state: SizeModel
		) => ({
			width: initialSize.width + withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
				: state.height
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => (
			state: PositionModel
		) => {
			const d = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x + (altKey ? 0 : d.x / 2),
				y: initialPosition.y - (altKey ? 0 : d.y / 2)
			};
		}
	});

	const [isBottomDown, setBottomDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => ({
			height: initialSize.height + withAlt(y, altKey),
			width: shiftKey
				? withAspectRatio(initialSize.height + withAlt(y, altKey), initialSize)
				: state.width
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			const d = withRotation(0, y, rotation.z);
			return {
				x: initialPosition.x - (altKey ? 0 : d.x / 2),
				y: initialPosition.y + (altKey ? 0 : d.y / 2)
			};
		}
	});

	const [isLeftDown, setLeftDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => ({
			width: initialSize.width - withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
				: state.height
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			const d = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x + (altKey ? 0 : d.x / 2),
				y: initialPosition.y - (altKey ? 0 : d.y / 2)
			};
		}
	});

	const [isTopLeftDown, setTopLeftDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => () => ({
			width: initialSize.width - withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
				: initialSize.height - withAlt(y, altKey)
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			if (altKey) {
				return state;
			}
			const d = withRotation(
				0,
				shiftKey
					? initialSize.height - withAspectRatio(initialSize.width - x, initialSize, true)
					: y,
				rotation.z
			);
			const e = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x - d.x / 2 + e.x / 2,
				y: initialPosition.y + d.y / 2 - e.y / 2
			};
		}
	});

	const [isTopRightDown, setTopRightDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => () => ({
			width: initialSize.width + withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
				: initialSize.height - withAlt(y, altKey)
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			if (altKey) {
				return state;
			}
			const d = withRotation(
				0,
				shiftKey
					? initialSize.height -
					withAspectRatio(initialSize.width + x, initialSize, true)
					: y,
				rotation.z
			);
			const e = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x - d.x / 2 + e.x / 2,
				y: initialPosition.y + d.y / 2 - e.y / 2
			};
		}
	});

	const [isBottomLeftDown, setBottomLeftDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => () => ({
			width: initialSize.width - withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
				: initialSize.height + withAlt(y, altKey)
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			if (altKey) {
				return state;
			}
			const d = withRotation(
				0,
				shiftKey
					? initialSize.height -
					withAspectRatio(initialSize.width + x, initialSize, true)
					: y,
				rotation.z
			);
			const e = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x - d.x / 2 + e.x / 2,
				y: initialPosition.y + d.y / 2 - e.y / 2
			};
		}
	});

	const [isBottomRightDown, setBottomRightDown] = useHandle({
		setSize,
		setInitialSize,
		setPosition,
		setInitialPosition,
		scale: props.scale as number,
		rotation,
		contentRef: contentRef as React.RefObject<HTMLElement>,
		handleSize: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => () => ({
			width: initialSize.width + withAlt(x, altKey),
			height: shiftKey
				? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
				: initialSize.height + withAlt(y, altKey)
		}),
		handlePosition: ({x, y}: PositionModel, altKey: boolean, shiftKey: boolean) => state => {
			if (altKey) {
				return state;
			}
			const d = withRotation(
				0,
				shiftKey
					? initialSize.height -
					withAspectRatio(initialSize.width - x, initialSize, true)
					: y,
				rotation.z
			);
			const e = withRotation(x, 0, rotation.z);
			return {
				x: initialPosition.x - d.x / 2 + e.x / 2,
				y: initialPosition.y + d.y / 2 - e.y / 2
			};
		}
	});
	const [isDown, setDown] = useMouseMove(
		({x, y}: PositionModel) => {
			const newPosition = {
				x: initialPosition.x + x,
				y: initialPosition.y + y
			};
			const shouldSnap = withSnap({position: newPosition, size, rotation});
			const finalPosition = shouldSnap
				? {...newPosition, ...(shouldSnap as PositionModel)}
				: newPosition;
			setPosition(finalPosition);
			setInitialPosition(finalPosition);
		},
		({x, y}: PositionModel) => {
			const newPosition = {
				x: initialPosition.x + x,
				y: initialPosition.y + y
			};
			const shouldSnap = withSnap({position: newPosition, size, rotation});
			const finalPosition = shouldSnap
				? {...newPosition, ...(shouldSnap as PositionModel)}
				: newPosition;
			setPosition(finalPosition);
		},
		props.scale as number
	);
	const [isRotationDown, setRotationDown] = useMouseMoveEvent(
		(event: MouseEvent) => {
			if (contentRef.current) {
				const {pageX, pageY} = event;
				const {left, top, width, height} = contentRef.current.getBoundingClientRect();
				const pointer = {x: pageX - left, y: pageY - top};
				const center = {x: width / 2, y: height / 2};
				const deg = coordinatesToDeg(pointer, center);
				const newRotationZ = to360(initialRotation.z + (deg - additionalAngle.z));
				const newRotation = (state: RotationModel) => ({
					x: state.x,
					y: state.y,
					z: event.shiftKey ? Math.round(newRotationZ / 15) * 15 : newRotationZ
				});
				setRotation(newRotation);
				setInitialRotation(newRotation);
				document.body.className = "";
			}
		},
		(event: MouseEvent) => {
			if (contentRef.current) {
				const {pageX, pageY} = event;
				const {left, top, width, height} = contentRef.current.getBoundingClientRect();
				const pointer = {x: pageX - left, y: pageY - top};
				const center = {x: width / 2, y: height / 2};
				const deg = coordinatesToDeg(pointer, center);
				const newRotationZ = to360(initialRotation.z + (deg - additionalAngle.z));
				const newRotation = (state: RotationModel) => ({
					x: state.x,
					y: state.y,
					z: event.shiftKey ? Math.round(newRotationZ / 15) * 15 : newRotationZ
				});
				setRotation(newRotation);
				const rotationStep =
					(Math.round(deg / 45) + rotationClasses.length) % rotationClasses.length;
				document.body.className = rotationClasses[rotationStep];
			}
		},
		(event: React.MouseEvent<HTMLElement>) => {
			if (contentRef.current) {
				const {pageX, pageY} = event;
				const {left, top, width, height} = contentRef.current.getBoundingClientRect();
				const pointer = {x: pageX - left, y: pageY - top};
				const center = {x: width / 2, y: height / 2};
				const deg = coordinatesToDeg(pointer, center);
				const additionalDeg = coordinatesToDeg(pointer, center);
				const newRotationZ = to360(initialRotation.z + (deg - additionalDeg));
				const newRotation = (state: RotationModel) => ({
					x: state.x,
					y: state.y,
					z: newRotationZ
				});
				setRotation(newRotation);
				setInitialRotation(newRotation);
				setAdditionalAngle(state => ({x: 0, y: 0, z: additionalDeg}));
				const rotationStep =
					(Math.round(deg / 45) + rotationClasses.length) % rotationClasses.length;
				document.body.className = rotationClasses[rotationStep];
			}
		},
		props.scale as number
	);
	React.useEffect(() => {
		if (contentRef.current) {
			setSize({
				height: contentRef.current.clientHeight,
				width: contentRef.current.clientWidth
			});
			setInitialSize({
				height: contentRef.current.clientHeight,
				width: contentRef.current.clientWidth
			});
		}
	}, [setSize, setInitialSize]);

	const onMouseEnter = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if (contentRef.current) {
				const {pageX, pageY} = event;
				const {left, top, width, height} = contentRef.current.getBoundingClientRect();
				const pointer = {x: pageX - left, y: pageY - top};
				const center = {x: width / 2, y: height / 2};
				const deg = coordinatesToDeg(pointer, center);
				const rotationStep =
					(Math.round(deg / 45) + rotationClasses.length) % rotationClasses.length;
				document.body.className = rotationClasses[rotationStep];
			}
		},
		[contentRef]
	);
	const onMouseLeave = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			//document.body.className = "";
		},
		[contentRef]
	);

	React.useEffect(() => {
		if (loaded) {
			if (isDown) {
				onDrag();
			} else if (
				[
					isTopDown,
					isRightDown,
					isBottomDown,
					isLeftDown,
					isTopLeftDown,
					isTopRightDown,
					isBottomLeftDown,
					isBottomRightDown
				].filter(Boolean).length
			) {
				onResize();
			} else if (isRotationDown) {
				onRotate();
			}
		}
	}, [size, position, rotation]);

	React.useEffect(() => {
		if (loaded) {
			if (isDown) {
				onDragStart();
			} else {
				onDragEnd();
			}
		}
	}, [isDown]);
	React.useEffect(() => {
		if (loaded) {
			if (
				[
					isTopDown,
					isRightDown,
					isBottomDown,
					isLeftDown,
					isTopLeftDown,
					isTopRightDown,
					isBottomLeftDown,
					isBottomRightDown
				].filter(Boolean).length
			) {
				onResizeStart();
			} else if (isRotationDown) {
				onRotateStart();
			} else if (metaKey) {
				onRotateEnd();
			} else {
				onResizeEnd();
			}
		}
	}, [
		isRotationDown,
		isTopDown,
		isRightDown,
		isBottomDown,
		isLeftDown,
		isTopLeftDown,
		isTopRightDown,
		isBottomLeftDown,
		isBottomRightDown
	]);
	React.useEffect(() => {
		setLoaded(true);
	}, [setLoaded]);

	const handleMouseDown = React.useCallback(
		e => {
			setRotationDown(e);
			setRotationMetaDown(true);
		},
		[setRotationDown, setRotationMetaDown]
	);

	const style = {
		...size,
		transform: `translate3d(${position.x}px, ${position.y}px, 0) translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${rotation.z}deg)`
	};
	return (
		<Wrapper ref={contentRef as React.RefObject<HTMLDivElement>} as={props.as} style={style}>
			{props.draggable ? (
				<Content onMouseDown={!metaKey && props.draggable ? setDown : undefined}>
					{props.children}
				</Content>
			) : (
				props.children
			)}
			{(props.resizable || props.rotatable) && (
				<Handles>
					<HandleTop
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setTopDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2) %
							resizeCursors.length
						}
					/>
					<HandleRight
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setRightDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 2) %
							resizeCursors.length
						}
					/>
					<HandleBottom
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setBottomDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 4) %
							resizeCursors.length
						}
					/>
					<HandleLeft
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setLeftDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 6) %
							resizeCursors.length
						}
					/>
					<HandleTopRight
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setTopRightDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 1) %
							resizeCursors.length
						}
					/>
					<HandleBottomRight
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setBottomRightDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 3) %
							resizeCursors.length
						}
					/>
					<HandleBottomLeft
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setBottomLeftDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 5) %
							resizeCursors.length
						}
					/>
					<HandleTopLeft
						onMouseEnter={metaKey ? onMouseEnter : undefined}
						onMouseLeave={!metaKey ? onMouseLeave : undefined}
						onMouseDown={metaKey ? handleMouseDown : setTopLeftDown}
						metaKey={metaKey}
						rotationSlice={
							(Math.round(rotation.z / 45) + resizeCursors.length * 2 + 7) %
							resizeCursors.length
						}
					/>
				</Handles>
			)}
		</Wrapper>
	);
};

DnR.defaultProps = {
	as: "div",
	snap: () => false,
	position: {
		x: 0,
		y: 0
	},
	rotation: {
		x: 0,
		y: 0,
		z: 0
	},
	size: {
		height: "auto",
		width: "auto"
	},
	scale: 1
};
