import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialErrorMessageState = {
	errorMessage: ""
};

const errorMessageSlice = createSlice({
	name: "message",
	initialState: initialErrorMessageState,
	reducers: {
		setErrorMessage: (state, action: PayloadAction<string>) => {
			state.errorMessage = action.payload;
		}
	}
});

export default errorMessageSlice;
export const { setErrorMessage } = errorMessageSlice.actions;