import {connect} from "react-redux";
import Dekk from "../types";
import {
	setType as setSlotType,
	setProps as setSlotProps,
	setVerticalAlignment as setSlotAlignment,
	setBackground as setSlotBackground,
	setColor as setSlotColor,
	setBorder as setSlotBorder,
	setShadow as setSlotShadow,
	setOpacity as setSlotOpacity
} from "../store/slots";
import React from "react";
import {FileInput} from "./file-input";
import {Section} from "./section";
import {
	moveBackward as moveSlotBackward,
	moveFirst as moveSlotFirst,
	moveForward as moveSlotForward,
	moveLast as moveSlotLast
} from "../store/slides";

const ImageSidebarImpl = (props: Dekk.SidebarProps) => {
	const currentSlot = props.slots.find(slot => slot.uuid === props.currentSlot);
	const handleChange = ({src, filename}: {src: string; filename: string}) => {
		props.setSlotProps(props.currentSlot, {src, filename});
	};
	const {props: slotProps = {}} = currentSlot || {};
	return (
		<Section>
			<FileInput onChange={handleChange} {...slotProps} />
		</Section>
	);
};

export const ImageSidebar = connect(
	({currentSlide, currentSlot, slides, slots}: Dekk.Store) => {
		return {currentSlide, currentSlot, slides, slots};
	},
	{
		moveSlotFirst,
		moveSlotLast,
		moveSlotForward,
		moveSlotBackward,
		setSlotAlignment,
		setSlotProps,
		setSlotBackground,
		setSlotBorder,
		setSlotShadow,
		setSlotColor,
		setSlotOpacity,
		setSlotType
	} as Dekk.SidebarActions
)(ImageSidebarImpl);
