import React, { useState } from "react";
import VCForm from "./VCForm";
import { setVcDataError, VcData } from "../redux/slice/vcData";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store/store";
import { setMessage } from "../redux/slice/message";
import { setErrorMessage } from "../redux/slice/errorMessage";
import { setWaitingStatus, WaitingStatus } from "../redux/slice/waiting";

//setIsIssuing, setMessage, setIsVoterVerified

const VCSection = () => {
	// const [isIssuingVC, setIsIssuingVC] = useState(false);
	const dispatch = useDispatch();
	const vcData = useSelector((state: RootState) => state.vcDataReducer.vcData);

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
		// setIsIssuingVC(true);
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

					// Step 2: Send request to decode the encoded SD-JWT
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

						// setVcCode(sdjwt)
						// setIsIssuingVC(false);
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
				// setIsVoterVerified(false);
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
				</>
			</div>
		</div>
	);
}

export default VCSection;