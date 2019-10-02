import React from "react";
import {connect} from "react-redux";
import {DragDropContext, Droppable, Draggable, DropResult} from "react-beautiful-dnd";
import png_image from "./image.jpg";
// import {StyledImage, StyledText} from "../elements";
import {select as selectSlide} from "../store/current-slide";
import {select as selectSlot} from "../store/current-slot";
import {
	replace as replaceSlides,
	add as addSlide,
	reorder as reorderSlides,
	assign as assignSlot,
	discharge as dischargeSlot,
	remove as removeSlide,
	setBackground as setSlideBackground
} from "../store/slides";
import {
	replace as replaceSlots,
	add as addSlot,
	remove as removeSlot,
	setEditorState,
	setProps as setSlotProps,
	setType as setSlotType,
	setValue as setSlotValue,
	setVerticalAlignment as setSlotAlignment
} from "../store/slots";
import Dekk from "../types";
import {StyledButton, StyledGroupedButton} from "./button";
import {EditorProvider} from "./editor";
import {GlobalStyle} from "./global-style";
import {
	Box,
	Layout,
	Main,
	Navigator,
	Separator,
	Sidebar,
	StyledSidebarSubtitle,
	StyledSidebarTitle,
	View
} from "./layout";
import {SlideLink} from "./slide-thumb";
import {ToSlide} from "./to-react";
import {Toolbar, ToolbarButton, ToolbarFlex} from "./toolbar";
import {createFromMaster, createSlot, getSlotRect, PHOTO_VERTICAL} from "./masters";
import {TextSidebar} from "./text-sidebar";
import {ImageSidebar} from "./image-sidebar";
import {Colorpicker} from "./colorpicker";
import {Section} from "./section";
import {palette} from "../theme";
import Patterns from "./patterns";
import {remote, ipcRenderer} from "electron";
import fs from "fs";
import {store as electronStore} from "../store/electron";
import * as path from "path";

const FrameImpl: React.FunctionComponent<Dekk.FrameProps> = ({children, ...props}) => {
	const [projectFile, setProjectFile] = React.useState<null|string>(null);
	const [zoomLevel, setZoomLevel] = React.useState(1);
	const [isEditable, setEditable] = React.useState(false);
	React.useEffect(() => {
		setEditable(false);
	}, [props.currentSlot]);

	const onDragEnd = React.useCallback(({source, destination}: DropResult) => {
		if (!destination) {
			return;
		}
		props.reorderSlides(props.currentSlide, source.index, destination.index);
	}, [props.reorderSlides]);

	React.useEffect(() => {
		if (!props.currentSlot || isEditable) {
			return;
		}
		const handleDelete = (e: KeyboardEvent) => {
			const {which} = e;
			if (which === 8) {
				props.dischargeSlot(props.currentSlide, props.currentSlot);
				props.removeSlot(props.currentSlot);
			}
		};
		window.addEventListener("keydown", handleDelete);
		return () => {
			window.removeEventListener("keydown", handleDelete);
		};
	}, [props.currentSlot, isEditable, props.dischargeSlot, props.removeSlot]);
	React.useEffect(() => {
		if (!props.slides.length) {
			addSlide().then(({uuid}) => props.selectSlide(uuid));
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
	const addSlide = async () => {
		const {slots, slide} = await createFromMaster(PHOTO_VERTICAL);
		slots.forEach(slot => props.addSlot(slot));
		props.addSlide(slide);
		return slide;
	};
	const addTextSlot = () => {
		const slot = createSlot({
			type: "StyledText",
			...getSlotRect(24, 160)
		});
		props.addSlot(slot);
		props.assignSlot(currentSlide.uuid, slot.uuid);
	};
	const addImageSlot = () => {
		const slot = createSlot({
			type: "StyledImage",
			props: {
				src: png_image,
				filename: "image.jpg"
			},
			...getSlotRect(300)
		});
		props.addSlot(slot);
		props.assignSlot(currentSlide.uuid, slot.uuid);
	};

	const saveAsDekk = React.useCallback(() => {
		remote.dialog.showSaveDialog({
			filters: [
				{ name: 'Dekk', extensions: ['dek'] }
			],
		}).then(({filePath}) => {
			if (!filePath) {
				console.error("no filename was selected");
				return;
			}
			setProjectFile(filePath);
			fs.writeFile(filePath, JSON.stringify(electronStore.store), err => {
				if (err) {
					console.error(err);
				}
			});
		});
	}, [setProjectFile, electronStore]);

	const saveDekk = React.useCallback(() => {
		if (projectFile) {
			fs.writeFile(projectFile, JSON.stringify(electronStore.store), err => {
				if (err) {
					console.error(err);
				}
			});
		} else {
			saveAsDekk();
		}
	}, [projectFile, saveAsDekk, electronStore]);

	const openDekk = React.useCallback(() => {
		remote.dialog.showOpenDialog({
			filters: [
				{ name: 'Dekk', extensions: ['dek'] }
			]
		}).then(({filePaths}) => {
			if (!filePaths || !filePaths.length) {
				console.error("no filename was selected");
				return;
			}
			const [file] = filePaths;
			setProjectFile(file);
			fs.readFile(file, "utf-8", (err, data) => {
				if (err) {
					console.error(err);
				}
				const {slides, slots} = JSON.parse(data);
				props.replaceSlides(slides);
				props.replaceSlots(slots);
				props.selectSlide(slides[0].uuid);
				props.selectSlot("");
			});
		});
	}, [setProjectFile, props.replaceSlides, props.replaceSlots, props.selectSlide, props.selectSlot]);

	const newDekk = React.useCallback(() => {
		if (!projectFile) {
			remote.dialog.showMessageBox({
				message: "The previous file has been edited without saving. are you sure you want to proceed?",
				buttons: ["Cancel", "OK"]
			}).then(({response}) => {
				if (response === 1) {
					props.replaceSlides([]);
					props.replaceSlots([]);
					props.selectSlide("");
					props.selectSlot("");
					setProjectFile(null);
				}
			})
		} else {
			props.replaceSlides([]);
			props.replaceSlots([]);
			props.selectSlide("");
			props.selectSlot("");
			setProjectFile(null);
		}

	}, [projectFile, setProjectFile, props.replaceSlides, props.replaceSlots, props.selectSlide, props.selectSlot]);

	React.useEffect(() => {
		ipcRenderer.addListener("save-as-dekk", saveAsDekk);
		ipcRenderer.addListener("save-dekk", saveDekk);
		ipcRenderer.addListener("new-dekk", newDekk);
		ipcRenderer.addListener("open-dekk", openDekk);

		return () => {
			ipcRenderer.removeListener("save-as-dekk", saveAsDekk);
			ipcRenderer.removeListener("save-dekk", saveDekk);
			ipcRenderer.removeListener("new-dekk", newDekk);
			ipcRenderer.removeListener("open-dekk", openDekk);
		};
	}, [saveAsDekk, saveDekk, newDekk, openDekk]);

	const [firstSlide] = props.slides;
	const currentSlide: Dekk.SlideModel =
		props.slides.find(slide => slide.uuid === props.currentSlide) || firstSlide;
	const currentSlot = props.slots.find(slot => slot.uuid === props.currentSlot);
	React.useEffect(() => {
		if (currentSlide && currentSlide.uuid !== props.currentSlide) {
			props.selectSlide(currentSlide.uuid)
		} else {
			props.selectSlide("")
		}
	}, []);
	return (
		<Layout sidebarLeft={true} sidebarRight={true}>
			<GlobalStyle />
			<Patterns />
			<Toolbar title={projectFile ? path.parse(projectFile).name : "Untitled"}>
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
				<ToolbarButton
					label="Image"
					icon="media"
					iconColor={palette.blue[500]}
					onClick={addImageSlot}
				/>
				<ToolbarFlex />
				<StyledGroupedButton>
					<ToolbarButton label="Format" icon="formatPaint" />
					<ToolbarButton label="Animate" icon="animation" />
					<ToolbarButton label="Document" icon="filePresentationBox" />
				</StyledGroupedButton>
			</Toolbar>
			<Navigator>
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable droppableId="thumbnails">
						{(provided, snapshot) => (
							<div {...provided.droppableProps} ref={provided.innerRef}>
								{props.slides.map((slide, index) => (
									<Draggable
										key={slide.uuid}
										draggableId={slide.uuid}
										index={index}>
										{(provided, snapshot) => (
											<SlideLink
												key={slide.uuid}
												ref={provided.innerRef}
												{...provided.draggableProps}
												{...provided.dragHandleProps}
												style={provided.draggableProps.style}
												slideIndex={index + 1}
												onMouseDown={e => {
													props.selectSlot("");
													props.selectSlide(slide.uuid);
													provided.dragHandleProps &&
														provided.dragHandleProps.onMouseDown(e);
												}}
												isActive={
													currentSlide && currentSlide.uuid === slide.uuid
												}>
												<ToSlide
													zoomLevel={156 / 1200}
													asThumb
													slide={slide}
												/>
											</SlideLink>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
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
								<Colorpicker
									value={(currentSlide as Dekk.SlideModel).format.background}
									propPath={`${currentSlide.uuid}.currentSlide.format.background`}
									onChange={colorValue =>
										props.setSlideBackground(currentSlide.uuid, colorValue)
									}
								/>
								<br />
							</Box>
							<Separator />
						</React.Fragment>
					)}
					{currentSlot ? (
						currentSlot.type === "StyledImage" ? (
							<ImageSidebar />
						) : (
							<TextSidebar />
						)
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
		reorderSlides,
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
		setSlideBackground,
		replaceSlides,
		replaceSlots
	} as Dekk.FrameActions
)(FrameImpl);
