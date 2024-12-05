import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type VP = {
	id: string;                // VP 식별자
	createdAt: string;         // 생성 날짜
	selectedFields: string[];  // 선택된 정보 필드들
	vp: {                      // 실제 VP 데이터
		sdjwt: string;
		holder_signature: string
	};
}
type VPList = Array<VP>

const initialVpListState: { vpList: VPList} = {
	vpList: []
};

const vpListSlice = createSlice({
	name: 'sdJwt',
	initialState: initialVpListState,
	reducers: {
		setVpList: (state, action: PayloadAction<VPList>) => {
			state.vpList = action.payload;
		},
		addVp: (state, action: PayloadAction<VP>) => {
			state.vpList.push(action.payload);
		},
		removeVp: (state, action: PayloadAction<string>) => {
			state.vpList = state.vpList.filter(vp => vp.id !== action.payload);
		}
	}
});

export default vpListSlice;
export const { setVpList, addVp, removeVp } = vpListSlice.actions;