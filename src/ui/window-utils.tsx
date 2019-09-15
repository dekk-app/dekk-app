export const getPointer = (node: HTMLElement) => {
	const {
		left,
		top,
		width,
		height
	} = node.getBoundingClientRect();
	return {clientX: Math.round(left + width / 2), clientY: Math.round(top + height)};
}
