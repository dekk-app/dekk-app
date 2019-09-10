import Color from "color"
import Draft from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {connect} from "react-redux";
import {select} from "../store/current-slot";
import {
	setEditorState,
	setPosition,
	setRotation,
	setSize,
	setValue,
	setProps
} from "../store/slots";
import Dekk from "../types";
import {Slide} from "./slide";
import {SlotEditor} from "./editor";
import {
	ALIGN_ITEMS,
	StyledImage,
	TextAlignCenter,
	TextAlignJustify,
	TextAlignLeft,
	TextAlignRight
} from "../elements";
import {DnR} from "./dnr";
import {BoundingBox, PositionModel} from "./dnr/types";

const createColor = (colorValue: string, alpha: number) => Color(colorValue).alpha(alpha).string();

const thumbBuilderOptions = {
	inlineStyles: {},
	blockRenderers: {
		"text-align-center": (block: Draft.ContentBlock) => {
			return renderToStaticMarkup(<TextAlignCenter>{block.getText()}</TextAlignCenter>);
		},
		"text-align-right": (block: Draft.ContentBlock) => {
			return renderToStaticMarkup(<TextAlignRight>{block.getText()}</TextAlignRight>);
		},
		"text-align-left": (block: Draft.ContentBlock) => {
			return renderToStaticMarkup(<TextAlignLeft>{block.getText()}</TextAlignLeft>);
		},
		"text-align-justify": (block: Draft.ContentBlock) => {
			return renderToStaticMarkup(<TextAlignJustify>{block.getText()}</TextAlignJustify>);
		}
	}
};

const buildThumb = (slot: Dekk.SlotModel) => {
	const __html = stateToHTML(slot.editorState.getCurrentContent(), thumbBuilderOptions);
	const style: React.CSSProperties = {
		position: "absolute",
		display: "flex",
		alignItems: ALIGN_ITEMS[slot.verticalAlignment],
		transform: `translate3d(${slot.position.x}px, ${slot.position.y}px, 0) translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${slot.rotation.z}deg)`,
		background: slot.format.background,
		color: slot.format.color,
		border: `${slot.format.border.width}px ${slot.format.border.style} ${slot.format.border.color}`,
		boxShadow: `${slot.format.shadow.offset.x}px ${slot.format.shadow.offset.y}px ${slot.format.shadow.blur}px ${slot.format.shadow.spread}px ${createColor(slot.format.shadow.color, slot.format.shadow.alpha)}`,
		...slot.size
	};
	return slot.type === StyledImage ? (
		<slot.type {...slot.props} style={style} />
	) : (
		<slot.type {...slot.props} style={style} dangerouslySetInnerHTML={{__html}} />
	);
};

const inRange = (value: number, target: number, threshold: number) =>
	value >= target - threshold && value <= target + threshold;

const snapToGuides = (
	b: BoundingBox,
	ref: React.RefObject<HTMLDivElement>,
	setGuides?: (b: Partial<PositionModel>) => void
) => {
	if (ref && ref.current) {
		const {clientWidth, clientHeight} = ref.current;
		const threshold = 20;
		const halfRelativeX = clientWidth / 2;
		const halfRelativeY = clientHeight / 2;
		const quarterRelativeY = clientHeight / 4;
		const centeredX = b.position.x;
		const centeredY = b.position.y;
		if (
			inRange(centeredX, halfRelativeX, threshold) &&
			inRange(centeredY, quarterRelativeY, threshold)
		) {
			setGuides && setGuides({x: halfRelativeX, y: quarterRelativeY});
			return {x: halfRelativeX, y: quarterRelativeY};
		}
		if (
			inRange(centeredX, halfRelativeX, threshold) &&
			inRange(centeredY, halfRelativeY, threshold)
		) {
			setGuides && setGuides({x: halfRelativeX, y: halfRelativeY});
			return {x: halfRelativeX, y: halfRelativeY};
		}
		if (
			inRange(centeredX, halfRelativeX, threshold) &&
			inRange(centeredY, quarterRelativeY * 3, threshold)
		) {
			setGuides && setGuides({x: halfRelativeX, y: quarterRelativeY * 3});
			return {x: halfRelativeX, y: quarterRelativeY * 3};
		}
		if (inRange(centeredX, halfRelativeX, threshold)) {
			setGuides && setGuides({x: halfRelativeX});
			return {x: halfRelativeX};
		}
		if (inRange(centeredY, quarterRelativeY, threshold)) {
			setGuides && setGuides({y: quarterRelativeY});
			return {y: quarterRelativeY};
		}
		if (inRange(centeredY, halfRelativeY, threshold)) {
			setGuides && setGuides({y: halfRelativeY});
			return {y: halfRelativeY};
		}
		if (inRange(centeredY, quarterRelativeY * 3, threshold)) {
			setGuides && setGuides({y: quarterRelativeY * 3});
			return {y: quarterRelativeY * 3};
		}
		setGuides && setGuides({});
		return false;
	}
	setGuides && setGuides({});
	return false;
};

const ToSlotImpl = ({
	currentSlot,
	asThumb,
	selectSlot,
	setSlotPosition,
	setSlotRotation,
	setSlotSize,
	setEditorState,
	isEditable,
	setEditable,
	slots,
	uuid,
	editorRef,
	slideRef,
	zoomLevel
}: Dekk.ToSlotProps) => {
	const slotRef = React.useRef();
	const slot = uuid && slots.find(slot => slot.uuid === uuid);
	if (!slot) {
		return null;
	}
	const isSelected = currentSlot === slot.uuid;
	const isDraggable = !isEditable;
	const isResizable = !isEditable && isSelected;

	return asThumb ? (
		buildThumb(slot)
	) : (
		<SlideConsumer>
			{({setGuides}) => (
				<DnR
					scale={zoomLevel}
					snap={b =>
						snapToGuides(b, slideRef as React.RefObject<HTMLDivElement>, setGuides)
					}
					size={slot.size}
					position={slot.position}
					rotation={slot.rotation}
					draggable={isDraggable}
					resizable={isResizable}
					rotatable={isResizable}
					onRotateEnd={({rotation}) => {
						setSlotRotation(slot.uuid, rotation);
					}}
					onDragEnd={({size, position}) => {
						setSlotSize(slot.uuid, size);
						setSlotPosition(slot.uuid, position);
						setGuides && setGuides({});
					}}
					onResizeEnd={({size, position}) => {
						setSlotSize(slot.uuid, size);
						setSlotPosition(slot.uuid, position);
					}}>
					{slot.type === StyledImage ? (
						<slot.type
							{...(slot.props || {})}
							data-dekk-slot={slot.uuid}
							verticalAlignment={slot.verticalAlignment}
							onMouseDown={() => selectSlot(uuid)}
							onDragStart={(e: React.MouseEvent) => e.preventDefault()}
							className={isSelected ? "selected" : undefined}
						/>
					) : (
						<slot.type
							{...(slot.props || {})}
							ref={slotRef}
							data-dekk-slot={slot.uuid}
							verticalAlignment={slot.verticalAlignment}
							onMouseDown={() => selectSlot(uuid)}
							onDoubleClick={() => {
								setEditable && setEditable(true);
								(editorRef as React.RefObject<any>).current &&
									((editorRef as React.RefObject<any>)
										.current as HTMLDivElement).focus();
							}}
							className={isSelected ? "selected" : undefined}
							style={{
								...((slot.props && slot.props.style) || {}),
								color: slot.format.color,
								background: slot.format.background,
								border: `${slot.format.border.width}px ${slot.format.border.style} ${slot.format.border.color}`,
								boxShadow: `${slot.format.shadow.offset.x}px ${slot.format.shadow.offset.y}px ${slot.format.shadow.blur}px ${slot.format.shadow.spread}px ${createColor(slot.format.shadow.color, slot.format.shadow.alpha)}`
							}}>
							<SlotEditor
								ref={editorRef}
								editorState={slot.editorState}
								readOnly={!isEditable || !isSelected}
								onChange={(editorState: Draft.EditorState) =>
									setEditorState(slot.uuid, editorState)
								}
								placeholder={(!isEditable || !isSelected) && "Double Click to Edit"}
							/>
						</slot.type>
					)}
				</DnR>
			)}
		</SlideConsumer>
	);
};

export const ToSlot = connect(
	({slots, currentSlot}: Dekk.Store) => ({slots, currentSlot} as Dekk.ToSlotState),
	{
		selectSlot: select,
		setSlotValue: setValue,
		setSlotSize: setSize,
		setSlotProps: setProps,
		setSlotPosition: setPosition,
		setSlotRotation: setRotation,
		setEditorState
	} as Dekk.ToSlotActions
)(ToSlotImpl);

const {Provider: SlideProvider, Consumer: SlideConsumer} = React.createContext<{
	setGuides?: (p: Partial<{x: number; y: number}>) => void;
}>({});

export const ToSlide: React.ForwardRefExoticComponent<
	Dekk.SlideProps & {ref?: React.Ref<HTMLDivElement>; editorRef?: React.Ref<HTMLDivElement>}
> = React.forwardRef(({editorRef, isEditable, setEditable, ...props}, ref) => {
	const [guides, setGuides] = React.useState<Partial<PositionModel>>({});
	return props.slide ? (
		<SlideProvider value={{setGuides}}>
			<Slide {...props} ref={ref} {...props.slide.format} guides={guides}>
				{props.slide.slots.map(uuid => (
					<ToSlot
						key={uuid}
						uuid={uuid}
						zoomLevel={props.zoomLevel}
						editorRef={editorRef}
						isEditable={isEditable}
						setEditable={setEditable}
						slideRef={ref as React.RefObject<HTMLDivElement>}
						asThumb={props.asThumb}
					/>
				))}
			</Slide>
		</SlideProvider>
	) : null;
});
