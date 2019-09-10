import {app, BrowserWindow, Menu, shell} from "electron";
import * as path from "path";
import {format as formatUrl} from "url";
import {disableZoom} from "electron-util";
const isDevelopment = process.env.NODE_ENV !== "production";

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
		transparent: true,
		backgroundColor: "#00000000",
		width: 1800,
		height: 1000,
		minWidth: 1200,
		minHeight: 600,
		icon: path.join(process.cwd(), "build/icon.png")
	});

	disableZoom(window);

	if (isDevelopment) {
		window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
		window.webContents.openDevTools();
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
