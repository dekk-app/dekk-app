import {EditorState, RichUtils} from "draft-js";
import {v4 as uuid} from "uuid";
import {StyledHeadline, StyledSubHeadline} from "../elements";
import Dekk from "../types";
import {palette} from "../theme";

export const getSlotRect = (
	height: number,
	width?: number
): {size: Dekk.Size; position: Dekk.Position, rotation: Dekk.Rotation} => {
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
type masterFn = () => {slots: Dekk.SlotModel[]; slide: Dekk.SlideModel};
const MASTERS: {[key: string]: masterFn} = {
	[COVER]: () => {
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
	}
};
export const createFromMaster = (masterKey: string) => MASTERS[masterKey]();
