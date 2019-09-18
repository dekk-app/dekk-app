import Color from "color";
import Draft from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {connect} from "react-redux";
import {v4 as uuid} from "uuid";
import {select} from "../store/current-slot";
import {
	setEditorState,
	setPosition,
	setProps,
	setRotation,
	setSize,
	setValue
} from "../store/slots";
import Dekk from "../types";
import {Slide} from "./slide";
import {SlotEditor} from "./editor";
import {
	ALIGN_ITEMS,
	SLOT_TYPES,
	TextAlignCenter,
	TextAlignJustify,
	TextAlignLeft,
	TextAlignRight
} from "../elements";

import {DnR} from "./dnr";
import {BoundingBox} from "./dnr/types";
import styled from "styled-components";

export const createColor = (colorValue: string, alpha: number) =>
	Color(colorValue)
		.alpha(alpha)
		.string();

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
	const __html =
		slot.editorState && stateToHTML(slot.editorState.getCurrentContent(), thumbBuilderOptions);
	const style: React.CSSProperties = {
		position: "absolute",
		display: "flex",
		alignItems: ALIGN_ITEMS[slot.verticalAlignment],
		transform: `translate3d(${slot.position.x}px, ${slot.position.y}px, 0) translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${slot.rotation.z}deg)`,
		background: slot.format.background,
		opacity: slot.format.opacity,
		color: slot.format.color,
		border: `${slot.format.border.width}px ${slot.format.border.style} ${slot.format.border.color}`,
		boxShadow: `${slot.format.shadow.offset.x}px ${slot.format.shadow.offset.y}px ${
			slot.format.shadow.blur
		}px ${slot.format.shadow.spread}px ${createColor(
			slot.format.shadow.color,
			slot.format.shadow.alpha
		)}`,
		...slot.size
	};
	const SlotComponent = SLOT_TYPES[slot.type];

	return slot.type === "StyledImage" ? (
		<SlotComponent {...slot.props} style={style} />
	) : (
		<SlotComponent {...slot.props} style={style} dangerouslySetInnerHTML={{__html}} />
	);
};

const inRange = (value: number, target: number, threshold: number) =>
	value >= target - threshold && value <= target + threshold;

const snapToGuides = (
	b: BoundingBox,
	ref: React.RefObject<HTMLDivElement>
): Partial<Dekk.Snap>[] => {
	if (ref && ref.current) {
		const {clientWidth, clientHeight} = ref.current;
		const threshold = 20;
		const halfRelativeX = clientWidth / 2;
		const halfRelativeY = clientHeight / 2;
		const quarterRelativeY = halfRelativeY / 2;
		const centeredX = b.position.x;
		const centeredY = b.position.y;
		const snapV: Partial<Dekk.Snap> = {uuid: uuid()};
		const snapH: Partial<Dekk.Snap> = {uuid: uuid()};

		if (inRange(centeredX, halfRelativeX, threshold)) {
			snapH.x1 = halfRelativeX;
			snapH.x2 = halfRelativeX;
			snapH.y1 = 0;
			snapH.y2 = 800;
			snapH.x = halfRelativeX;
		}
		if (inRange(centeredY, halfRelativeY, threshold)) {
			snapV.y1 = halfRelativeY;
			snapV.y2 = halfRelativeY;
			snapV.x1 = 0;
			snapV.x2 = 1200;
			snapV.y = halfRelativeY;
		}
		if (inRange(centeredY, quarterRelativeY, threshold)) {
			snapV.y1 = quarterRelativeY;
			snapV.y2 = quarterRelativeY;
			snapV.x1 = 0;
			snapV.x2 = 1200;
			snapV.y = quarterRelativeY;
		}
		if (inRange(centeredY, quarterRelativeY * 3, threshold)) {
			snapV.y1 = quarterRelativeY * 3;
			snapV.y2 = quarterRelativeY * 3;
			snapV.x1 = 0;
			snapV.x2 = 1200;
			snapV.y = quarterRelativeY * 3;
		}
		return [snapV, snapH].filter(({x, y}) => x !== undefined || y !== undefined);
	}
	return [];
};

// const snapToBounds = (
// 	b: BoundingBox,
// 	bounds: {left: number; top: number; bottom: number; right: number}
// ): Partial<Dekk.Snap> => {
// 	const snap: Partial<Dekk.Snap> = {};
// 	if (b.position.x - b.size.width / 2 <= bounds.left) {
// 		snap.x = bounds.left + b.size.width / 2;
// 		snap.x1 = 0;
// 		snap.x2 = 0;
// 	} else if (b.position.x + b.size.width / 2 >= bounds.right) {
// 		snap.x = bounds.right - b.size.width / 2;
// 		snap.x1 = 0;
// 		snap.x2 = 0;
// 	}
// 	if (b.position.y - b.size.height / 2 <= bounds.top) {
// 		snap.y = bounds.top + b.size.height / 2;
// 		snap.y1 = 0;
// 		snap.y2 = 0;
// 	} else if (b.position.y + b.size.height / 2 >= bounds.bottom) {
// 		snap.y = bounds.bottom - b.size.height / 2;
// 		snap.y1 = 0;
// 		snap.y2 = 0;
// 	}
// 	return snap;
// };

const snapToSiblings = (
	b: BoundingBox,
	siblings: Dekk.SlotModel[],
	previousSnap: Partial<Dekk.Snap>[]
): Partial<Dekk.Snap>[] => {
	const threshold = 20;
	const centeredX = b.position.x;
	const centeredY = b.position.y;
	const matchesX = siblings.filter(({position}) => inRange(centeredX, position.x, threshold));
	const matchesY = siblings.filter(({position}) => inRange(centeredY, position.y, threshold));
	const snapV: Partial<Dekk.Snap> = {uuid: uuid()};
	const snapH: Partial<Dekk.Snap> = {uuid: uuid()};

	const preSnap: Partial<Dekk.Snap> = previousSnap.reduce(
		(current, next) => ({...current, ...next}),
		{}
	);

	if (matchesX.length) {
		const [firstMatch] = matchesX;
		const before = b.position.y < firstMatch.position.y;
		snapH.x1 = firstMatch.position.x;
		snapH.x2 = firstMatch.position.x;
		snapH.y1 = firstMatch.position.y + (firstMatch.size.height as number) / (before ? 2 : -2);
		snapH.y2 =
			preSnap.y2 === undefined
				? b.position.y + b.size.height / (before ? -2 : 2)
				: preSnap.y2;
		snapH.x = firstMatch.position.x;
	}
	if (matchesY.length) {
		const [firstMatch] = matchesY;
		const before = b.position.x < firstMatch.position.x;
		snapV.y1 = firstMatch.position.y;
		snapV.y2 = firstMatch.position.y;
		snapV.x1 = firstMatch.position.x + (firstMatch.size.width as number) / (before ? 2 : -2);
		snapV.x2 =
			preSnap.x2 === undefined ? b.position.x + b.size.width / (before ? -2 : 2) : preSnap.x2;
		snapV.y = firstMatch.position.y;
	}
	return [snapV, snapH].filter(({x, y}) => x !== undefined || y !== undefined);
};

const ToSlotImpl = ({
	currentSlot,
	currentSlide,
	slides,
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
	const slot = uuid && slots.find(item => item.uuid === uuid);
	const slide = currentSlide && slides.find(item => item.uuid === currentSlide);
	const slideSlots = slide ? slide.slots : [];
	if (!slot) {
		return null;
	}
	const isSelected = currentSlot === slot.uuid;
	const isDraggable = !isEditable;
	const isResizable = !isEditable && isSelected;
	const SlotComponent = SLOT_TYPES[slot.type];
	return asThumb ? (
		buildThumb(slot)
	) : (
		<SlideConsumer>
			{({setGuides}) => (
				<DnR
					scale={zoomLevel}
					snap={b => {
						const snap: Partial<Dekk.Snap>[] = [
							...snapToGuides(b, slideRef as React.RefObject<HTMLDivElement>)
						];

						snap.push(
							...snapToSiblings(
								b,
								slots.filter(
									({uuid}) => slideSlots.includes(uuid) && uuid !== currentSlot
								),
								snap
							)
							//snapToBounds(b, {left: 0, top: 0, bottom:800, right: 1200})
						);
						// const reduced = snap.reduce(
						// 	(
						// 		currentValue: Partial<Dekk.Snap>[],
						// 		nextValue: Partial<Dekk.Snap>
						// 	): Partial<Dekk.Snap>[] => {
						// 		const {x1, x2, y1, y2} = nextValue;
						// 		if (x1 !== undefined && x1 === x2) {
						// 			const similar = currentValue.findIndex(
						// 				item => item.y1 === 0 && item.y2 === 800
						// 			);
						// 			if (similar > -1) {
						// 				//currentValue.splice(similar, 1);
						// 			}
						// 		}
						// 		if (y1 !== undefined && y1 === y2) {
						// 			const similar = currentValue.findIndex(
						// 				item => item.x1 === 0 && item.x2 === 1200
						// 			);
						// 			if (similar > -1) {
						// 				//currentValue.splice(similar, 1);
						// 			}
						// 		}
						// 		return [...currentValue, nextValue];
						// 	},
						// 	[]
						// );
						setGuides && setGuides(snap);
						return snap.reduce((prev, next) => ({...prev, ...next}), {});
					}}
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
						setGuides && setGuides([]);
					}}
					onResizeEnd={({size, position}) => {
						setSlotSize(slot.uuid, size);
						setSlotPosition(slot.uuid, position);
					}}>
					{slot.type === "StyledImage" ? (
						<SlotComponent
							{...(slot.props || {})}
							data-dekk-slot={slot.uuid}
							verticalAlignment={slot.verticalAlignment}
							onMouseDown={() => selectSlot(uuid)}
							onDragStart={(e: React.MouseEvent) => e.preventDefault()}
							className={isSelected ? "selected" : undefined}
						/>
					) : (
						<SlotComponent
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
								opacity: slot.format.opacity,
								background: slot.format.background,
								border: `${slot.format.border.width}px ${slot.format.border.style} ${slot.format.border.color}`,
								boxShadow: `${slot.format.shadow.offset.x}px ${
									slot.format.shadow.offset.y
								}px ${slot.format.shadow.blur}px ${
									slot.format.shadow.spread
								}px ${createColor(
									slot.format.shadow.color,
									slot.format.shadow.alpha
								)}`
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
						</SlotComponent>
					)}
				</DnR>
			)}
		</SlideConsumer>
	);
};

export const ToSlot = connect(
	({slots, currentSlot, slides, currentSlide}: Dekk.Store) =>
		({slots, currentSlot, slides, currentSlide} as Dekk.ToSlotState),
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
	setGuides?: (p: Partial<Dekk.Snap>[]) => void;
}>({});

const StyledGuides = styled.svg.attrs({
	viewBox: "0 0 1200 800"
})`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 3;
	pointer-events: none;
`;

const StyledGuide = styled.line`
	stroke: ${props => props.theme.palette.amber[500]};
	stroke-width: 1;
`;

const Guides: React.FunctionComponent<{
	guides: Partial<Dekk.Snap>[];
}> = ({guides}) => {
	return (
		<StyledGuides>
			{guides.map(({uuid: key, x1, x2, y1, y2}) => {
				const line = {x1, x2, y1, y2};
				return <StyledGuide key={key} {...line} />;
			})}
		</StyledGuides>
	);
};

export const ToSlide: React.ForwardRefExoticComponent<
	Dekk.SlideProps & {ref?: React.Ref<HTMLDivElement>; editorRef?: React.Ref<HTMLDivElement>}
> = React.forwardRef(({editorRef, isEditable, setEditable, ...props}, ref) => {
	const [guides, setGuides] = React.useState<Partial<Dekk.Snap>[]>([]);
	return props.slide ? (
		<SlideProvider value={{setGuides}}>
			<Slide {...props} ref={ref} {...props.slide.format}>
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
				<Guides guides={guides} />
			</Slide>
		</SlideProvider>
	) : null;
});
