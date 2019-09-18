import React from "react";
import {createPortal} from "react-dom";

export const IFrame: React.FunctionComponent = ({ children, ...props }) => {
	const [contentRef, setContentRef] = React.useState();
	const mountNode = contentRef && contentRef.contentWindow.document.body;

	return (
		<iframe {...props} ref={setContentRef}>
			{mountNode &&
			createPortal(
				React.Children.only(children),
				mountNode
			)}
		</iframe>
	)
}
