import {EditorState, RichUtils} from "draft-js";
import {v4 as uuid} from "uuid";
import {StyledHeadline, StyledImage, StyledSubHeadline} from "../elements";
import Dekk from "../types";
import {palette} from "../theme";
// import {getRandomPhoto} from "./unsplash";

export const getSlotRect = (
	height: number,
	width?: number
): {size: Dekk.Size; position: Dekk.Position; rotation: Dekk.Rotation} => {
	const widthOrHeight = width === undefined ? height : width;
	return {
		rotation: {x: 0, y: 0, z: 0},
		size: {
			height,
			width: widthOrHeight
		},
		position: {
			x: 600,
			y: 400
		}
	};
};

export const createSlot = (props: Partial<Dekk.SlotModel>): Dekk.SlotModel =>
	({
		uuid: uuid(),
		editorState: EditorState.createEmpty(),
		verticalAlignment: "bottom",
		zIndex: 0,
		format: {
			opacity: 1,
			background: "transparent",
			color: palette.black,
			border: {
				width: 0,
				style: "none",
				color: "transparent"
			},
			shadow: {
				offset: {
					x: 0,
					y: 0
				},
				blur: 0,
				spread: 0,
				color: palette.black,
				alpha: 0.5
			}
		},
		...props
	} as Dekk.SlotModel);

export const createImageSlot = (props: Partial<Dekk.SlotModel>): Dekk.SlotModel =>
	({
		uuid: uuid(),
		type: StyledImage,
		verticalAlignment: "center",
		zIndex: 0,
		format: {
			opacity: 1,
			background: "transparent",
			color: palette.black,
			border: {
				width: 0,
				style: "none",
				color: "transparent"
			},
			shadow: {
				offset: {
					x: 0,
					y: 0
				},
				blur: 0,
				spread: 0,
				color: palette.black,
				alpha: 0.5
			}
		},
		...props
	} as Dekk.SlotModel);

export const COVER = "master:COVER";
export const PHOTO_VERTICAL = "master:PHOTO_VERTICAL";

type masterFn = () => Promise<{slots: Dekk.SlotModel[]; slide: Dekk.SlideModel}>;
const MASTERS: {[key: string]: masterFn} = {
	[COVER]: async () => {
		const title = createSlot({
			type: StyledHeadline,
			verticalAlignment: "bottom",
			size: {
				width: 1000,
				height: 300
			},
			position: {
				x: 600,
				y: 242
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			}
		});
		const subtitle = createSlot({
			type: StyledSubHeadline,
			verticalAlignment: "top",
			size: {
				width: 1000,
				height: 100
			},
			position: {
				x: 600,
				y: 458
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			}
		});
		title.editorState = RichUtils.toggleBlockType(title.editorState, "text-align-center");
		subtitle.editorState = RichUtils.toggleBlockType(subtitle.editorState, "text-align-center");
		const slide: Dekk.SlideModel = {
			uuid: uuid(),
			slots: [title.uuid, subtitle.uuid],
			order: "-1",
			format: {
				background: palette.white
			}
		};
		return {
			slots: [title, subtitle],
			slide
		};
	},
	[PHOTO_VERTICAL]: async () => {
		const title = createSlot({
			type: StyledHeadline,
			verticalAlignment: "bottom",
			size: {
				width: 500,
				height: 300
			},
			position: {
				x: 300,
				y: 242
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			}
		});
		const subtitle = createSlot({
			type: StyledSubHeadline,
			verticalAlignment: "top",
			size: {
				width: 500,
				height: 100
			},
			position: {
				x: 300,
				y: 458
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			}
		});
		// const photo = await getRandomPhoto({
		// 	width: 500,
		// 	height: 700
		// });
		const image = createImageSlot({
			verticalAlignment: "top",
			size: {
				width: 500,
				height: 700
			},
			position: {
				x: 900,
				y: 400
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			},
			props: {
				src: "https://placehold.it/1000x1400",
				alt: "placeholder",
				filename: "1000x1400.jpg"
			}
		});
		title.editorState = RichUtils.toggleBlockType(title.editorState, "text-align-center");
		subtitle.editorState = RichUtils.toggleBlockType(subtitle.editorState, "text-align-center");
		const slide: Dekk.SlideModel = {
			uuid: uuid(),
			slots: [title.uuid, subtitle.uuid, image.uuid],
			order: "-1",
			format: {
				background: palette.white
			}
		};
		return {
			slots: [title, subtitle, image],
			slide
		};
	}
};
export const createFromMaster = (masterKey: string) => MASTERS[masterKey]();
