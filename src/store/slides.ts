import update from "immutability-helper";
import Dekk from "../types";
import {Reducer} from "redux";

const ADD = "slides:ADD";
const ASSIGN = "slides:ASSIGN";
const DISCHARGE = "slides:DISCHARGE";
const REMOVE = "slides:REMOVE";
const SET_BACKGROUND = "slides:SET_BACKGROUND";
const MOVE_LAST = "slides:MOVE_LAST";
const MOVE_FIRST = "slides:MOVE_FIRST";
const MOVE_FORWARD = "slides:MOVE_FORWARD";
const MOVE_BACKWARD = "slides:MOVE_BACKWARD";

const reducer: Reducer<
	Dekk.SlideModel[],
	{type: string; data: Partial<Dekk.SlideModel> & {slotId?: Dekk.UUID}}
> = (state = [], {type, data}) => {
	const slideIndex = state.findIndex(slide => slide.uuid === data.uuid);
	const currentSlide = state[slideIndex];
	const slotIndex = currentSlide && currentSlide.slots.findIndex(uuid => uuid === data.slotId);
	switch (type) {
		case ADD:
			return update(state, {$push: [data as Dekk.SlideModel]});
		case ASSIGN:
			return update(state, {
				[slideIndex]: {
					slots: {$push: [data.slotId as Dekk.UUID]}
				}
			});
		case DISCHARGE:
			return update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]]}
				}
			});
		case MOVE_LAST:
			return update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]], $unshift: [data.slotId as Dekk.UUID]}
				}
			});
		case MOVE_FORWARD:
			return update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1], [slotIndex + 1, 0, data.slotId as Dekk.UUID]]}
				}
			});
		case MOVE_BACKWARD:
			return update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1], [slotIndex - 1, 0, data.slotId as Dekk.UUID]]}
				}
			});
		case MOVE_FIRST:
			return update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]], $push: [data.slotId as Dekk.UUID]}
				}
			});
		case SET_BACKGROUND:
			return update(state, {
				[slideIndex]: {
					format: {
						$merge: data.format as Dekk.SlideFormat
					}
				}
			});
		case REMOVE:
			return update(state, {
				$splice: [[slideIndex, 1]]
			});
		default:
			return state;
	}
};

export const add = (data: Dekk.SlideModel) => ({type: ADD, data});
export const remove = (uuid: Dekk.UUID) => ({type: REMOVE, data: {uuid}});
export const assign = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: ASSIGN,
	data: {slotId, uuid}
});
export const discharge = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: DISCHARGE,
	data: {slotId, uuid}
});

export const moveFirst = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: MOVE_FIRST,
	data: {slotId, uuid}
});
export const moveLast = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: MOVE_LAST,
	data: {slotId, uuid}
});

export const moveForward = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: MOVE_FORWARD,
	data: {slotId, uuid}
});

export const moveBackward = (uuid: Dekk.UUID, slotId: Dekk.UUID) => ({
	type: MOVE_BACKWARD,
	data: {slotId, uuid}
});

export const setBackground = (uuid: Dekk.UUID, background: string) => ({
	type: SET_BACKGROUND,
	data: {format: {background}, uuid}
});

export default reducer;
