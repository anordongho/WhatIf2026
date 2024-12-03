import React from "react";

export default function Navbar(
	props: {
		onSectionClick: (section: string) => void,
		// setCurrentSection: (section: string) => void,
		// setMessage: (message: string) => void
	}
) {
	const { onSectionClick } = props;

	const NavButton = ({ section, label }: { section: string; label: string }) => (
		<button
			onClick={() => {
				onSectionClick(section);
			}}
			className="text-[#ffa600] hover:text-white transition-colors duration-300 text-sm mr-4 py-2"
		>
			{label}
		</button>
	);
	
	return (
		<nav className="p-4">
			<NavButton section="vote" label="투표하기(Verify & Vote)" />
			<NavButton section="vc" label="신분 등록(VC Issue)" />
			<NavButton section="vp" label="인증 정보 선택(VP Generate)" />
			<NavButton section="vplist" label="내 VP 관리(My VPs)" />
			<NavButton section="tally" label="투표 결과 확인(Check final results)" />
			{/* <button onClick={() => setCurrentSection("vote")}>투표하기(Verify & Vote)</button>
			<button onClick={() => setCurrentSection("vc")}>신분 등록(VC Issue)</button>
			<button onClick={() => setCurrentSection("vp")}>인증 정보 선택(VP Generate)</button>
			<button onClick={() => setCurrentSection("vplist")}>내 VP 관리(My VPs)</button>
			<button onClick={() => setCurrentSection("tally")}>투표 결과 확인(Check final results)</button> */}
		</nav>
	)
}

// const NavButton = ({ section, label }: { section: string; label: string }) => (
// 	<button
// 		onClick={() => {
// 			// setCurrentSection(section);
// 			// setMessage('');
// 		}}
// 		className="text-[#ffa600] hover:text-white transition-colors duration-300 text-sm mr-4 py-2"
// 	>
// 		{label}
// 	</button>
// );

// export default Navbar;