import React, { useState } from "react";
import LoadingScreen from "./common/LoadingScreen";
import SubmitButton from "./common/SubmitButton";

// setVote, setMessage, setIsVoteSubmitted, setIsVoterVerified, setIsVerifying, haslocalvp

const VoteSection = () => {
	const [isVoterVerified, setIsVoterVerified] = useState(false);
	const [vote, setVote] = useState("");
	const [message, setMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [hasLocalVP, setHasLocalVP] = useState(false);

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

			const VP = localStorage.getItem('VP');

			// 1. encrypt the data
			// 2. send it to verifier & wait for response

			const response = await fetch('/submit-vp', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ vp: VP }),
			});

			// 3. if successfully verified, update ui components(setIsVerifying, setIsVoterVerified, setMessage..)

			if (response.status === 200) {
				const data = await response.json();

				// if true: success / else something wrong with vp or not eligible for votes

				setIsVerifying(false);
				setIsVoterVerified(true);
				setMessage('Verification successful. You can now vote.');


			} else {
				setErrorMessage('Failed to send the VP');
			}

		} catch (error) {
			setErrorMessage('Error occurred while sending & verifying VP.');
			console.error('Error:', error);
		}

		setIsVerifying(true);
		// setTimeout(() => {
		//   setIsVerifying(false);
		//   setIsVoterVerified(true);
		//   setMessage('Verification successful. You can now vote.');
		// }, 5000);
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

				setMessage('Your vote has been submitted successfully!');
				// alert('Your vote has been submitted successfully!');
			} else {
				setMessage('Failed to submit your vote. Please try again.');
			}
		} catch (error) {
			console.error('Error submitting vote:', error);
			setMessage('An error occurred while submitting your vote.');
		} finally {
			setIsVoteSubmitted(true);
			setTimeout(() => {
				setIsVoteSubmitted(false);
				setIsVoterVerified(false);
				setVote('');
				setMessage('');
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

	// return (
	// );
};

export default VoteSection;