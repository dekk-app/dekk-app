import Dekk from "../types";
import {Reducer} from "redux";

const SELECT = "currentSlide:SELECT";

const reducer: Reducer<string | null, {type: string; data: {uuid: Dekk.UUID}}> = (
	state = null,
	{type, data}
) => {
	switch (type) {
		case SELECT:
			return data.uuid;
		default:
			return state;
	}
};

export const select = (uuid: Dekk.UUID) => ({type: SELECT, data: {uuid}});

export default reducer;
