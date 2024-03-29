import React from "react";
import {hot} from "react-hot-loader/root";
import {ThemeProvider} from "styled-components";
import theme from "../theme";
import {Frame} from "../ui/frame";
import {remote} from "electron";
import contextMenu from "electron-context-menu";
import {connect, Provider} from "react-redux";
import store from "../store";
import {moveFirst, moveLast} from "../store/slides";
import Dekk from "../types";
import {Router} from "react-router-static";
import {Colorpicker} from "./colorpicker";

const {systemPreferences, nativeTheme} = remote;

let element: HTMLElement;
window.addEventListener("contextmenu", function(e: MouseEvent) {
	element = e.target as HTMLElement;
});
// @ts-ignore
contextMenu({
	shouldShowMenu: () => {
		const ancestorSlot = (element as HTMLElement).closest("[data-dekk-slot]");
		return Boolean(ancestorSlot);
	},
	prepend: () => {
		return [
			{
				label: "Bring to front",
				click: () => {
					const ancestorSlot = (element as HTMLElement).closest("[data-dekk-slot]");
					if (ancestorSlot) {
						const event = new Event("dekk-bring-to-front");
						window.dispatchEvent(event);
					}
				}
			},
			{
				label: "Send to back",
				click: () => {
					const ancestorSlot = (element as HTMLElement).closest("[data-dekk-slot]");
					if (ancestorSlot) {
						const event = new Event("dekk-send-to-back");
						window.dispatchEvent(event);
					}
				}
			}
		];
	}
});
const ContextMenuImpl = (props: {
	currentSlot: Dekk.UUID;
	currentSlide: Dekk.UUID;
	moveSlotFirst: (uuid: Dekk.UUID, slideId: Dekk.UUID) => void;
	moveSlotLast: (uuid: Dekk.UUID, slideId: Dekk.UUID) => void;
}) => {
	React.useEffect(() => {
		const handleBringToFront = () => {
			props.moveSlotFirst(props.currentSlide, props.currentSlot);
		};
		const handleSendToBack = () => {
			props.moveSlotLast(props.currentSlide, props.currentSlot);
		};
		window.addEventListener("dekk-bring-to-front", handleBringToFront);
		window.addEventListener("dekk-send-to-back", handleSendToBack);
		return () => {
			window.removeEventListener("dekk-bring-to-front", handleBringToFront);
			window.removeEventListener("dekk-send-to-back", handleSendToBack);
		};
	}, [props.currentSlot]);
	return null;
};

const ContextMenu = connect(
	({currentSlide, currentSlot}: Dekk.Store) => ({currentSlide, currentSlot}),
	{moveSlotFirst: moveFirst, moveSlotLast: moveLast}
)(ContextMenuImpl);

const TestWindow = () => <React.Fragment>TestWindow</React.Fragment>;
const Home = () => {
	return (
		<React.Fragment>
			<ContextMenu />
			<Frame />
		</React.Fragment>
	);
};

const Error404 = () => <div>404</div>;
const routes = {
	default: Error404,
	home: Home,
	colorpicker: Colorpicker,
	testWindow: TestWindow
};

const App = () => {
	const [dark, setDark] = React.useState(nativeTheme.shouldUseDarkColors);
	React.useEffect(() => {
		const id = systemPreferences.subscribeNotification(
			"AppleInterfaceThemeChangedNotification",
			() => {
				setDark(nativeTheme.shouldUseDarkColors);
			}
		);
		return () => {
			systemPreferences.unsubscribeNotification(id);
		};
	});
	return (
		<Provider store={store}>
			<ThemeProvider theme={dark ? theme.dark : theme.light}>
				<React.Fragment>
					<Router routes={routes} />
				</React.Fragment>
			</ThemeProvider>
		</Provider>
	);
};

export default hot(App);
