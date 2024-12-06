import React from "react";
import { useDispatch, useSelector } from "react-redux";

import VCForm from "./VCForm";

import { RootState } from "../redux/store/store";
import { setVcDataError, VcData } from "../redux/slice/vcData";
import { setVcCode } from "../redux/slice/vcCode";
import { setWaitingStatus, WaitingStatus } from "../redux/slice/waiting";
import { setMessage } from "../redux/slice/message";
import { setErrorMessage } from "../redux/slice/errorMessage";

const VCSection = () => {
	const dispatch = useDispatch();
	const vcCode = useSelector((state: RootState) => state.vcCodeReducer.vcCode);
	const vcData = useSelector((state: RootState) => state.vcDataReducer.vcData);
	const message = useSelector((state: RootState) => state.messageReducer.message);

	function validateFields(vcData: VcData) {
		const newErrors = {
			name: vcData.name.trim() === '' ? 'Name is required' : '',
			id: vcData.id.trim() === '' ? 'ID is required' : '',
			unique_id: !/^\d{6}-\d{7}$/.test(vcData.unique_id) ? 'Invalid format (000000-0000000)' : '',
			email: !vcData.email.includes('@') ? 'Invalid email format' : '',
			address: vcData.address.trim() === '' ? 'Address is required' : '',
			phone_number: !/^010-\d{3,4}-\d{4}$/.test(vcData.phone_number) ? 'Invalid format (010-0000-0000)' : '',
			gender: vcData.gender === '' ? 'Please select gender' : '',
			birth_date: '',  // 드롭다운이라 검증 불필요
			citizenship: vcData.citizenship === '' ? 'Please select citizenship' : ''
		};
		dispatch(setVcDataError(newErrors));
		return !Object.values(newErrors).some(error => error !== '');
	};

	const handleVCSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateFields(vcData)) {
			dispatch(setMessage('Please correct the errors before submitting.'));
			return
		}
		dispatch(setWaitingStatus(WaitingStatus.ISSUINGVC));
		console.log(vcData);

		try {
			const response = await fetch('/issue-vc', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ formContents: vcData }),
			});

			if (response.status === 200) {
				const data = await response.json();
				const vcEncrypted = data;

				// Decrypt the response
				const sdjwtResponse = await fetch('/decrypt-holder-aes', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(vcEncrypted),
				});

				if (sdjwtResponse.ok) {
					const sdjwtData = await sdjwtResponse.json();
					const { sdjwt } = sdjwtData;

					localStorage.setItem('sdjwt', JSON.stringify(sdjwt));

					const disclosuresResponse = await fetch('/decode-sdjwt', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							sdjwt,
						}),
					});

					if (disclosuresResponse.ok) {
						const disclosuresData = await disclosuresResponse.json();
						const { decodedDisclosures } = disclosuresData;

						localStorage.setItem('disclosures', JSON.stringify(decodedDisclosures));
						dispatch(setVcCode(sdjwt));
						dispatch(setWaitingStatus(WaitingStatus.IDLE));
						dispatch(setMessage('VC issued successfully.'));

					} else {
						dispatch(setErrorMessage('Failed to decode SD-JWT from the server.'));
					}

				} else {
					dispatch(setErrorMessage('Failed to decrypt the given data.'));
				}

			} else {
				dispatch(setErrorMessage('Failed to fetch SD-JWT from the server.'));
			}
		} catch (error) {
			console.error('Error submitting VC:', error);
			dispatch(setMessage('An error occurred while submitting your VC.'));
		} finally {
			setTimeout(() => {
				dispatch(setMessage(''));
			}, 1000);
		}
	};

	return (
		<div className="flex-grow flex items-center justify-center">
			<div className="max-w-md w-full px-6 py-8">
				<>
					<h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>VC Issuer</h2>
					<VCForm handleVcSubmit={handleVCSubmit} />
					{message && (
						<div className="mt-4 text-[#ffa600]">{message}</div>
					)}
					{vcCode && (
						<div className="mt-6">
							<h3 className="text-2xl font-bold mb-2" style={{ color: '#ffa600' }}>Your VC code is</h3>
							<div className="bg-white text-black p-3 rounded-md font-mono text-lg break-all relative">
								{vcCode}
								<button className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700">
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
										<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
										<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
									</svg>
								</button>
							</div>
						</div>
					)}
				</>
			</div>
		</div>
	);
}

export default VCSection;