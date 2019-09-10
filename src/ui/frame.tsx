import React from "react";
import {connect} from "react-redux";
import {Pane, SortablePane} from "react-sortable-pane";
import {StyledImage, StyledText} from "../elements";
import {select as selectSlide} from "../store/current-slide";
import {select as selectSlot} from "../store/current-slot";
import {
	add as addSlide,
	assign as assignSlot,
	discharge as dischargeSlot,
	remove as removeSlide,
	setBackground as setSlideBackground
} from "../store/slides";
import {
	add as addSlot,
	remove as removeSlot,
	setEditorState,
	setProps as setSlotProps,
	setType as setSlotType,
	setValue as setSlotValue,
	setVerticalAlignment as setSlotAlignment
} from "../store/slots";
import Dekk from "../types";
import {StyledGroupedButton, StyledButton} from "./button";
import {EditorProvider} from "./editor";
import {GlobalStyle} from "./global-style";
import {
	Layout,
	Main,
	Navigator,
	Separator,
	Sidebar,
	StyledSidebarTitle,
	View,
	Box,
	StyledSidebarSubtitle
} from "./layout";
import {SlideLink} from "./slide-thumb";
import {ToSlide} from "./to-react";
import {Toolbar, ToolbarButton, ToolbarFlex} from "./toolbar";
import {COVER, createFromMaster, createSlot, getSlotRect} from "./masters";
import {TextSidebar} from "./text-sidebar";
import {ImageSidebar} from "./image-sidebar";
import {ColorPicker} from "./color-picker";
import {Section} from "./section";
import {palette} from "../theme";

const FrameImpl: React.FunctionComponent<Dekk.FrameProps> = ({children, ...props}) => {
	const [zoomLevel, setZoomLevel] = React.useState(1);
	const [sorting, setSorting] = React.useState<string[]>([]);
	const [isEditable, setEditable] = React.useState(false);
	React.useEffect(() => {
		setEditable(false);
	}, [props.currentSlot]);
	React.useEffect(() => {
		if (!props.currentSlot || isEditable) {
			return
		}
		const handleDelete = (e: KeyboardEvent) => {
			const {which} = e;
			if (which === 8) {
				props.dischargeSlot(props.currentSlide, props.currentSlot);
				props.removeSlot( props.currentSlot);
			}
		};
		window.addEventListener("keydown", handleDelete);
		return () => {
			window.removeEventListener("keydown", handleDelete);
		};
	}, [props.currentSlot, isEditable, props.dischargeSlot, props.removeSlot]);
	React.useEffect(() => {
		if (!props.slides.length) {
			const {uuid} = addSlide();
			props.selectSlide(uuid);
		}
		const handleScale = (e: KeyboardEvent) => {
			const {metaKey, which} = e;
			const plus = which === 187;
			const minus = which === 189;
			const zero = which === 48;
			if (metaKey && (plus || minus || zero)) {
				// e.preventDefault();
				if (plus) {
					setZoomLevel(level => Math.min(1.5, level + 0.1));
				} else if (minus) {
					setZoomLevel(level => Math.max(0.5, level - 0.1));
				} else if (zero) {
					setZoomLevel(1);
				}
			}
		};
		window.addEventListener("keydown", handleScale);
		return () => {
			window.removeEventListener("keydown", handleScale);
		};
	}, [setZoomLevel, props.slides, props.selectSlide]);
	const refElement = React.useRef(null);
	const editorRef: React.RefObject<any> = React.useRef(null);
	const addSlide = () => {
		const {slots, slide} = createFromMaster(COVER);
		const slideOrder = `${props.slides.length}`;
		slots.forEach(slot => props.addSlot(slot));
		props.addSlide({...slide, order: slideOrder});
		setSorting(currentSorting => [...currentSorting, slideOrder]);
		return slide;
	};
	const addTextSlot = () => {
		const slot = createSlot({
			type: StyledText,
			...getSlotRect(24, 160)
		});
		props.addSlot(slot);
		props.assignSlot(currentSlide.uuid, slot.uuid);
	};
	const addImageSlot = () => {
		const slot = createSlot({
			type: StyledImage,
			props: {
				src: "https://placehold.it/300",
				filename: "300.jpg"
			},
			...getSlotRect(300)
		});
		props.addSlot(slot);
		props.assignSlot(currentSlide.uuid, slot.uuid);
	};
	const sortSlides = (order: any) => {
		setSorting(order);
	};
	const [firstSlide] = props.slides;
	const currentSlide: Dekk.SlideModel =
		props.slides.find(slide => slide.uuid === props.currentSlide) || firstSlide;
	const currentSlot = props.slots.find(slot => slot.uuid === props.currentSlot);
	return (
		<Layout sidebarLeft={true} sidebarRight={true}>
			<GlobalStyle />
			<Toolbar title="Untitled">
				<ToolbarButton label="View" icon="view" />
				<ToolbarButton
					label="Zoom in"
					icon="zoomIn"
					disabled={zoomLevel >= 2}
					onClick={() => setZoomLevel(level => level + 0.1)}
				/>
				<ToolbarButton
					label="Zoom out"
					icon="zoomOut"
					disabled={zoomLevel <= 0.5}
					onClick={() => setZoomLevel(level => level - 0.1)}
				/>
				<ToolbarButton label="Add Slide" icon="add" onClick={addSlide} />
				<ToolbarFlex />
				<ToolbarButton label="Text" icon="text" onClick={addTextSlot} />
				<ToolbarButton label="Image" icon="media" iconColor={palette.blue[500]} onClick={addImageSlot} />
				<ToolbarFlex />
				<StyledGroupedButton>
					<ToolbarButton label="Format" icon="formatPaint" />
					<ToolbarButton label="Animate" icon="animation" />
					<ToolbarButton label="Document" icon="filePresentationBox" />
				</StyledGroupedButton>
			</Toolbar>
			<Navigator>
				<SortablePane
					direction="vertical"
					disableEffect
					margin={0}
					style={{
						height: 120
					}}
					order={sorting}
					onOrderChange={sortSlides}>
					{props.slides.map(slide => (
						<Pane
							key={parseInt(slide.order)}
							size={{width: 200, height: 120}}
							style={{display: "flex"}}>
							<SlideLink
								slideIndex={sorting.findIndex(order => slide.order == order) + 1}
								onMouseDown={() => {
									props.selectSlot("");
									props.selectSlide(slide.uuid)}
								}
								isActive={currentSlide && currentSlide.uuid === slide.uuid}>
								<ToSlide zoomLevel={156 / 1200} asThumb slide={slide} />
							</SlideLink>
						</Pane>
					))}
				</SortablePane>
			</Navigator>
			<EditorProvider
				editorRef={editorRef}
				editorState={currentSlot && currentSlot.editorState}
				setEditorState={(editorState: any) =>
					currentSlot && props.setEditorState(currentSlot.uuid, editorState)
				}>
				<Sidebar>
					{currentSlide && !currentSlot && (
						<React.Fragment>
							<StyledSidebarTitle>Slide Layout</StyledSidebarTitle>
							<Section>
								<StyledButton>Change Master</StyledButton>
							</Section>
							<Box>
								<StyledSidebarSubtitle>Background</StyledSidebarSubtitle>
								<ColorPicker
									value={(currentSlide as Dekk.SlideModel).format.background}
									onChange={colorValue =>
										props.setSlideBackground(currentSlide.uuid, colorValue)
									}
								/>
								<br />
							</Box>
							<Separator/>
						</React.Fragment>
					)}
						{currentSlot ? currentSlot.type === StyledImage ? (
							<ImageSidebar />
						) : (
							<TextSidebar />
						) : null}
				</Sidebar>
				<Main>
					<View zoomLevel={zoomLevel}>
						<ToSlide
							editorRef={editorRef}
							zoomLevel={zoomLevel}
							ref={refElement}
							slide={currentSlide}
							isEditable={isEditable}
							setEditable={setEditable}
							onClick={(e: React.MouseEvent) => {
								if (e.target === refElement.current) {
									props.selectSlot("");
								}
							}}
						/>
					</View>
				</Main>
			</EditorProvider>
		</Layout>
	);
};

export const Frame = connect(
	({currentSlide, currentSlot, slides, slots}: Dekk.Store) => {
		return {currentSlide, currentSlot, slides, slots};
	},
	{
		addSlide,
		removeSlide,
		assignSlot,
		dischargeSlot,
		addSlot,
		removeSlot,
		selectSlide,
		selectSlot,
		setSlotAlignment,
		setSlotType,
		setSlotProps,
		setSlotValue,
		setEditorState,
		setSlideBackground
	} as Dekk.FrameActions
)(FrameImpl);
