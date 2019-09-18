import React from "react";
import {ipcRenderer, IpcRendererEvent} from "electron";

export enum ColorpickerEvent {
	OnRequest = "on-colorpicker-request",
	OnChange = "on-colorpicker-change",
	OnClose = "on-colorpicker-close",
	OnOpen = "on-colorpicker-open"
}
export type ColorpickerEventHandler<T> = (event: IpcRendererEvent, data: T) => void;

export interface ColorpickerResponse {
	path: null | string;
	colorValue: null | string;
}

export interface ColorpickerPointer {
	clientX: number;
	clientY: number;
}

export interface ColorpickerRequest {
	path: null | string;
	value: string;
}

export interface ColorpickerRequestData {
	pointer: ColorpickerPointer;
	request: ColorpickerRequest;
}

export interface ColorpickerChangeData {
	response: ColorpickerResponse;
}

export type ColorpickerWithData = {
	[ColorpickerEvent.OnChange]?: ColorpickerChangeData;
	[ColorpickerEvent.OnRequest]?: ColorpickerRequestData;
	[ColorpickerEvent.OnOpen]?: {};
	[ColorpickerEvent.OnClose]?: {};
};

export type ColorpickerListeners = {
	[ColorpickerEvent.OnChange]?: ColorpickerEventHandler<ColorpickerChangeData>;
	[ColorpickerEvent.OnRequest]?: ColorpickerEventHandler<ColorpickerRequestData>;
	[ColorpickerEvent.OnOpen]?: ColorpickerEventHandler<undefined>;
	[ColorpickerEvent.OnClose]?: ColorpickerEventHandler<undefined>;
};

export type EventListeners = ColorpickerListeners;
export type EventsWithData = ColorpickerWithData;

export interface BroadcastProps {
	eventsWithData: EventsWithData;
}

export interface SubscribeProps {
	eventListeners: EventListeners;
}

export const useBroadcast = (eventsWithData: EventsWithData, dependencies: any[] = []) => {
	React.useEffect(() => {
		if (dependencies.filter(Boolean).length) {
			Object.entries(eventsWithData).forEach(([event, data]) => {
				ipcRenderer.send(event, data);
			});
		}
	}, [...dependencies]);
};

export const useSubscribe = (eventListeners: EventListeners, dependencies: any[] = []) => {
	React.useEffect(() => {
		Object.entries(eventListeners).forEach(([event, listener]) => {
			listener && ipcRenderer.addListener(event, listener);
		});
		return () => {
			Object.entries(eventListeners).forEach(([event, listener]) => {
				listener && ipcRenderer.removeListener(event, listener);
			});
		};
	}, [...dependencies]);
};

export const Broadcast: React.FunctionComponent<BroadcastProps> = ({eventsWithData}) => {
	useBroadcast(eventsWithData);
	return null;
};

export const Subscribe: React.FunctionComponent<SubscribeProps> = ({eventListeners}) => {
	useSubscribe(eventListeners);
	return null;
};
