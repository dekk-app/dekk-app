import {createStore, combineReducers} from "redux";
import currentSlide from "./current-slide";
import currentSlot from "./current-slot";
import slides from "./slides";
import slots from "./slots";
import {store as electronStore} from "./electron";
import {convertFromRaw, EditorState} from "draft-js";
import Dekk from "../types";

const preloadedState = {
	slides: electronStore.get("slides") || [],
	slots: (electronStore.get("slots") || []).map((slot: Dekk.SlotModel) => ({
		...slot,
		editorState: slot.editorState
			? EditorState.createWithContent(convertFromRaw(slot.editorState))
			: undefined
	})),
	currentSlide: "",
	currentSlot: ""
};

const store = createStore(
	combineReducers({
		currentSlide,
		currentSlot,
		slides,
		slots
	}),
	preloadedState
);

export default store;
