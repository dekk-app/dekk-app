import React from "react";
import {Button} from "./button";

export const EditButton: React.FunctionComponent<{
	cmd: string;
	arg?: string;
}> = props => {
	return (
		<Button
			key={props.cmd}
			onClick={(evt: React.MouseEvent) => {
				evt.preventDefault();
				document.execCommand(props.cmd, false, props.arg);
			}}>
			{props.children}
		</Button>
	);
};
