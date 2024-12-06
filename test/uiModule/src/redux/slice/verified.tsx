import { createSlice } from '@reduxjs/toolkit';

const initialVerifiedState: { isVoterVerified: boolean} = {
    isVoterVerified: false
};

const voterVerifiedSlice = createSlice({
    name: 'voterVerified',
    initialState: initialVerifiedState,
    reducers: {
        setVoterVerified: (state) => {
            state.isVoterVerified = true;
        },
        setVoterUnverified: (state) => {
            state.isVoterVerified = false;
        }
    }
});

export default voterVerifiedSlice;
export const { setVoterVerified, setVoterUnverified } = voterVerifiedSlice.actions;