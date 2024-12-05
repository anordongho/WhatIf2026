import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import VoteSection from './components/VoteSection';
import VCSection from './components/VCSection';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./redux/store/store";
import { Section } from "./redux/slice/section";
import VPSection from './components/VPSection';
import VPListSection from './components/VPListSection';
import TallySection from './components/TallySection';
import { WaitingStatus } from "./redux/slice/waiting";
import LoadingScreen from "./components/common/LoadingScreen";

const VotingApp = () => {
	const currentSection = useSelector((state: RootState) => state.sectionReducer.currentSection);
	const [loadingDots, setLoadingDots] = useState('');
	// const loadingDots = useSelector((state: RootState) => state.loadingDotsReducer.loadingDots);
	const waitingStatus = useSelector((state: RootState) => state.waitingReducer.waitingStatus);
	// const dispatch = useDispatch();
	// const handleSectionClick = (section: string) => {
	// 	setCurrentSection(section);
	// 	setMessage('');
	// }

	useEffect(() => {
		let interval: NodeJS.Timeout;
		if (waitingStatus !== WaitingStatus.IDLE) {
			interval = setInterval(() => {
				setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
			}, 500);
		}
		return () => clearInterval(interval);
	}, [waitingStatus]);


	return (
		<div className="bg-black text-white min-h-screen flex flex-col" style={{ fontFamily: '"Pretendard", "DM Serif Display", serif' }}>
			<Navbar />
			<div className="flex-grow flex items-center justify-center">
				<div className="max-w-md w-full px-6 py-8">
					{waitingStatus === WaitingStatus.ISSUINGVC ? (
						<LoadingScreen loadingDots={loadingDots} message="Issuing your VC" />
					) : waitingStatus === WaitingStatus.PRESENTINGVP ? (
						<LoadingScreen loadingDots={loadingDots} message="Presenting your VP" />
					) : waitingStatus === WaitingStatus.VERIFYING ? (
						<LoadingScreen loadingDots={loadingDots} message="Verifying your VP" />
					) : (
						<>
							{currentSection === Section.VOTE && <VoteSection />}
							{currentSection === Section.VC && <VCSection />}
							{currentSection === Section.VP && <VPSection />}
							{currentSection === Section.VP_LIST && <VPListSection />}
							{currentSection === Section.TALLY && <TallySection />}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default VotingApp;