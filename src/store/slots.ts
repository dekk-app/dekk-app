import update from "immutability-helper";
import {Reducer} from "redux";
import Dekk from "../types";

const ADD = "slots:ADD";
const REMOVE = "slots:REMOVE";
const SET_EDITOR_STATE = "slots:SET_EDITOR_STATE";
const SET_POSITION = "slots:SET_POSITION";
const SET_PROPS = "slots:SET_PROPS";
const SET_SIZE = "slots:SET_SIZE";
const SET_ROTATION = "slots:SET_ROTATION";
const SET_TYPE = "slots:SET_TYPE";
const SET_VALUE = "slots:SET_VALUE";
const SET_VERTICAL_ALIGNMENT = "slots:SET_VERTICAL_ALIGNMENT";
const SET_BACKGROUND = "slots:SET_BACKGROUND";
const SET_BORDER = "slots:SET_BORDER";
const SET_SHADOW = "slots:SET_SHADOW";
const SET_COLOR= "slots:SET_COLOR";

const reducer: Reducer<Dekk.SlotModel[], {type: string; data: Dekk.SlotModel}> = (
	state = [],
	{type, data}
) => {
	const slotIndex = state.findIndex(slot => slot.uuid === data.uuid);
	switch (type) {
		case ADD:
			return update(state, {$push: [data as Dekk.SlotModel]});
		case SET_VALUE:
			return update(state, {[slotIndex]:
					{value: {
							$set: data.value
						}
					}});
		case SET_TYPE:
			return update(state, {[slotIndex]:
					{type: {
							$set: data.type
						}
					}});
		case SET_PROPS:
			return update(state, {[slotIndex]:
					{props: {
							$set: data.props
						}
					}});
		case SET_SIZE:
			return update(state, {[slotIndex]:
					{size: {
							$set: data.size
						}
					}});
		case SET_VERTICAL_ALIGNMENT:
			return update(state, {[slotIndex]:
					{verticalAlignment: {
							$set: data.verticalAlignment
						}
					}});
		case SET_POSITION:
			return update(state, {[slotIndex]:
					{position: {
							$set: data.position
						}
					}});
		case SET_ROTATION:
			return update(state, {[slotIndex]:
					{rotation: {
							$set: data.rotation
						}
					}});
		case SET_BACKGROUND:
			return update(state, {
				[slotIndex]: {
					format: {
						$merge: data.format as Dekk.SlotFormat
					}
				}
			});
		case SET_BORDER:
			return update(state, {
				[slotIndex]: {
					format: {
						border: {
							$merge: data.format.border as Dekk.Border
						}
					}
				}
			});
		case SET_SHADOW:
			return update(state, {
				[slotIndex]: {
					format: {
						shadow: {
							$merge: data.format.shadow as Dekk.Shadow
						}
					}
				}
			});
		case SET_COLOR:
			return update(state, {[slotIndex]:
					{format: {
							$merge: (data.format as Dekk.SlotFormat)
						}
					}});
		case SET_EDITOR_STATE:
			return update(state, {[slotIndex]:
					{editorState: {
							$set: data.editorState
						}
					}});
		case REMOVE:
			return update(state, {
				$splice: [[slotIndex, 1]]
			});
		default:
			return state;
	}
};

export const add = (data: Dekk.SlotModel) => ({type: ADD, data});

export const remove = (uuid: Dekk.UUID) => ({type: REMOVE, data: {uuid}});

export const setValue = (uuid: Dekk.UUID, value: string) => ({
	type: SET_VALUE,
	data: {uuid, value}
});

export const setSize = (uuid: Dekk.UUID, size: Dekk.Size) => ({
	type: SET_SIZE,
	data: {uuid, size}
});

export const setPosition = (uuid: Dekk.UUID, position: Dekk.Position) => ({
	type: SET_POSITION,
	data: {uuid, position}
});

export const setRotation = (uuid: Dekk.UUID, rotation: Dekk.Rotation) => ({
	type: SET_ROTATION,
	data: {uuid, rotation}
});

export const setProps = (uuid: Dekk.UUID, props: Dekk.SlotProps) => ({
	type: SET_PROPS,
	data: {uuid, props}
});

export const setVerticalAlignment = (uuid: Dekk.UUID, verticalAlignment: Dekk.VerticalAlignment) => ({
	type: SET_VERTICAL_ALIGNMENT,
	data: {uuid, verticalAlignment}
});

export const setType = (uuid: Dekk.UUID, type: Dekk.SlotType) => ({
	type: SET_TYPE,
	data: {uuid, type}
});

export const setEditorState = (uuid: Dekk.UUID, editorState: any) => ({
	type: SET_EDITOR_STATE,
	data: {uuid, editorState}
});

export const setBackground = (uuid: Dekk.UUID, background: string) => ({
	type: SET_BACKGROUND,
	data: {format: {background}, uuid}
});

export const setBorder = (uuid: Dekk.UUID, border: Dekk.Border) => ({
	type: SET_BORDER,
	data: {format: {border}, uuid}
});

export const setShadow = (uuid: Dekk.UUID, shadow: Dekk.Shadow) => ({
	type: SET_SHADOW,
	data: {format: {shadow}, uuid}
});

export const setColor = (uuid: Dekk.UUID, color: string) => ({
	type: SET_COLOR,
	data: {format: {color}, uuid}
});

export default reducer;
