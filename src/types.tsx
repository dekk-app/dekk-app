import React from "react";
import Draft from "draft-js";

namespace Dekk {
	export type UUID = string;
	export type BorderStyle = "none" | "dashed" | "dotted" | "solid";
	export interface Border {
		enabled?: boolean;
		style: BorderStyle;
		width: number;
		color: string;
	}
	export interface Shadow {
		enabled?: boolean;
		offset: {
			x: number;
			y: number;
		};
		blur: number;
		spread: number;
		color: string;
		alpha: number;
	}
	export interface SlotFormat {
		background: string;
		color: string;
		border: Border;
		shadow: Shadow;
		opacity: number;
	}

	export interface SlideFormat {
		background: string;
	}

	export interface SlideModel {
		slots: UUID[];
		uuid: UUID;
		format: SlideFormat;
	}

	export interface SlotProps {
		[key: string]: any;
	}

	export interface SlideProps extends Partial<SlotFormat> {
		guides?: Partial<Position>;
		asThumb?: boolean;
		onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
		slide: SlideModel;
		zoomLevel: number;
		isEditable?: boolean;
		setEditable?: React.Dispatch<React.SetStateAction<boolean>>;
	}

	export interface Store {
		currentSlide: UUID;
		currentSlot: UUID;
		slides: SlideModel[];
		slots: SlotModel[];
	}

	export interface Size {
		height: number | string;
		width: number | string;
	}

	export interface Position {
		x: number;
		y: number;
	}

	export interface Snap extends Partial<Position> {
		uuid: UUID;
		x1?: number;
		x2?: number;
		y1?: number;
		y2?: number;
	}

	export interface Rotation {
		x: number;
		y: number;
		z: number;
	}

	export type SlotType = string;

	export type VerticalAlignment = "bottom" | "middle" | "top";
	export interface SlotModel<T = SlotProps> {
		// @ts-ignore
		editorState: Draft.Model.ImmutableData.EditorState;
		position: Position;
		rotation: Rotation;
		props?: T;
		size: Size;
		type: SlotType;
		uuid: string;
		value?: string;
		verticalAlignment: VerticalAlignment;
		zIndex: number;
		format: SlotFormat;
	}

	export interface ToSlotActions {
		selectSlot: (uuid: UUID) => void;
		setSlotValue: (uuid: UUID, value: string) => void;
		setSlotSize: (uuid: UUID, size: Size) => void;
		setSlotPosition: (uuid: Dekk.UUID, position: Position) => void;
		setSlotRotation: (uuid: Dekk.UUID, rotation: Rotation) => void;
		setSlotProps: (uuid: UUID, props: SlotProps) => void;
		setEditorState: (uuid: UUID, editorState: any) => void;
	}

	export interface ToSlotState {
		slots: SlotModel[];
		currentSlot: UUID;
		slides: SlideModel[];
		currentSlide: UUID;
	}

	export interface ToSlotComponentProps {
		uuid: UUID;
		asThumb?: boolean;
		zoomLevel: number;
		editorRef?: React.Ref<HTMLDivElement>;
		slideRef?: React.RefObject<HTMLDivElement>;
		isEditable?: boolean;
		setEditable?: React.Dispatch<React.SetStateAction<boolean>>;
	}

	export type ToSlotProps = ToSlotActions & ToSlotState & ToSlotComponentProps;

	export interface FrameActions {
		replaceSlides: (slides: SlideModel[]) => void;
		replaceSlots: (slides: SlotModel[]) => void;
		addSlide: (slide: SlideModel) => void;
		addSlot: (slot: SlotModel) => void;
		assignSlot: (uuid: UUID, slotId: UUID) => void;
		dischargeSlot: (uuid: UUID, slotId: UUID) => void;
		removeSlide: (uuid: UUID) => void;
		removeSlot: (uuid: UUID) => void;
		reorderSlides: (uuid: UUID, from: number, to: number) => void;
		selectSlide: (uuid: UUID) => void;
		selectSlot: (uuid: UUID) => void;
		setSlotProps: (uuid: UUID, props: SlotProps) => void;
		setSlotValue: (uuid: UUID, value: string) => void;
		setSlotType: (uuid: UUID, type: SlotType) => void;
		setSlideBackground: (uuid: UUID, background: string) => void;
		setSlotAlignment: (uuid: UUID, verticalAlignment: VerticalAlignment) => void;
		setEditorState: (uuid: UUID, state: any) => void;
	}

	export interface SidebarActions {
		setSlotProps: (uuid: UUID, props: SlotProps) => void;
		setSlotBackground: (uuid: UUID, background: string) => void;
		setSlotColor: (uuid: UUID, color: string) => void;
		setSlotBorder: (uuid: UUID, border: Partial<Dekk.Border>) => void;
		setSlotShadow: (uuid: UUID, shadow: Partial<Dekk.Shadow>) => void;
		setSlotType: (uuid: UUID, type: SlotType) => void;
		setSlotOpacity: (uuid: UUID, opacity: number) => void;
		setSlotAlignment: (uuid: UUID, verticalAlignment: VerticalAlignment) => void;
		moveSlotFirst: (uuid: UUID, slotId: UUID) => void;
		moveSlotLast: (uuid: UUID, slotId: UUID) => void;
		moveSlotForward: (uuid: UUID, slotId: UUID) => void;
		moveSlotBackward: (uuid: UUID, slotId: UUID) => void;
	}

	export interface FrameState {
		currentSlide: UUID;
		currentSlot: UUID;
		slides: SlideModel[];
		slots: SlotModel[];
	}

	export interface SidebarState {
		currentSlide: UUID;
		currentSlot: UUID;
		slides: SlideModel[];
		slots: SlotModel[];
	}

	export type FrameProps = FrameActions & FrameState;
	export type SidebarProps = SidebarActions & SidebarState;
}

export default Dekk;
