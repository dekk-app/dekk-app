import {createStore, combineReducers} from "redux";
import currentSlide from "./current-slide";
import currentSlot from "./current-slot";
import slides from "./slides";
import slots from "./slots";

const store = createStore(
	combineReducers({
		currentSlide,
		currentSlot,
		slides,
		slots
	})
);

export default store;
