import {MouseHandler, PositionModel, RotationModel, SizeModel} from "./types";
import React from "react";
import {coordinatesToDeg, withRotation} from "./utils";
import {resizeClasses} from "./cursors";

export const useResize = (initialSize: SizeModel) => {
	const [size, setSize] = React.useState<SizeModel>(initialSize);
	return [size, setSize] as [
		SizeModel,
		(s: SizeModel | ((state: SizeModel) => SizeModel)) => void
	];
};
export const useReposition = (initialPosition: PositionModel) => {
	const [position, setPosition] = React.useState<PositionModel>(initialPosition);
	return [position, setPosition] as [
		PositionModel,
		(p: PositionModel | ((state: PositionModel) => PositionModel)) => void
	];
};
export const useRotate = (initialRotation: RotationModel) => {
	const [rotation, setRotation] = React.useState<RotationModel>(initialRotation);
	return [rotation, setRotation] as [
		RotationModel,
		(r: RotationModel | ((state: RotationModel) => RotationModel)) => void
	];
};
export const useMouseMove = (
	onMouseUp: MouseHandler,
	onMouseMove: MouseHandler,
	scale: number,
	contentRef?: React.RefObject<HTMLElement>,
	rotation?: RotationModel
) => {
	const [isDown, setDown] = React.useState(false);
	const [initialPosition, setInitialPosition] = React.useState<PositionModel>({
		x: 0,
		y: 0
	});
	React.useEffect(() => {
		const handleMouseUp = (event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				setDown(false);
				onMouseUp(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		};
		const handleMouseMove = (event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				onMouseMove(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		};
		document.addEventListener("mouseleave", handleMouseUp);
		window.addEventListener("mouseup", handleMouseUp);
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			window.removeEventListener("mouseup", handleMouseUp);
			window.removeEventListener("mousemove", handleMouseMove);
		};
	});
	const handleDown = (event: React.MouseEvent<HTMLElement>) => {
		if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
			event.preventDefault();
			setDown(true);
			setInitialPosition({x: event.clientX, y: event.clientY});
			if (contentRef && contentRef.current) {
				const {pageX, pageY} = event;
				const {left, top, width, height} = contentRef.current.getBoundingClientRect();
				const pointer = {x: pageX - left, y: pageY - top};
				const center = {x: width / 2, y: height / 2};
				const deg = coordinatesToDeg(pointer, center);
				const rotationStep =
					(Math.round(deg / 45) + resizeClasses.length) % resizeClasses.length;
				document.body.className = resizeClasses[rotationStep];
			}
		}
	};
	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
export const useHandle = ({
	setSize,
	setInitialSize,
	setPosition,
	setInitialPosition,
	handleSize,
	handlePosition,
	scale,
	rotation,
	contentRef
}: {
	setSize: (s: SizeModel | ((state: SizeModel) => SizeModel)) => void;
	setInitialSize: (s: SizeModel | ((state: SizeModel) => SizeModel)) => void;
	setPosition: (p: PositionModel | ((state: PositionModel) => PositionModel)) => void;
	setInitialPosition: (p: PositionModel | ((state: PositionModel) => PositionModel)) => void;
	handleSize: (
		p: PositionModel,
		altKey: boolean,
		shiftKey: boolean
	) => (s: SizeModel) => SizeModel;
	handlePosition: (
		p: PositionModel,
		altKey: boolean,
		shiftKey: boolean
	) => (p: PositionModel) => PositionModel;
	scale: number;
	rotation?: RotationModel;
	contentRef?: React.RefObject<HTMLElement>;
}) => {
	const [isDown, setDown] = useMouseMove(
		(position: PositionModel, altKey: boolean, shiftKey: boolean) => {
			setSize(handleSize(position, altKey, shiftKey));
			setInitialSize(handleSize(position, altKey, shiftKey));
			setPosition(handlePosition(position, altKey, shiftKey));
			setInitialPosition(handlePosition(position, altKey, shiftKey));
			document.body.className = "";
		},
		(position: PositionModel, altKey: boolean, shiftKey: boolean, event) => {
			setSize(handleSize(position, altKey, shiftKey));
			setPosition(handlePosition(position, altKey, shiftKey));
		},
		scale,
		contentRef,
		rotation
	);
	return [isDown, setDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
export const useMouseMoveEvent = (
	onMouseUp: (event: MouseEvent) => void,
	onMouseMove: (event: MouseEvent) => void,
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => void,
	scale: number
) => {
	const [isDown, setDown] = React.useState(false);

	React.useEffect(() => {
		const handleMouseUp = (event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				setDown(false);
				onMouseUp(event);
			}
		};
		const handleMouseMove = (event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				onMouseMove(event);
			}
		};
		document.addEventListener("mouseleave", handleMouseUp);
		document.addEventListener("mouseup", handleMouseUp);
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			document.removeEventListener("mouseup", handleMouseUp);
			document.removeEventListener("mousemove", handleMouseMove);
		};
	});
	const handleDown = (event: React.MouseEvent<HTMLElement>) => {
		if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
			event.preventDefault();
			onMouseDown(event);
			setDown(true);
		}
	};
	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
export const useMeta = () => {
	const [metaKey, setMetaKey] = React.useState(false);
	const [isDown, setDown] = React.useState(false);
	React.useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Meta") {
				setMetaKey(true);
			}
		};
		const handleKeyUp = (e: KeyboardEvent) => {
			if (e.key === "Meta") {
				setMetaKey(false);
				if (!isDown) {
					document.body.className = "";
				}
			}
		};
		const handleVisibility = () => {
			setDown(false);
			setMetaKey(false);
			document.body.className = "";
		};
		document.addEventListener("visibilitychange", handleVisibility);
		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibility);
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [setMetaKey, isDown]);
	return [metaKey, setDown] as [boolean, (d: boolean | ((state: boolean) => boolean)) => void];
};
