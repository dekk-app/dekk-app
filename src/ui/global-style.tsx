import {createGlobalStyle} from "styled-components";
import png_nRotate1x from "./dnr/cursors/images/n-rotate.png";
import png_nRotate2x from "./dnr/cursors/images/n-rotate@2x.png";
import png_sRotate1x from "./dnr/cursors/images/s-rotate.png";
import png_sRotate2x from "./dnr/cursors/images/s-rotate@2x.png";
import png_wRotate1x from "./dnr/cursors/images/w-rotate.png";
import png_wRotate2x from "./dnr/cursors/images/w-rotate@2x.png";
import png_eRotate1x from "./dnr/cursors/images/e-rotate.png";
import png_eRotate2x from "./dnr/cursors/images/e-rotate@2x.png";
import png_neRotate1x from "./dnr/cursors/images/ne-rotate.png";
import png_neRotate2x from "./dnr/cursors/images/ne-rotate@2x.png";
import png_nwRotate1x from "./dnr/cursors/images/nw-rotate.png";
import png_nwRotate2x from "./dnr/cursors/images/nw-rotate@2x.png";
import png_seRotate1x from "./dnr/cursors/images/se-rotate.png";
import png_seRotate2x from "./dnr/cursors/images/se-rotate@2x.png";
import png_swRotate1x from "./dnr/cursors/images/sw-rotate.png";
import png_swRotate2x from "./dnr/cursors/images/sw-rotate@2x.png";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		background: none;
		font-family: sans-serif;
		
		&.n-rotate * {
			cursor: -webkit-image-set(url("${png_nRotate1x}") 1x, url("${png_nRotate2x}") 2x) 9 9, auto !important;
		}
		&.e-rotate * {
			cursor: -webkit-image-set(url("${png_eRotate1x}") 1x, url("${png_eRotate2x}") 2x) 9 9, auto !important;
		}
		&.s-rotate * {
			cursor: -webkit-image-set(url("${png_sRotate1x}") 1x, url("${png_sRotate2x}") 2x) 9 9, auto !important;
		}
		&.w-rotate * {
			cursor: -webkit-image-set(url("${png_wRotate1x}") 1x, url("${png_wRotate2x}") 2x) 9 9, auto !important;
		}
		&.nw-rotate * {
			cursor: -webkit-image-set(url("${png_nwRotate1x}") 1x, url("${png_nwRotate2x}") 2x) 9 9, auto !important;
		}
		&.ne-rotate * {
			cursor: -webkit-image-set(url("${png_neRotate1x}") 1x, url("${png_neRotate2x}") 2x) 9 9, auto !important;
		}
		&.sw-rotate * {
			cursor: -webkit-image-set(url("${png_swRotate1x}") 1x, url("${png_swRotate2x}") 2x) 9 9, auto !important;
		}
		&.se-rotate * {
			cursor: -webkit-image-set(url("${png_seRotate1x}") 1x, url("${png_seRotate2x}") 2x) 9 9, auto !important;
		}

		&.row-resize * {
			cursor: row-resize !important;
		}
		&.nesw-resize * {
			cursor: nesw-resize !important;
		}
		&.col-resize * {
			cursor: col-resize !important;
		}
		&.nwse-resize * {
			cursor: nwse-resize !important;
		}
		&.row-resize * {
			cursor: row-resize !important;
		}
		&.nesw-resize * {
			cursor: nesw-resize !important;
		}
		&.col-resize * {
			cursor: col-resize !important;
		}
		&.nwse-resize * {
			cursor: nwse-resize !important;
		}
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	.textAlignCenter .public-DraftStyleDefault-block {
		text-align: center;
	}

	.textAlignLeft .public-DraftStyleDefault-block {
		text-align: left;
	}

	.textAlignRight .public-DraftStyleDefault-block {
		text-align: right;
	}

	.textAlignJustify .public-DraftStyleDefault-block {
		text-align: justify;
	}

	.DraftEditor-root, .public-DraftEditorPlaceholder-root {
		width: 100%;
		text-align: inherit;
	}
`;
