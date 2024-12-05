import React, { useState } from "react";
import Navbar from "./components/Navbar";
import VoteSection from './components/VoteSection';
import VCSection from './components/VCSection';
import { useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import { Section } from "./redux/slice/section";
import VPSection from './components/VPSection';
// import VPListSection from './components/VPListSection';
// import TallySection from './components/TallySection';

const VotingApp = () => {
	const currentSection = useSelector((state: RootState) => state.sectionReducer.currentSection);
	// const [message, setMessage] = useState('');

	// const handleSectionClick = (section: string) => {
	// 	setCurrentSection(section);
	// 	setMessage('');
	// }

	return (
		<div className="bg-black text-white min-h-screen flex flex-col" style={{ fontFamily: '"Pretendard", "DM Serif Display", serif' }}>
			<Navbar />
			<div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8">
					{currentSection == Section.VOTE && <VoteSection />}
					{currentSection == Section.VC && <VCSection />}
					{currentSection === "vp" && <VPSection />}
					{/* {currentSection === "vplist" && <VPListSection />}
					{currentSection === "tally" && <TallySection />} */}
				</div>
			</div>
		</div>
	);
};

export default VotingApp;