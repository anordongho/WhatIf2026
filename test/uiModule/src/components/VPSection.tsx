import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SubmitButton from "./common/SubmitButton";

import { RootState } from "../redux/store/store";
import { setVpList } from "../redux/slice/vpList";
import { setWaitingStatus, WaitingStatus } from "../redux/slice/waiting";
import { setMessage } from "../redux/slice/message";

const VPSection = () => {
	const [vpData, setVpData] = useState({
		name: false,
		id: false,
		unique_id: false,
		email: false,
		address: false,
		phone_number: false,

		gender: false,
		birth_date: false,
		citizenship: false,
	});

	const [sdJwt, setSdJwt] = useState('');
	const [hasSdJwt, setHasSdJwt] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isVPGenerated, setIsVPGenerated] = useState(false);

	const message = useSelector((state: RootState) => state.messageReducer.message);
	const dispatch = useDispatch();


	// Reload: Check localStorage for 'sdjwt' and 'disclosures'
	const handleReload = () => {
		const sdjwt = localStorage.getItem('sdjwt');
		const disclosures = localStorage.getItem('disclosures');

		// Update form visibility if both are available
		if (sdjwt && disclosures) {
			setHasSdJwt(true);
			setSdJwt(sdjwt.replace(/^"|"$/g, ''));
		} else {
			setHasSdJwt(false);
		}
	};

	// holder generating vp based on vc
	const handleVpGeneration = async (e: React.FormEvent) => {
		e.preventDefault();

		console.log(vpData) // checkbox values (true or false)
		dispatch(setWaitingStatus(WaitingStatus.PRESENTINGVP));

		try {
			// make the vc
			const response = await fetch('/make-vp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ selections: vpData, sdjwt: sdJwt }),
			});

			// Check if issuance was successful
			if (response.status === 200) {
				const data = await response.json();
				const { vp } = data

				localStorage.setItem('VP', JSON.stringify(vp));

				// 생성된 VP를 목록에 추가
				const newVP = {
					id: Date.now().toString(),
					createdAt: new Date().toISOString(),
					selectedFields: Object.entries(vpData)
						.filter(([_, selected]) => selected)
						.map(([field]) => field),
					vp: vp
				};

				// localStorage와 상태 모두 업데이트
				const existingVPs = JSON.parse(localStorage.getItem('VPList') || '[]');
				const updatedVPs = [...existingVPs, newVP];
				dispatch(setVpList(updatedVPs));
				localStorage.setItem('VPList', JSON.stringify(updatedVPs));

				dispatch(setWaitingStatus(WaitingStatus.IDLE));
				setIsVPGenerated(true);
				dispatch(setMessage('VP generated successfully, and saved locally'));

			} else {
				setErrorMessage('Failed to make the vp');
			}

		} catch (error) {
			setErrorMessage('Error occurred while making vp.');
			console.error('Error:', error);
		}
	};

	return (
		<>
			<h2 className="text-5xl font-bold mb-8 pt-16" style={{ color: '#ffa600' }}>VP Generator</h2>
			<div className="flex justify-end mb-4">
				<button
					onClick={handleReload}
					className="bg-[#ffa600] text-white p-2 rounded-full hover:bg-[#ff8800] flex items-center justify-center"
					style={{ width: '40px', height: '40px' }}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ marginLeft: '-2px' }}><path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z" /></svg>
				</button>
			</div>

			{hasSdJwt ? (
				<form onSubmit={handleVpGeneration}>
					{Object.keys(vpData).map((key) => (
						<div key={key} className="flex items-center mb-4">
							<input
								type="checkbox"
								checked={vpData[key as keyof typeof vpData]}
								onChange={(e) => setVpData({ ...vpData, [key]: e.target.checked })}
								className="mr-2"
							/>
							<label className="text-lg">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
						</div>
					))}
					<SubmitButton label={isVPGenerated ? "REGENERATE VP" : "GENERATE VP"} />
				</form>
			) : (
				// Show the error message if SD-JWT is not found
				<div className="mt-4 text-center text-[#ffa600]">
					<p className="text-2xl mb-4">
						We haven't been able to identify a valid VC on your local device... Try reloading or go issue a VC right now!
					</p>
				</div>
			)}

			{message && (
				<div className="mt-4 text-[#ffa600]">{message}</div>
			)}

			{isVPGenerated && (
				<div className="mt-6">
					<h4 className="text-2xl font-bold mb-2" style={{ color: '#ffa600' }}>You can now use this VP to verify yourself! (Or you can also generate another VP)</h4>
				</div>
			)}
		</>


	);
};

export default VPSection;