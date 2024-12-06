import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialMessageState = {
	message: ""
};

const messageSlice = createSlice({
	name: "message",
	initialState: initialMessageState,
	reducers: {
		setMessage: (state, action: PayloadAction<string>) => {
			state.message = action.payload;
		}
	}
});

export default messageSlice;
export const { setMessage } = messageSlice.actions;