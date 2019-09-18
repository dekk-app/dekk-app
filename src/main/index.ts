import {app, BrowserWindow, ipcMain, Menu, shell} from "electron";
import path from "path";
import {format as formatUrl} from "url";
import {disableZoom} from "electron-util";
const isDevelopment = process.env.NODE_ENV !== "production";

const ColorpickerEvents = {
	OnRequest: "on-colorpicker-request",
	OnChange: "on-colorpicker-change",
	OnClose: "on-colorpicker-close",
	OnOpen: "on-colorpicker-open"
};

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

const buildTemplate  = (window: BrowserWindow) => [
	{
		label: "File",
		submenu: [
			{
				label: "Open",
				accelerator: "CommandOrControl+O",
				click: async () => {
					window.webContents.send("open-dekk");
				}
			},
			{
				label: "New",
				accelerator: "CommandOrControl+N",
				click: async () => {
					window.webContents.send("new-dekk");
				}
			},
			{
				label: "Save",
				accelerator: "CommandOrControl+S",
				click: async () => {
					window.webContents.send("save-dekk");
				}
			},
			{
				label: "Save As",
				accelerator: "CommandOrControl+Shift+S",
				click: async () => {
					window.webContents.send("save-as-dekk");
				}
			},
			{role: "close"},
			{role: "quit"}
		]
	},
	{
		label: 'View',
		submenu: [
			{ role: 'reload' },
			{ role: 'forcereload' },
			{ role: 'toggledevtools' },
			{ type: 'separator' },
			{ role: 'resetzoom' },
			{ role: 'zoomin' },
			{ role: 'zoomout' },
			{ type: 'separator' },
			{ role: 'togglefullscreen' }
		]
	},
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
		x: 1000,
		y: 100,
		width: 1800,
		height: 1000,
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

	disableZoom(window);
	// @ts-ignore
	const menu = Menu.buildFromTemplate(buildTemplate(window));
	Menu.setApplicationMenu(menu);


	if (isDevelopment) {
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?route=home`);
		popover.loadURL(
			`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}?route=colorpicker`
		);
	} else {
		window.loadURL(
			formatUrl({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true,
				query: {route: "home"}
			})
		);
		popover.loadURL(
			formatUrl({
				pathname: path.join(__dirname, "index.html"),
				protocol: "file",
				slashes: true,
				query: {route: "colorpicker"}
			})
		);
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
	popover.hide();
	// transparency clicks!
	popover.setIgnoreMouseEvents(true, {forward: true});
	const events: string[] = Object.values(ColorpickerEvents);

	events.forEach(eventName => {
		ipcMain.on(eventName, (event, data) => {
			if (eventName === ColorpickerEvents.OnRequest) {
				popover.webContents.send(eventName, data);
				// popover.show();
			} else if (eventName === ColorpickerEvents.OnChange) {
				window.webContents.send(eventName, data);
			}
		});
	});

	window.on("focus", () => {
		popover.webContents.send(ColorpickerEvents.OnClose, {});
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
