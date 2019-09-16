import React from "react";

const useOutsideClick = (
	ref: React.RefObject<any>,
	cb: (isOutside: boolean, event: MouseEvent) => void
) => {
	const handleClick = (event: MouseEvent) =>
		cb(ref.current && !ref.current.contains(event.target), event);

	React.useEffect(() => {
		document.addEventListener("click", handleClick);
		return () => {
			document.removeEventListener("click", handleClick);
		};
	});
};

export const OutsideClick: React.FunctionComponent<{
	componentProps: {[key: string]: any};
	component: React.ForwardRefExoticComponent<any>;
	onInsideClick?: (e: MouseEvent) => void;
	onOutsideClick?: (e: MouseEvent) => void;
}> = props => {
	const ref = React.useRef(null);
	const cb = (isOutside: boolean, e: MouseEvent) => {
		if (isOutside) {
			props.onOutsideClick && props.onOutsideClick(e);
		} else {
			props.onInsideClick && props.onInsideClick(e);
		}
	};
	useOutsideClick(ref, cb);

	return (
		<props.component ref={ref} {...props.componentProps}>
			{props.children}
		</props.component>
	);
};
