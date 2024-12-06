import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialVcCodeState: { vcCode: string } = {
    vcCode: ''
};

const vcCodeSlice = createSlice({
    name: 'vcCode',
    initialState: initialVcCodeState,
    reducers: {
        setVcCode: (state, action: PayloadAction<string>) => {
            state.vcCode = action.payload;
        },
    }
});

export default vcCodeSlice;
export const { setVcCode } = vcCodeSlice.actions;