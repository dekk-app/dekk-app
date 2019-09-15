import {app, BrowserWindow, Menu, shell, ipcMain} from "electron";
import * as path from "path";
import {format as formatUrl} from "url";
import {disableZoom} from "electron-util";
const isDevelopment = process.env.NODE_ENV !== "production";

const ColorPickerEvents = {
	OnRequest: "on-colorpicker-request",
	OnChange: "on-colorpicker-change",
	OnClose: "on-colorpicker-close",
	OnOpen: "on-colorpicker-open"
}

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

const webPreferences = isDevelopment
	? {
			nodeIntegration: true
	  }
	: {
			nodeIntegration: true,
			devTools: false
	  };

const template = [
	{
		role: "help",
		submenu: [
			{
				label: "Learn More",
				click: async () => {
					await shell.openExternal("https://github.com/dekk-app/dekk");
				}
			}
		]
	}
];

function createMainWindow() {
	const window = new BrowserWindow({
		webPreferences,
		titleBarStyle: "hidden",
		movable: true,
		x: 600,
		y: 100,
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 600,
		icon: path.join(process.cwd(), "build/icon.png")
	});

	const popover = new BrowserWindow({
		webPreferences,
		resizable: false,
		transparent: true,
		movable: false,
		titleBarStyle: "customButtonsOnHover",
		closable: false,
		minimizable: false,
		maximizable: false,
		alwaysOnTop: true,
		fullscreenable: false,
		hasShadow: true,
		frame: false,
		backgroundColor: "#00000000",
		width: 216,
		height: 216,
		parent: window
	});

	//const testWindow = new BrowserWindow({
	//	webPreferences,
	//	width: 400,
	//	height: 300,
	//});

	disableZoom(window);

	if (isDevelopment) {
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?route=home`);
		popover.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?route=colorpicker`);
		//testWindow.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?route=testWindow`);
		popover.hide();
		// transparency clicks!
		popover.setIgnoreMouseEvents(true, {forward: true});
		//ipcMain.on("open-popover", (event, {clientX, clientY}) => {
			// const {size} = screen.getPrimaryDisplay();
			// const [x, y] = window.getPosition();
			// const {height, width} = size;
			// const maxLeft = width - 220;
			// const maxTop = height - 150;
			// popover.setPosition(Math.min(maxLeft, clientX + x), Math.min(maxTop, clientY + y));
			//popover.show();
		//});

		const events: string[] = Object.values(ColorPickerEvents);

		events.forEach(eventName => {
			ipcMain.on(eventName, (event, data) => {
				if (eventName === ColorPickerEvents.OnRequest) {
					popover.webContents.send(eventName, data);
					// popover.show();
				} else if (eventName === ColorPickerEvents.OnChange) {
					window.webContents.send(eventName, data);
				}
			});
		});

		window.on("focus", () => {
			popover.webContents.send(ColorPickerEvents.OnClose, {});
		});

	} else {
		window.loadURL(
			formatUrl({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true
			})
		);
		// @ts-ignore
		const menu = Menu.buildFromTemplate(template);
		Menu.setApplicationMenu(menu);
	}

	window.on("closed", () => {
		mainWindow = null;
	});

	window.webContents.on("devtools-opened", () => {
		window.focus();
		setImmediate(() => {
			window.focus();
		});
	});

	return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
	// on macOS it is common for applications to stay open until the user explicitly quits
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	// on macOS it is common to re-create a window even after all windows have been closed
	if (mainWindow === null) {
		mainWindow = createMainWindow();
	}
});

// create main BrowserWindow when electron is ready
app.on("ready", () => {
	mainWindow = createMainWindow();
	if (isDevelopment) {
		const appName = "Dekk";
		app.setName(appName);
		const appData = app.getPath("appData");
		app.setPath("userData", path.join(appData, appName));
		app.dock.setIcon(path.join(process.cwd(), "build/icon.png"));
	}
});
