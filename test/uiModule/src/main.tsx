import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

const VotingApp = () => {
  const [currentSection, setCurrentSection] = useState('vote');
  const [voterId, setVoterId] = useState('');
  const [isVoterVerified, setIsVoterVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIssuingVC, setIsIssuingVC] = useState(false);
  const [isPresentingVP, setIsPresentingVP] = useState(false);
  const [vcData, setVcData] = useState({
    name: '',
    age: '',
    address: '',
    gender: '',
    citizenship: '',
  });
  const [vpData, setVpData] = useState({
    name: false,
    age: false,
    address: false,
    gender: false,
    citizenship: false,
  });
  const [vote, setVote] = useState('');
  const [message, setMessage] = useState('');
  const [vcCode, setVcCode] = useState('');
  const [vpCode, setVpCode] = useState('');
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isVerifying || isIssuingVC || isPresentingVP) {
      interval = setInterval(() => {
        setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isVerifying, isIssuingVC, isPresentingVP]);

  useEffect(() => {
    // 섹션이 변경될 때마다 메시지 초기화
    setMessage('');
  }, [currentSection]);

  const handleVoterIdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setIsVoterVerified(true);
      setMessage('Verification successful. You can now vote.');
    }, 5000);
  };

  const handleVcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsIssuingVC(true);
    setTimeout(() => {
      const exampleVcCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
      setVcCode(exampleVcCode);
      setIsIssuingVC(false);
      setMessage('VC issued successfully.');
    }, 5000);
  };

  const handleVpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPresentingVP(true);
    setTimeout(() => {
      const exampleVpCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
      setVpCode(exampleVpCode);
      setIsPresentingVP(false);
      setMessage('VP generated successfully.');
    }, 5000);
  };

  const handleVoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVoteSubmitted(true);
    setMessage('Your vote has been submitted successfully!');
    setTimeout(() => {
      setIsVoteSubmitted(false);
      setIsVoterVerified(false);
      setVote('');
      setMessage('');
    }, 5000);
  };

  const NavButton = ({ section, label }: { section: string; label: string }) => (
    <button
      onClick={() => {
        setCurrentSection(section);
        setMessage(''); // 네비게이션 시 메시지 초기화
      }}
      className="text-[#ffa600] hover:text-white transition-colors duration-300 text-sm mr-4"
    >
      {label}
    </button>
  );

  const SubmitButton = ({ label }: { label: string }) => (
    <button 
      type="submit" 
      className="bg-[#ffa600] text-white p-3 rounded-md w-full text-lg font-sans font-bold hover:bg-[#cc8500] transition-colors duration-300"
    >
      {label}
    </button>
  );

  const LoadingScreen = ({ message }: { message: string }) => (
    <div className="text-center">
      <h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>
        {message}{loadingDots}
      </h2>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col" style={{ fontFamily: '"DM Serif Display", serif' }}>
      <nav className="p-4 absolute top-0 left-0">
        <NavButton section="vote" label="Verify & Vote" />
        <NavButton section="vc" label="VC Issue" />
        <NavButton section="vp" label="VP Generate" />
      </nav>
      
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full px-6 py-8">
          {isVerifying ? (
            <LoadingScreen message="Verifying your VP" />
          ) : isIssuingVC ? (
            <LoadingScreen message="Issuing your VC" />
          ) : isPresentingVP ? (
            <LoadingScreen message="Presenting your VP" />
          ) : isVoteSubmitted ? (
            <div className="text-center">
              <h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>Your vote has been submitted!</h2>
            </div>
          ) : currentSection === 'vote' ? (
            <>
              <h1 className="text-2xl mb-2">Be a part of decision</h1>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>Verify your right to vote</h2>
              
              {!isVoterVerified && (
                <form onSubmit={handleVoterIdSubmit} className="mb-4">
                  <input
                    type="text"
                    value={voterId}
                    onChange={(e) => setVoterId(e.target.value)}
                    placeholder="ENTER YOUR VP CODE"
                    className="bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg"
                  />
                  <SubmitButton label="VERIFY" />
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
                      <option value="candidate1">Candidate 1</option>
                      <option value="candidate2">Candidate 2</option>
                      <option value="candidate3">Candidate 3</option>
                    </select>
                    <SubmitButton label="SUBMIT VOTE" />
                  </form>
                </>
              )}
            </>
          ) : currentSection === 'vc' ? (
            <>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>VC Issuer</h2>
              <form onSubmit={handleVcSubmit}>
                {Object.keys(vcData).map((key) => (
                  <input
                    key={key}
                    type="text"
                    value={vcData[key as keyof typeof vcData]}
                    onChange={(e) => setVcData({...vcData, [key]: e.target.value})}
                    placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                    className="bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg"
                  />
                ))}
                <SubmitButton label="ISSUE VC" />
              </form>
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
          ) : (
            <>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>VP Generator</h2>
              <form onSubmit={handleVpSubmit}>
                {Object.keys(vpData).map((key) => (
                  <div key={key} className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      checked={vpData[key as keyof typeof vpData]}
                      onChange={(e) => setVpData({...vpData, [key]: e.target.checked})}
                      className="mr-2"
                    />
                    <label className="text-lg">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                  </div>
                ))}
                <SubmitButton label="GENERATE VP" />
              </form>
              {message && (
                <div className="mt-4 text-[#ffa600]">{message}</div>
              )}
              {vpCode && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#ffa600' }}>Your VP code is</h3>
                  <div className="bg-white text-black p-3 rounded-md font-mono text-lg break-all relative">
                    {vpCode}
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
          )}
        </div>
      </div>
    </div>
  );
};

// ReactDOM 렌더링
ReactDOM.render(
  <React.StrictMode>
    <VotingApp />
  </React.StrictMode>,
  document.getElementById('app')
);

export default VotingApp;