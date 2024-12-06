import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VcData {
	name: string;
	id: string;
	unique_id: string;
	email: string;
	address: string;
	phone_number: string;
	gender: string;
	birth_date: string;
	citizenship: string;
}

export type VcDataError = VcData;

const initialVcDataState: {vcData: VcData} = {
	vcData: {
		name: '',
		id: '',
		unique_id: '',
		email: '',
		address: '',
		phone_number: '',
		gender: '',
		birth_date: '1990-01-01',
		citizenship: '',
	}
};

export const vcDataSlice = createSlice({
	name: "vcData",
	initialState: initialVcDataState,
	reducers: {
		setVcData: (state, action: PayloadAction<VcData>) => {
			state.vcData = action.payload;
		}
	}
});

const initialVcDataErrorState: {vcDataError: VcDataError} = {
	vcDataError: {
		name: '',
		id: '',
		unique_id: '',
		email: '',
		address: '',
		phone_number: '',
		gender: '',
		birth_date: '',
		citizenship: '',
	}
};

export const vcDataErrorSlice = createSlice({
	name: "vcDataError",
	initialState: initialVcDataErrorState,
	reducers: {
		setVcDataError: (state, action: PayloadAction<VcDataError>) => {
			state.vcDataError = action.payload;
		}
	}
});

export const { setVcData } = vcDataSlice.actions;
export const { setVcDataError } = vcDataErrorSlice.actions;