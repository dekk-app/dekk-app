import React from "react";
import {v4 as uuid} from "uuid";
import styled, {css} from "styled-components";

const StyledInput = styled.input.attrs({
	type: "file"
})`
	position: absolute;
	top: 0;
	right: calc(100% + 1rem);
`;

const StyledInputWrapper = styled.div`
	position: relative;
	overflow: hidden;
`;

const StyledInputLabel = styled.label`
	position: relative;
	display: inline-flex;
	align-content: center;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 4px 16px;
	height: 24px;
	line-height: 1;
	min-width: 40px;
	width: max-content;
	border: 0;
	border-radius: 3px;
	${({theme}) => css`
		background: ${theme.button.background2};
		color: ${theme.button.color};
		box-shadow: inset 0 1px 0 ${theme.button.borderColor1},
			inset 0 -1px 0 ${theme.button.borderColor2};

		&:active {
			background: ${theme.button.background1};
		}
	`};
`;

export const FileInput: React.FunctionComponent<{
	onChange: (props: {src: string; filename: string}) => void;
	filename?: string;
}> = props => {
	const id = React.useMemo(() => uuid(), [props]);
	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const reader = new FileReader();
			const {files} = e.target;
			const [file] = files;
			reader.addEventListener("load", () => {
				props.onChange({
					src: reader.result as string,
					filename: file.name as string
				});
			});
			reader.readAsDataURL(file);
		}
	};

	return (
		<StyledInputWrapper>
			<dl>
				<dt>File Info</dt>
				<dd>{props.filename}</dd>
			</dl>
			<StyledInputLabel htmlFor={id}>Replace</StyledInputLabel>
			<StyledInput onChange={onSelectFile} id={id} />
		</StyledInputWrapper>
	);
};
