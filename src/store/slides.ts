import update from "immutability-helper";
import Dekk from "../types";
import {Reducer} from "redux";
import {store as electronStore} from "./electron";

const ADD = "slides:ADD";
const ASSIGN = "slides:ASSIGN";
const REPLACE = "slides:REPLACE";
const DISCHARGE = "slides:DISCHARGE";
const REMOVE = "slides:REMOVE";
const REORDER = "slides:REORDER";
const SET_BACKGROUND = "slides:SET_BACKGROUND";
const MOVE_LAST = "slides:MOVE_LAST";
const MOVE_FIRST = "slides:MOVE_FIRST";
const MOVE_FORWARD = "slides:MOVE_FORWARD";
const MOVE_BACKWARD = "slides:MOVE_BACKWARD";

const reducer: Reducer<
	Dekk.SlideModel[],
	{type: string; data: Partial<Dekk.SlideModel> & {slotId?: Dekk.UUID, from?: number, to?: number, slides: Dekk.SlideModel[]}}
> = (state = [], {type, data}) => {
	if (!data) {
		return state;
	}
	const slideIndex = state.findIndex(slide => slide.uuid === data.uuid);
	const currentSlide = state[slideIndex];
	const slotIndex = currentSlide && currentSlide.slots.findIndex(uuid => uuid === data.slotId);
	let updatedStore = state;
	switch (type) {
		case ADD:
			updatedStore = update(state, {$push: [data as Dekk.SlideModel]});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case REPLACE:
			updatedStore = data.slides;
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case REORDER:
			if (data.from === undefined && data.to === undefined) {
				return state;
			}
			updatedStore = update(state, {$splice: [[data.from as number, 1], [data.to as number, 0, state[data.from as number]]]});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case ASSIGN:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$push: [data.slotId as Dekk.UUID]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case DISCHARGE:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case MOVE_LAST:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]], $unshift: [data.slotId as Dekk.UUID]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case MOVE_FORWARD:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1], [slotIndex + 1, 0, data.slotId as Dekk.UUID]]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case MOVE_BACKWARD:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1], [slotIndex - 1, 0, data.slotId as Dekk.UUID]]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case MOVE_FIRST:
			updatedStore = update(state, {
				[slideIndex]: {
					slots: {$splice: [[slotIndex, 1]], $push: [data.slotId as Dekk.UUID]}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case SET_BACKGROUND:
			updatedStore = update(state, {
				[slideIndex]: {
					format: {
						$merge: data.format as Dekk.SlideFormat
					}
				}
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		case REMOVE:
			updatedStore = update(state, {
				$splice: [[slideIndex, 1]]
			});
			electronStore.set("slides", updatedStore);
			return updatedStore;
		default:
			electronStore.set("slides", state);
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


export const reorder = (uuid: Dekk.UUID, from: number, to: number) => ({
	type: REORDER,
	data: {from, to, uuid}
});

export const replace = (slides: Dekk.SlideModel[]) => ({
	type: REPLACE,
	data: {slides}
});

export default reducer;
