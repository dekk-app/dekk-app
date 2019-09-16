import React from "react";
import {ipcRenderer, IpcRendererEvent} from "electron";

export enum ColorPickerEvent {
	OnRequest = "on-colorpicker-request",
	OnChange = "on-colorpicker-change",
	OnClose = "on-colorpicker-close",
	OnOpen = "on-colorpicker-open"
}
export type ColorPickerEventHandler<T> = (event: IpcRendererEvent, data: T) => void;

export interface ColorPickerResponse {
	path: null | string;
	colorValue: null | string;
}

export interface ColorPickerPointer {
	clientX: number;
	clientY: number;
}

export interface ColorPickerRequest {
	path: null | string;
	value: string;
}

export interface ColorPickerRequestData {
	pointer: ColorPickerPointer;
	request: ColorPickerRequest;
}

export interface ColorPickerChangeData {
	response: ColorPickerResponse;
}

export type ColorpickerWithData = {
	[ColorPickerEvent.OnChange]?: ColorPickerChangeData;
	[ColorPickerEvent.OnRequest]?: ColorPickerRequestData;
	[ColorPickerEvent.OnOpen]?: {};
	[ColorPickerEvent.OnClose]?: {};
};

export type ColorPickerListeners = {
	[ColorPickerEvent.OnChange]?: ColorPickerEventHandler<ColorPickerChangeData>;
	[ColorPickerEvent.OnRequest]?: ColorPickerEventHandler<ColorPickerRequestData>;
	[ColorPickerEvent.OnOpen]?: ColorPickerEventHandler<undefined>;
	[ColorPickerEvent.OnClose]?: ColorPickerEventHandler<undefined>;
};

export type EventListeners = ColorPickerListeners;
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
