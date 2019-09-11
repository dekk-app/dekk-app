import {config} from "dotenv";
config();
import Unsplash from "unsplash-js";
const options = {
	applicationId: process.env.UNSPLASH_ACCESS_KEY as string,
	secret: process.env.UNSPLASH_SECRET_KEY as string
};
export const unsplash = new Unsplash(options);

export const getRandomPhoto = ({
	width,
	height
}: {
	width: number;
	height: number;
}): Promise<{[key: string]: any}> =>
	unsplash.photos.getRandomPhoto({width, height}).then(response => response.json());
