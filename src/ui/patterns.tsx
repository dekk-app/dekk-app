import React from "react";
import {palette} from "../theme";
import {DropShadow} from "./dropdown";

const Swirl: React.FunctionComponent<{id: string; colors: string[]}> = ({id, colors}) => (
	<pattern id={id} width="24" height="24" patternUnits="userSpaceOnUse">
		<mask id={`crescent_${id}`}>
			<rect height="24" width="24" fill="white" />
			<circle
				cx="12"
				cy="12"
				r={Math.sqrt(2) * 6}
				fill="black"
				transform={`rotate(${360 / colors.length}, 6, 6)`}
			/>
		</mask>
		<rect height="24" width="24" fill="white" />
		<g transform="translate(6, 6)">
			{colors.map((color, i) => (
				<circle
					key={color}
					cx="12"
					cy="12"
					r={Math.sqrt(2) * 6}
					mask={`url(#crescent_${id})`}
					fill={colors[i % colors.length]}
					transform={`rotate(${(360 / colors.length) * i}, 6, 6)`}
				/>
			))}
		</g>
	</pattern>
);

const colors = [
	palette.indigo[500],
	palette.teal[500],
	palette.green[500],
	palette.yellow[500],
	palette.red[500],
	palette.pink[500]
];
export default () => (
	<svg style={{position: "absolute", left: "100%", bottom: "100%", height: 0, width: 0}}>
		<defs>
			<DropShadow />
			<Swirl id="rainbowSwirl" colors={colors} />
		</defs>
	</svg>
);
