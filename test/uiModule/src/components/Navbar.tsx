import { useDispatch } from 'react-redux';
import { Section, setSection } from "../redux/slice/section";

export default function Navbar() {
	const dispatch = useDispatch();

	const NavButton = ({ section, label }: { section: Section; label: string }) => (
		<button
			onClick={() => {dispatch(setSection(section))}}
			className="text-[#ffa600] hover:text-white transition-colors duration-300 text-sm mr-4 py-2"
		>
			{label}
		</button>
	);
	
	return (
		<nav className="p-4">
			<NavButton section={Section.VOTE} label="투표하기(Verify & Vote)" />
			<NavButton section={Section.VC} label="신분 등록(VC Issue)" />
			<NavButton section={Section.VP} label="인증 정보 선택(VP Generate)" />
			<NavButton section={Section.VP_LIST} label="내 VP 관리(My VPs)" />
			<NavButton section={Section.TALLY} label="투표 결과 확인(Check final results)" />
		</nav>
	)
}