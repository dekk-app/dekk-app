import React from "react";
import Draft, {Editor, RichUtils} from "draft-js";
import {Button} from "./button";
import "draft-js/dist/Draft.css";
import {Flex} from "./layout";

const {Provider, Consumer} = React.createContext<{
	editorRef: any;
	editorState: any;
	setEditorState: any;
	toggleInlineStyle: any;
	toggleBlockType: any;
}>({
	editorRef: null,
	editorState: null,
	setEditorState: null,
	toggleInlineStyle: null,
	toggleBlockType: null
});

export const EditorProvider: React.FunctionComponent<any> = props => {
	const {editorState, setEditorState, editorRef} = props;
	const toggleInlineStyle = (inlineStyle: any) => {
		setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
	};
	const toggleBlockType = (blockType: any) =>
		setEditorState(RichUtils.toggleBlockType(editorState, blockType));
	return (
		<Provider
			value={{
				editorRef,
				editorState,
				setEditorState,
				toggleInlineStyle,
				toggleBlockType
			}}>
			{props.children}
		</Provider>
	);
};

export const blockStyleFn = (contentBlock: Draft.ContentBlock): string => {
	const type = contentBlock.getType() as string;
	switch (type) {
		case "text-align-left":
			return "textAlignLeft";
		case "text-align-right":
			return "textAlignRight";
		case "text-align-center":
			return "textAlignCenter";
		case "text-align-justify":
			return "textAlignJustify";
		default:
			return "unstyled";
	}
};

export const SlotEditor: React.ForwardRefExoticComponent<any> = React.forwardRef((props, ref) => {
	return (
		<Flex>
			<Editor
				ref={ref as React.Ref<any>}
				readOnly={props.readOnly}
				editorState={props.editorState}
				placeholder={props.placeholder}
				onChange={props.onChange}
				blockStyleFn={blockStyleFn}
			/>
		</Flex>
	);
});

const StyleButton = (props: any) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		props.onToggle && props.onToggle(props.inlineStyle);
	};
	return (
		<Button
			isActive={props.isActive}
			onClick={handleClick}
			onMouseDown={e => {
				e.preventDefault();
			}}>
			{props.children}
		</Button>
	);
};

const BlockButton = (props: any) => {
	const handleClick = (e: React.MouseEvent) => {
		e.preventDefault();
		props.onToggle && props.onToggle(props.blockType);
	};
	return (
		<Button
			isActive={props.isActive}
			onClick={handleClick}
			onMouseDown={e => {
				e.preventDefault();
			}}>
			{props.children}
		</Button>
	);
};

export const InlineStyleControl = (props: any) => {
	return (
		<Consumer>
			{context => {
				const currentStyle =
					context.editorState && context.editorState.getCurrentInlineStyle();
				return (
					<StyleButton
						isActive={currentStyle && currentStyle.has(props.inlineStyle)}
						onToggle={context.editorState && context.toggleInlineStyle}
						inlineStyle={props.inlineStyle}>
						{props.children}
					</StyleButton>
				);
			}}
		</Consumer>
	);
};

export const BlockStyleControl = (props: any) => {
	return (
		<Consumer>
			{context => {
				const selection = context.editorState && context.editorState.getSelection();
				const currentType =
					context.editorState &&
					context.editorState
						.getCurrentContent()
						.getBlockForKey(selection.getStartKey())
						.getType();
				return (
					<BlockButton
						isActive={currentType === props.blockType}
						onToggle={context.editorState && context.toggleBlockType}
						blockType={props.blockType}>
						{props.children}
					</BlockButton>
				);
			}}
		</Consumer>
	);
};
