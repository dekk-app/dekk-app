import React from "react";
import {Select} from "./select";

export const EditSelect: React.FunctionComponent<{
	cmd: string;
	name?: string;
	options: {value: string; label: string}[];
}> = props => {
	return (
		<Select
			key={props.cmd}
			name={props.name}
			onChange={(evt: React.ChangeEvent<Element>) => {
				evt.preventDefault();
				const {value} = evt.target as HTMLSelectElement;
				document.execCommand(props.cmd, false, value);
			}}
			options={props.options}
		/>
	);
};
