import React from "react";
import {connect} from "react-redux";
import {
	StyledAttribution,
	StyledCaption,
	StyledCaptionRed,
	StyledCode,
	StyledHeadline,
	StyledHeadlineSmall,
	StyledQuote,
	StyledSubHeadline,
	StyledText
} from "../elements";
import Dekk from "../types";
import {
	setColor as setSlotColor,
	setBackground as setSlotBackground,
	setBorder as setSlotBorder,
	setShadow as setSlotShadow,
	setType as setSlotType,
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
import {ColorPicker} from "./color-picker";
import {Grid, Separator, Box, StyledSidebarSubtitle, Flexbox, Flex} from "./layout";
import {
	Input,
	StyledGroupedInput,
	StyledInputLabel,
	StyledInputWrapper,
	Range,
	StyledNumberInput,
	StyledRangeLabel, NumberRange
} from "./text-input";
import {Select} from "./select";

const paragraphStyles = [
	{key: "headline", label: "Title", component: StyledHeadline},
	{key: "headline-small", label: "Title small", component: StyledHeadlineSmall},
	{key: "sub-headline", label: "Subtitle", component: StyledSubHeadline},
	{key: "caption", label: "Caption", component: StyledCaption},
	{key: "caption-red", label: "Caption red", component: StyledCaptionRed},
	{key: "text", label: "Body", component: StyledText},
	{key: "code", label: "Code", component: StyledCode},
	{key: "quote", label: "Quote", component: StyledQuote},
	{key: "attribution", label: "Attribution", component: StyledAttribution}
];

const TextDropdown: React.ForwardRefExoticComponent<{
	onClick: (component: Dekk.SlotType) => void;
	currentSlot?: Dekk.SlotModel;
	title?: string;
	isVisible?: boolean;
}> = React.forwardRef((props, ref) => (
	<Dropdown ref={ref} isVisible={props.isVisible} title={props.title}>
		<StyledList>
			{paragraphStyles.map((type: {key: string; label: string; component: Dekk.SlotType}) => (
				<StyledListItem key={type.key}>
					<StyledListButton onClick={() => props.onClick(type.component)}>
						<Icon
							icon={
								props.currentSlot && props.currentSlot.type === type.component
									? "check"
									: "empty"
							}
						/>
						<type.component>{type.label}</type.component>
					</StyledListButton>
				</StyledListItem>
			))}
		</StyledList>
	</Dropdown>
));

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
								<ColorPicker
									value={(currentSlot as Dekk.SlotModel).format.background}
									onChange={colorValue =>
										currentSlot &&
										props.setSlotBackground(currentSlot.uuid, colorValue)
									}
								/>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Border</StyledSidebarSubtitle>
								<ColorPicker
									value={(currentSlot as Dekk.SlotModel).format.border.color}
									onChange={colorValue =>
										currentSlot &&
										props.setSlotBorder(currentSlot.uuid, {
											color: colorValue
										})
									}
								/>
								<StyledGroupedInput>
									<StyledInputWrapper>
										<Input
											type="number"
											value={(currentSlot as Dekk.SlotModel).format.border.width.toString()}
											onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
												const {value} = e.target;
												if (currentSlot) {
													props.setSlotBorder(currentSlot.uuid, {
														width: parseInt(value, 10)
													});
												}
											}}
										/>
										<StyledInputLabel>width</StyledInputLabel>
									</StyledInputWrapper>
									<StyledInputWrapper>
										<Select
											value={
												(currentSlot as Dekk.SlotModel).format.border.style
											}
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
										<StyledInputLabel>style</StyledInputLabel>
									</StyledInputWrapper>
								</StyledGroupedInput>
							</Box>
							<Separator />
							<Box>
								<StyledSidebarSubtitle>Shadow</StyledSidebarSubtitle>
								<ColorPicker
									value={(currentSlot as Dekk.SlotModel).format.shadow.color}
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
								<StyledGroupedInput>
									<StyledInputWrapper>
										<Input
											type="number"
											value={(currentSlot as Dekk.SlotModel).format.shadow.offset.x.toString()}
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
										<StyledInputLabel>x</StyledInputLabel>
									</StyledInputWrapper>
									<StyledInputWrapper>
										<Input
											type="number"
											value={(currentSlot as Dekk.SlotModel).format.shadow.offset.y.toString()}
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
										<StyledInputLabel>y</StyledInputLabel>
									</StyledInputWrapper>
								</StyledGroupedInput>
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
									{currentSlot && (
										<currentSlot.type>
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
										</currentSlot.type>
									)}
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
								<ColorPicker
									value={(currentSlot as Dekk.SlotModel).format.color}
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
		setSlotType
	} as Dekk.SidebarActions
)(TextSidebarImpl);
