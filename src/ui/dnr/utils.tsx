import {PositionModel, SizeModel} from "./types";

export const withAlt = (value: number, altKey: boolean) => (altKey ? value * 2 : value);
const getAspectRatio = ({height, width}: SizeModel): number => width / height;
export const withAspectRatio = (value: number, size: SizeModel, reverse?: boolean) =>
	reverse ? value / getAspectRatio(size) : value * getAspectRatio(size);
export const to360 = (n: number): number => (n + 360) % 360;
export const coordinatesToDeg = (position: PositionModel, center: PositionModel): number => {
	const x = position.x - center.x;
	const y = position.y - center.y;
	return to360((Math.atan2(y, x) * 180) / Math.PI);
};

export const degToRad = (deg: number): number => deg * Math.PI / 180;
export const radToDeg = (rad: number): number => rad * 180 / Math.PI;
export const getHypotenuse = (opposite: number, adjacent: number): number =>
	Math.sqrt(opposite * opposite + adjacent * adjacent);

export const cos = (deg: number): number => Math.cos(degToRad(deg));
export const sin = (deg: number): number => Math.sin(degToRad(deg));
export const tan = (deg: number): number => Math.tan(degToRad(deg));
export const atan2 = (opposite: number, adjacent: number): number =>
	radToDeg(Math.atan2(opposite, adjacent));
export const round = (n: number, precision: number = 0.0001): number => {
	const m = Math.round(n / precision) * precision;
	return m === -0 ? 0 : m;
};
export const withRotation = (dX: number, dY: number, deg: number) => {
	const C = getHypotenuse(dX, dY);
	const beta = atan2(dY, dX);
	const B = C * sin(beta - deg);
	const A = C * cos(beta - deg);
	return {
		x: A,
		y: B
	};
};
