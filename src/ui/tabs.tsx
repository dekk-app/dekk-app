import React from "react";
import styled from "styled-components";

const StyledTab = styled.a<{isActive?: boolean}>`
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	text-align: center;
	padding: 5px 10px;
	font-size: 12px;
	text-decoration: none;
	background: ${props =>
		props.isActive ? props.theme.tabs.backgroundActive : props.theme.tabs.background};
	color: ${props => props.theme.tabs.color};
	box-shadow: inset 0 0 0 0.5px ${props => props.theme.tabs.borderColor};
`;

const StyledTabsHeader = styled.div`
	display: grid;
	grid-template-columns: repeat(${props => React.Children.count(props.children)}, 1fr);
	border-bottom: 1px solid ${props => props.theme.tabs.borderColor};
`;

const StyledTabsContainer = styled.div`
	display: flex;
	background: ${props => props.theme.tabs.background};
	color: ${props => props.theme.tabs.color};
`;

const StyledTabsContent = styled.div`
	flex: 1;
`;

const StyledTabs = styled.div`
	display: flex;
	flex-direction: column;
`;

export interface Tab {
	uuid: string;
	label: React.ReactNode;
	content: React.ReactNode;
}

export interface PopulatedTab extends Tab {
	setActive: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export type Tabs = Tab[];
export type PopulatedTabs = PopulatedTab[];

export interface TabsProps {
	tabs: Tab[];
	defaultActive: number;
}

export const useTabs = (tabs: Tabs, initialState: number): [number, PopulatedTabs] => {
	const [activeTab, setActiveTab] = React.useState<number>(initialState);
	return [
		activeTab,
		tabs.map((tab, index) => ({
			...tab,
			setActive: e => {
				e.preventDefault();
				setActiveTab(index);
			}
		}))
	];
};

export const Tabs: React.FunctionComponent<TabsProps> = props => {
	const [activeTab, tabs] = useTabs(props.tabs, props.defaultActive);
	return (
		<StyledTabs>
			<StyledTabsHeader>
				{tabs.map(({uuid, label, setActive}, index) => (
					<StyledTab
						key={uuid}
						href={`#${index}`}
						onClick={setActive}
						isActive={index == activeTab}>
						{label}
					</StyledTab>
				))}
			</StyledTabsHeader>
			<StyledTabsContainer>
				<StyledTabsContent>{props.tabs[activeTab].content}</StyledTabsContent>
			</StyledTabsContainer>
		</StyledTabs>
	);
};

Tabs.defaultProps = {
	defaultActive: 0
};
