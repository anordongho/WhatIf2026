import { useState } from "react";


const TallySection = () => {
	const [message, setMessage] = useState('');
	const [detailedResults, setDetailedResults] = useState('');

	const handleFinalTally = async () => {

		try {
			const response = await fetch('/final-tally', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				const { voteCounts } = await response.json();

				// Determine the winner by finding the candidate with the maximum votes
				const topCandidate = Object.keys(voteCounts).reduce((a, b) =>
					voteCounts[a] > voteCounts[b] ? a : b
				);

				console.log('Final Tally:', voteCounts);
				setMessage(`The winner is candidate ${topCandidate}`);

				// Set detailed results
				setDetailedResults(voteCounts); // Assuming you have a state variable for detailed results
			} else if (response.status === 400) {
				// Specific handling for 400 error indicating no votes
				setMessage('No votes to count.');
			} else {
				setMessage('Failed to tally votes. Please try again.');
			}
		} catch (error) {
			console.error('Error during final tally:', error);
			setMessage('An error occurred while calculating the final tally.');
		}
	};

	const handleResetVote = async () => {
		try {
			const response = await fetch('/reset-vote', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.ok) {
				setDetailedResults('');
				setMessage('Vote has been reset.');
			} else {
				setMessage('Failed to reset vote. Please try again.');
			}
		} catch (error) {
			console.error('Error during reset vote:', error);
			setMessage('An error occurred while resetting the vote.');
		}
	};

	return (
		<div className="text-center">
			<h2 className="text-3xl font-bold" style={{ color: '#ffa600' }}>
				Calculate Final Tally
			</h2>
			<button
				onClick={handleFinalTally}
				className="bg-[#ffa600] text-white p-3 w-full mt-4 rounded-md font-sans text-lg"
			>
				Finalize Tally
			</button>

			{message && (
				<div className="mt-4 text-[#ffa600]">
					{message} {/* Display message */}
				</div>
			)}

			{detailedResults && (
				<div className="mt-4">
					<h3 className="text-xl font-semibold">Detailed Results:</h3>
					<ul>
						{Object.entries(detailedResults).map(([candidate, count]) => (
							<li key={candidate}>Candidate {candidate}: {count} votes</li>
						))}
					</ul>
				</div>
			)}

			{/* Reset Vote Button */}
			<button
				onClick={handleResetVote}
				className="bg-red-600 text-white p-3 w-full mt-4 rounded-md font-sans text-lg"
			>
				Reset Vote
			</button>
		</div>
	)
}

export default TallySection;