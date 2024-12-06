import { configureStore } from "@reduxjs/toolkit";

import sectionSlice from "../slice/section";
import messageSlice from "../slice/message";
import errorMessageSlice from "../slice/errorMessage";
import vpListSlice from "../slice/vpList";
import voterVerifiedSlice from "../slice/verified";
import vcCodeSlice from "../slice/vcCode";
import { vcDataSlice, vcDataErrorSlice } from "../slice/vcData";
import { loadingDotsSlice, waitingSlice } from "../slice/waiting";
import vpSelectedSlice from "../slice/vpSelected";

const store = configureStore({
    reducer: {
        sectionReducer: sectionSlice.reducer,
        waitingReducer: waitingSlice.reducer,
        messageReducer: messageSlice.reducer,
        loadingDotsReducer: loadingDotsSlice.reducer,
        errorMessageReducer: errorMessageSlice.reducer,
        vcDataReducer: vcDataSlice.reducer,
        vcDataErrorReducer: vcDataErrorSlice.reducer,
        vcCodeReducer: vcCodeSlice.reducer,
        vpListReducer: vpListSlice.reducer,
        vpSelectedReducer: vpSelectedSlice.reducer,
        voterVerifiedReducer: voterVerifiedSlice.reducer,
    }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;