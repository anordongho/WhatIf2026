import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import SubmitButton from "./common/SubmitButton";

import { RootState } from "../redux/store/store";
import { setWaitingStatus, WaitingStatus } from "../redux/slice/waiting";
import { setVoterUnverified, setVoterVerified } from "../redux/slice/verified";
import { setMessage } from "../redux/slice/message";

const VoteSection = () => {
	const [vote, setVote] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
	const [hasLocalVP, setHasLocalVP] = useState(false);
	const isVoterVerified = useSelector((state: RootState) => state.voterVerifiedReducer.isVoterVerified);
	const message = useSelector((state: RootState) => state.messageReducer.message);

	const dispatch = useDispatch();

	const handleLocalVpCheck = () => {
		const vp = localStorage.getItem('VP');
		if (vp) setHasLocalVP(true);
		else setHasLocalVP(false);
	}

	// Holder sending the vp to verifier
	const handleVpSubmit = async (e: React.FormEvent) => {

		e.preventDefault();

		try {
			// 0. fetch vp from local storage

			dispatch(setWaitingStatus(WaitingStatus.VERIFYING));
			const VP = localStorage.getItem('VP');

			// 1. encrypt the data
			// 2. send it to verifier & wait for response

			const response = await fetch('/submit-vp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ vp: VP }),
			});

			// 3. if successfully verified, update ui components(setIsVerifying, setIsVoterVerified, setMessage..)
			dispatch(setWaitingStatus(WaitingStatus.IDLE));

			if (response.status === 200) {
				const data = await response.json();

				// if true: success / else something wrong with vp or not eligible for votes
				console.log('VP Verification success:', data);
				dispatch(setVoterVerified());
				dispatch(setMessage('Verification successful. You can now vote.'));

			} else {
				console.log('VP Verification failed:', response);
				setErrorMessage('Failed to send the VP');
				dispatch(setVoterUnverified());
			}

		} catch (error) {
			setErrorMessage('Error occurred while sending & verifying VP.');
			console.error('Error:', error);
		}
	};

	const handleVoteSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('/submit-vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ vote }), // send the vote data
			});

			if (response.ok) {
				const { result } = await response.json();
				console.log('Encryption result:', result);

				dispatch(setMessage('Your vote has been submitted successfully!'));
			} else {
				dispatch(setMessage('Failed to submit your vote. Please try again.'));
			}
		} catch (error) {
			console.error('Error submitting vote:', error);
			dispatch(setMessage('An error occurred while submitting your vote.'));
		} finally {
			setIsVoteSubmitted(true);
			setTimeout(() => {
				setIsVoteSubmitted(false);
				dispatch(setVoterUnverified());
				setVote('');
			}, 1000);
		}
	};

	return (
		<>
			{isVoteSubmitted ? (
				<div className="text-center">
					<h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>Your vote has been submitted!</h2>
				</div>
			) : (
				<>
					<h1 className="text-2xl mb-2">Be a part of decision</h1>
					<h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>Verify your right to vote</h2>
					{!isVoterVerified && (
						<form onSubmit={handleVpSubmit} className="mb-4">
							<button
								type="button"
								onClick={handleLocalVpCheck}
								className="bg-[#ffa600] text-white p-3 w-full mb-4 rounded-md font-sans text-lg "
							>
								Look for Locally Stored VPs
							</button>
							<SubmitButton label="VERIFY" disabled={!hasLocalVP} />
						</form>
					)}

					{message && (
						<div className="mt-4 text-[#ffa600]">{message}</div>
					)}

					{isVoterVerified && (
						<>
							<h2 className="text-3xl font-bold mt-8 mb-4" style={{ color: '#ffa600' }}>Voting Panel</h2>
							<form onSubmit={handleVoteSubmit}>
								<select
									value={vote}
									onChange={(e) => setVote(e.target.value)}
									className="bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg"
								>
									<option value="">Select Candidate</option>
									<option value="1">Candidate 1</option>
									<option value="100">Candidate 2</option>
									<option value="10000">Candidate 3</option>
								</select>
								<SubmitButton label="SUBMIT VOTE" />
							</form>
						</>
					)}
				</>
			)
			}
		</>
	)
};

export default VoteSection;