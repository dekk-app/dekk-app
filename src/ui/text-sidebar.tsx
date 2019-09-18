import React from "react";
import {connect} from "react-redux";
//import {
//	StyledAttribution,
//	StyledCaption,
//	StyledCaptionRed,
//	StyledCode,
//	StyledHeadline,
//	StyledHeadlineSmall,
//	StyledQuote,
//	StyledSubHeadline,
//	StyledText
//} from "../elements";
import {SLOT_TYPES} from "../elements";
import Dekk from "../types";
import {
	setColor as setSlotColor,
	setBackground as setSlotBackground,
	setBorder as setSlotBorder,
	setShadow as setSlotShadow,
	setType as setSlotType,
	setOpacity as setSlotOpacity,
	setProps as setSlotProps,
	setVerticalAlignment as setSlotAlignment
} from "../store/slots";
import {
	moveForward as moveSlotForward,
	moveBackward as moveSlotBackward,
	moveFirst as moveSlotFirst,
	moveLast as moveSlotLast
} from "../store/slides";

import {
	Button,
	StyledButtonWrapper,
	StyledGroupedButton,
	StyledButton,
	StyledButtonLabel
} from "./button";
import {BlockStyleControl, InlineStyleControl} from "./editor";
import {Icon} from "./icon";
import {StyledList, StyledListButton, StyledListItem} from "./list";
import {Section} from "./section";
import {Dropdown} from "./dropdown";
import {OutsideClick} from "./outside-click";
import {Tabs} from "./tabs";
import {Colorpicker} from "./colorpicker";
import {Grid, Separator, Box, StyledSidebarSubtitle} from "./layout";
import {NumberRange, StyledNumberInput} from "./text-input";
import {Select} from "./select";
// import {ColorpickerEvent, useBroadcast, useSubscribe} from "./broadcast";
// import {getPointer} from "./window-utils";

const paragraphStyles = [
	{key: "headline", label: "Title", component: "StyledHeadline"},
	{key: "headline-small", label: "Title small", component: "StyledHeadlineSmall"},
	{key: "sub-headline", label: "Subtitle", component: "StyledSubHeadline"},
	{key: "caption", label: "Caption", component: "StyledCaption"},
	{key: "caption-red", label: "Caption red", component: "StyledCaptionRed"},
	{key: "text", label: "Body", component: "StyledText"},
	{key: "code", label: "Code", component: "StyledCode"},
	{key: "quote", label: "Quote", component: "StyledQuote"},
	{key: "attribution", label: "Attribution", component: "StyledAttribution"}
];

const TextDropdown: React.ForwardRefExoticComponent<{
	onClick: (component: Dekk.SlotType) => void;
	currentSlot?: Dekk.SlotModel;
	title?: string;
	isVisible?: boolean;
}> = React.forwardRef((props, ref) => {
	return (
	<Dropdown ref={ref} isVisible={props.isVisible} title={props.title}>
		<StyledList>
			{paragraphStyles.map((type: {key: string; label: string; component: Dekk.SlotType}) => {
				const SlotType = SLOT_TYPES[type.component];

				return (
				<StyledListItem key={type.key}>
					<StyledListButton onClick={() => props.onClick(type.component)}>
						<Icon
							icon={
								props.currentSlot && props.currentSlot.type === type.component
									? "check"
									: "empty"
							}
						/>
						<SlotType>{type.label}</SlotType>
					</StyledListButton>
				</StyledListItem>
			)})}
		</StyledList>
	</Dropdown>
)});

const TextSidebarImpl = (props: Dekk.SidebarProps) => {
	const currentSlot = props.slots.find(slot => slot.uuid === props.currentSlot);
	const [withDropdown, setDropdown] = React.useState(false);

	return (
		<Tabs
			defaultActive={1}
			tabs={[
				{
					label: "Style",
					uuid: "text__style",
					content: (
						<React.Fragment>
							<Section>Shape styles</Section>
							<Box>
								<StyledSidebarSubtitle>Fill</StyledSidebarSubtitle>
								<Colorpicker
									value={(currentSlot as Dekk.SlotModel).format.background}
									propPath={`${
										(currentSlot as Dekk.SlotModel).uuid
									}.format.background`}
									onChange={colorValue =>
										currentSlot &&
										props.setSlotBackground(currentSlot.uuid, colorValue)
									}
								/>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Border</StyledSidebarSubtitle>
								<Grid>
									<Select
										value={(currentSlot as Dekk.SlotModel).format.border.style}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
											const {value} = e.target;
											if (currentSlot) {
												props.setSlotBorder(currentSlot.uuid, {
													style: value as Dekk.BorderStyle
												});
											}
										}}
										options={[
											{label: "none", value: "none"},
											{label: "dotted", value: "dotted"},
											{label: "dashed", value: "dashed"},
											{label: "solid", value: "solid"}
										]}
									/>
									<Colorpicker
										value={(currentSlot as Dekk.SlotModel).format.border.color}
										propPath={`${
											(currentSlot as Dekk.SlotModel).uuid
										}.format.border.color`}
										onChange={colorValue =>
											currentSlot &&
											props.setSlotBorder(currentSlot.uuid, {
												color: colorValue
											})
										}
									/>
									<StyledNumberInput
										min={0}
										max={100}
										step={1}
										value={(currentSlot as Dekk.SlotModel).format.border.width}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
											const {value} = e.target;
											if (currentSlot) {
												props.setSlotBorder(currentSlot.uuid, {
													width: parseInt(value, 10)
												});
											}
										}}
									/>
								</Grid>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Shadow</StyledSidebarSubtitle>
								<Colorpicker
									value={(currentSlot as Dekk.SlotModel).format.shadow.color}
									propPath={`${
										(currentSlot as Dekk.SlotModel).uuid
									}.format.shadow.color`}
									onChange={colorValue =>
										currentSlot &&
										props.setSlotShadow(currentSlot.uuid, {
											color: colorValue
										})
									}
								/>
								<NumberRange
									label="Opacity"
									min={0}
									max={1}
									step={0.05}
									value={(currentSlot as Dekk.SlotModel).format.shadow.alpha}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											props.setSlotShadow(currentSlot.uuid, {
												alpha: parseFloat(value)
											});
										}
									}}
								/>
								<NumberRange
									label="Blur"
									min={0}
									max={100}
									step={1}
									value={(currentSlot as Dekk.SlotModel).format.shadow.blur}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											props.setSlotShadow(currentSlot.uuid, {
												blur: parseFloat(value)
											});
										}
									}}
								/>
								<NumberRange
									label="Spread"
									min={0}
									max={100}
									step={1}
									value={(currentSlot as Dekk.SlotModel).format.shadow.spread}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											props.setSlotShadow(currentSlot.uuid, {
												spread: parseFloat(value)
											});
										}
									}}
								/>
								<NumberRange
									label="Offset X"
									min={0}
									max={100}
									step={1}
									value={(currentSlot as Dekk.SlotModel).format.shadow.offset.x}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											const {y} = currentSlot.format.shadow.offset;
											props.setSlotShadow(currentSlot.uuid, {
												offset: {
													y,
													x: parseInt(value, 10)
												}
											});
										}
									}}
								/>
								<NumberRange
									label="Offset Y"
									min={0}
									max={100}
									step={1}
									value={(currentSlot as Dekk.SlotModel).format.shadow.offset.y}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											const {x} = currentSlot.format.shadow.offset;
											props.setSlotShadow(currentSlot.uuid, {
												offset: {
													x,
													y: parseInt(value, 10)
												}
											});
										}
									}}
								/>
							</Box>
							<Separator />
							<Box>
								<NumberRange
									label="Opacity"
									min={0}
									max={1}
									step={0.01}
									value={(currentSlot as Dekk.SlotModel).format.opacity}
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
										const {value} = e.target;
										if (currentSlot) {
											props.setSlotOpacity(
												currentSlot.uuid,
												parseFloat(value)
											);
										}
									}}
								/>
							</Box>
							<Separator />
						</React.Fragment>
					)
				},
				{
					label: "Text",
					uuid: "text__text",
					content: (
						<React.Fragment>
							<Section>
								<StyledListButton
									onClick={e => {
										e.preventDefault();
										setDropdown(isOpen => !isOpen);
									}}>
									{currentSlot && ((SlotType) =>
										<SlotType>
											{
												(
													paragraphStyles.find(
														style =>
															style.component === currentSlot.type
													) || {
														label: null
													}
												).label
											}
										</SlotType>
									)(SLOT_TYPES[currentSlot.type])}
								</StyledListButton>
								<OutsideClick
									onOutsideClick={() => {
										if (withDropdown) {
											setDropdown(false);
										}
									}}
									componentProps={{
										isVisible: withDropdown,
										title: "Paragraph styles",
										onClick: (component: Dekk.SlotType) => {
											setDropdown(false);
											currentSlot &&
												props.setSlotType(props.currentSlot, component);
										},
										currentSlot
									}}
									component={TextDropdown}
								/>
							</Section>
							<Box>
								<StyledSidebarSubtitle>Font</StyledSidebarSubtitle>
								<StyledGroupedButton>
									<StyledButtonWrapper>
										<InlineStyleControl inlineStyle="BOLD">
											<Icon icon="formatBold" />
										</InlineStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<InlineStyleControl inlineStyle="ITALIC">
											<Icon icon="formatItalic" />
										</InlineStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<InlineStyleControl inlineStyle="STRIKETHROUGH">
											<Icon icon="formatStrikeThrough" />
										</InlineStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<InlineStyleControl inlineStyle="UNDERLINE">
											<Icon icon="formatUnderline" />
										</InlineStyleControl>
									</StyledButtonWrapper>
								</StyledGroupedButton>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Color</StyledSidebarSubtitle>
								<Colorpicker
									value={(currentSlot as Dekk.SlotModel).format.color}
									propPath={`${
										(currentSlot as Dekk.SlotModel).uuid
									}.format.color`}
									onChange={colorValue =>
										currentSlot &&
										props.setSlotColor(currentSlot.uuid, colorValue)
									}
								/>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Alignment</StyledSidebarSubtitle>
								<StyledGroupedButton>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="text-align-left">
											<Icon icon="formatAlignLeft" />
										</BlockStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="text-align-center">
											<Icon icon="formatAlignCenter" />
										</BlockStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="text-align-right">
											<Icon icon="formatAlignRight" />
										</BlockStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="text-align-justify">
											<Icon icon="formatAlignJustify" />
										</BlockStyleControl>
									</StyledButtonWrapper>
								</StyledGroupedButton>
								<br />
								<StyledGroupedButton>
									<StyledButtonWrapper>
										<StyledButton>
											<Icon icon="formatIndentDecrease" />
										</StyledButton>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<StyledButton>
											<Icon icon="formatIndentIncrease" />
										</StyledButton>
									</StyledButtonWrapper>
								</StyledGroupedButton>
								<br />
								<StyledGroupedButton>
									{([
										{key: "top", icon: "formatVerticalAlignTop"},
										{key: "middle", icon: "formatVerticalAlignCenter"},
										{key: "bottom", icon: "formatVerticalAlignBottom"}
									] as Array<{key: Dekk.VerticalAlignment; icon: string}>).map(
										(alignment: {
											key: Dekk.VerticalAlignment;
											icon: string;
										}) => (
											<StyledButtonWrapper key={alignment.key}>
												<Button
													isActive={
														currentSlot &&
														currentSlot.verticalAlignment ===
															alignment.key
													}
													onClick={() => {
														props.currentSlot &&
															props.setSlotAlignment(
																props.currentSlot,
																alignment.key
															);
													}}>
													<Icon icon={alignment.icon} />
												</Button>
											</StyledButtonWrapper>
										)
									)}
								</StyledGroupedButton>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Bullets & Lists</StyledSidebarSubtitle>
								<StyledGroupedButton>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="unordered-list-item">
											<Icon icon="formatListBulleted" />
										</BlockStyleControl>
									</StyledButtonWrapper>
									<StyledButtonWrapper>
										<BlockStyleControl blockType="ordered-list-item">
											<Icon icon="formatListNumbered" />
										</BlockStyleControl>
									</StyledButtonWrapper>
								</StyledGroupedButton>
							</Box>
							<Separator />
						</React.Fragment>
					)
				},
				{
					uuid: "text__arrange",
					label: "Arrange",
					content: (
						<React.Fragment>
							<Box>
								<Grid>
									<StyledGroupedButton>
										<StyledButtonWrapper>
											<StyledButton
												onClick={() =>
													props.moveSlotFirst(
														props.currentSlide,
														props.currentSlot
													)
												}>
												<Icon icon="arrangeBringToFront" />
											</StyledButton>
											<StyledButtonLabel>Front</StyledButtonLabel>
										</StyledButtonWrapper>
										<StyledButtonWrapper>
											<StyledButton
												onClick={() =>
													props.moveSlotLast(
														props.currentSlide,
														props.currentSlot
													)
												}>
												<Icon icon="arrangeSendToBack" />
											</StyledButton>
											<StyledButtonLabel>Back</StyledButtonLabel>
										</StyledButtonWrapper>
									</StyledGroupedButton>
									<StyledGroupedButton>
										<StyledButtonWrapper>
											<StyledButton
												onClick={() =>
													props.moveSlotForward(
														props.currentSlide,
														props.currentSlot
													)
												}>
												<Icon icon="arrangeBringForwards" />
											</StyledButton>
											<StyledButtonLabel>Forward</StyledButtonLabel>
										</StyledButtonWrapper>
										<StyledButtonWrapper>
											<StyledButton
												onClick={() =>
													props.moveSlotBackward(
														props.currentSlide,
														props.currentSlot
													)
												}>
												<Icon icon="arrangeSendBackwards" />
											</StyledButton>
											<StyledButtonLabel>Backward</StyledButtonLabel>
										</StyledButtonWrapper>
									</StyledGroupedButton>
								</Grid>
							</Box>
							<Separator />
						</React.Fragment>
					)
				}
			]}
		/>
	);
};
export const TextSidebar = connect(
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
)(TextSidebarImpl);
