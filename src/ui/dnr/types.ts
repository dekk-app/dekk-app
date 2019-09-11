import React from "react";

export interface InitialSizeModel {
	height: number | string;
	width: number | string;
}

export interface SizeModel {
	height: number;
	width: number;
}

export interface PositionModel {
	x: number;
	y: number;
}

export type MouseHandler = (
	position: PositionModel,
	altKey: boolean,
	shiftKey: boolean,
	event: MouseEvent
) => void;

export interface RotationModel {
	x: number;
	y: number;
	z: number;
}

export interface BoundingBox {
	position: PositionModel;
	rotation: RotationModel;
	size: SizeModel;
}

export type SnapHandler = (b: BoundingBox) => Partial<PositionModel>;

export interface DnrProps {
	snap?: SnapHandler;
	onResize?: (b: BoundingBox) => void;
	onResizeStart?: (b: BoundingBox) => void;
	onResizeEnd?: (b: BoundingBox) => void;
	onRotate?: (b: BoundingBox) => void;
	onRotateStart?: (b: BoundingBox) => void;
	onRotateEnd?: (b: BoundingBox) => void;
	onDrag?: (b: BoundingBox) => void;
	onDragStart?: (b: BoundingBox) => void;
	onDragEnd?: (b: BoundingBox) => void;
	position?: PositionModel;
	rotation?: RotationModel;
	size?: InitialSizeModel;
	draggable?: boolean;
	resizable?: boolean;
	rotatable?: boolean;
	scale?: number;
	as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}
