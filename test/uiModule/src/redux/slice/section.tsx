import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Section {
	VOTE = "vote",
	VC = "vc",
	VP = "vp",
	VP_LIST = "vplist",
	TALLY = "tally"
}

const initialSectionState = {
	currentSection: Section.VOTE
};

const sectionSlice = createSlice({
	name: "section",
	initialState: initialSectionState,
	reducers: {
		setSection: (state, action: PayloadAction<Section>) => {
			state.currentSection = action.payload;
		}
	}
});

export default sectionSlice;
export const { setSection } = sectionSlice.actions;