import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Navbar from './components/Navbar';
import SubmitButton from './components/common/SubmitButton';

// local storage items: encryptedVotes (array of encrypted votes), VP (vp), disclosures, sdjwt, VPList

const VotingApp = () => {
  const [currentSection, setCurrentSection] = useState('vote');
  const [voterId, setVoterId] = useState('');
  const [isVoterVerified, setIsVoterVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isIssuingVC, setIsIssuingVC] = useState(false);
  const [isPresentingVP, setIsPresentingVP] = useState(false);
  const [hasSdJwt, setHasSdJwt] = useState(false);  // To check if SD-JWT is present in local storage
  const [hasLocalVP, setHasLocalVP] = useState(false);  // To check if SD-JWT is present in local storage

  const [sdjwt, setSdjwt] = useState('');

  const [vcData, setVcData] = useState({
    name: '',
    id: '',
    unique_id: '',
    email: '',
    address: '',
    phone_number: '',

    gender: '',
    birth_date: '1990-01-01',
    citizenship: '',
  });

  //유효성 검사를 위한 상태 
  const [errors, setErrors] = useState({
    name: '',
    id: '',
    unique_id: '',
    email: '',
    address: '',
    phone_number: '',
    gender: '',
    birth_date: '',
    citizenship: ''
  });
  const getPlaceholder = (key: string) => {
    switch (key) {
      case 'unique_id':
        return '000000-0000000';
      case 'email':
        return 'example@email.com';
      case 'phone_number':
        return '010-0000-0000';
      default:
        return '';
    }
  };

  //VC issue를 위한 데이터의 유효성 검사 함수
  const validateFields = () => {
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
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };


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
  //VP list를 위한 상태 관리
  const [myVPs, setMyVPs] = useState<Array<{
    id: string;           // VP 식별자
    createdAt: string;    // 생성 날짜
    selectedFields: string[]; // 선택된 정보 필드들
    vp: { sdjwt: string; holder_signature: string };          // 실제 VP 데이터
  }>>([]);
  const handleUseVP = (vp: object) => {
    localStorage.setItem('VP', JSON.stringify(vp));
    setCurrentSection('vote');
  };

  const handleDeleteVP = (id: string) => {
    const updatedVPs = myVPs.filter(vp => vp.id !== id);
    setMyVPs(updatedVPs);
    localStorage.setItem('VPList', JSON.stringify(updatedVPs));
  };
  //VP data load
  useEffect(() => {
    const vpList = localStorage.getItem('VPList');
    if (vpList) setMyVPs(JSON.parse(vpList));
  }, []);
  const [vote, setVote] = useState('');
  const [message, setMessage] = useState('');
  const [vcCode, setVcCode] = useState('');
  const [detailedResults, setDetailedResults] = useState('');
  // const [vpCode, setVpCode] = useState('');
  const [isVPGenerated, setIsVPGenerated] = useState(false);
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false);
  const [loadingDots, setLoadingDots] = useState('');

  // const [vcMessage, setVcMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // const [sdJwtObject, setSdJwtObject] = useState<object | null>(null);
  // const [disclosureobject, setDisclosureObject] = useState<object | null>(null);

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

    // setIsVerifying(true);
    // setTimeout(() => {
    //   setIsVerifying(false);
    //   setIsVoterVerified(true);
    //   setMessage('Verification successful. You can now vote.');
    // }, 5000);
  };

  const handleVcSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      setMessage('Please correct the errors before submitting');
      return;
    }
    setIsIssuingVC(true);

    // Log form data
    console.log(vcData);

    try {
      // Step 0: encrypt the data

      // Step 1: Send form data to the server to issue the SD-JWT
      const response = await fetch('/issue-vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formContents: vcData }),
      });

      // Check if issuance was successful
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

            setVcCode(sdjwt)
            setIsIssuingVC(false);
            setMessage('VC issued successfully.');

          } else {
            setErrorMessage('Failed to decode SD-JWT from the server.');
          }

        } else {
          setErrorMessage('Failed to decrypt the given data.');
        }

      } else {
        setErrorMessage('Failed to fetch SD-JWT from the server.');
      }

    } catch (error) {
      setErrorMessage('Error occurred while fetching data.');
      console.error('Error:', error);
    }

    // setTimeout(() => {
    //   const exampleVcCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
    //   setVcCode(exampleVcCode);
    //   setIsIssuingVC(false);
    //   setMessage('VC issued successfully.');
    // }, 5000);
  };

  // holder generating vp based on vc
  const handleVpGeneration = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(vpData) // checkbox values (true or false)
    setIsPresentingVP(true);

    try {
      // make the vc
      const response = await fetch('/make-vp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selections: vpData, sdjwt: sdjwt }),
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
        localStorage.setItem('VPList', JSON.stringify(updatedVPs));
        setMyVPs(updatedVPs);

        setIsPresentingVP(false);
        setIsVPGenerated(true);
        setMessage('VP generated successfully, and saved locally');


      } else {
        setErrorMessage('Failed to make the vp');
      }

    } catch (error) {
      setErrorMessage('Error occurred while making vp.');
      console.error('Error:', error);
    }


    // setTimeout(() => {
    //   const exampleVpCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
    //   setVpCode(exampleVpCode);
    //   setIsPresentingVP(false);
    //   setMessage('VP generated successfully.');
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

  // Reload: Check localStorage for 'sdjwt' and 'disclosures'
  const handleReload = () => {
    const sdjwt = localStorage.getItem('sdjwt');
    const disclosures = localStorage.getItem('disclosures');

    // Update form visibility if both are available
    if (sdjwt && disclosures) {
      setHasSdJwt(true);
      setSdjwt(sdjwt.replace(/^"|"$/g, ''));
    } else {
      setHasSdJwt(false);
    }
  };

  const handleLocalVpCheck = () => {
    const vp = localStorage.getItem('VP');

    if (vp) setHasLocalVP(true);
    else setHasLocalVP(false);
  }

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
        setMessage('Vote has been reset.');
      } else {
        setMessage('Failed to reset vote. Please try again.');
      }
    } catch (error) {
      console.error('Error during reset vote:', error);
      setMessage('An error occurred while resetting the vote.');
    }
  };

  const handleSectionClick = (section: string) => {
		setCurrentSection(section);
		setMessage('');
	}

  const LoadingScreen = ({ message }: { message: string }) => (
    <div className="text-center">
      <h2 className="text-5xl font-bold" style={{ color: '#ffa600' }}>
        {message}{loadingDots}
      </h2>
    </div>
  );

  const DateDropdown = () => {
    const [year, month, day] = vcData.birth_date.split('-');

    const daysInMonth = new Date(
      parseInt(year || '1990'),
      parseInt(month || '1'),
      0
    ).getDate();

    return (
      <div className="mb-4">
        <label className="block text-[#ffa600] mb-2 text-lg">Birth Date</label>
        <div className="flex gap-4">
          <select
            value={year}
            onChange={(e) => setVcData({ ...vcData, birth_date: `${e.target.value}-${month}-${day}` })}
            className="bg-white text-black p-3 rounded-md font-sans text-lg flex-1"
          >
            {Array.from({ length: 101 }, (_, i) => (1920 + i).toString()).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setVcData({ ...vcData, birth_date: `${year}-${e.target.value}-${day}` })}
            className="bg-white text-black p-3 rounded-md font-sans text-lg flex-1"
          >
            {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select
            value={day}
            onChange={(e) => setVcData({ ...vcData, birth_date: `${year}-${month}-${e.target.value}` })}
            className="bg-white text-black p-3 rounded-md font-sans text-lg flex-1"
          >
            {Array.from(
              { length: daysInMonth },
              (_, i) => (i + 1).toString().padStart(2, '0')
            ).map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col" style={{ fontFamily: '"Pretendard", "DM Serif Display", serif' }}>
      {/* <Navbar onSectionClick={handleSectionClick} /> */}
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
          ) : currentSection === 'vc' ? (
            <>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>VC Issuer</h2>
              <form onSubmit={handleVcSubmit}>
                {Object.keys(vcData).map((key) => {
                  const typedKey = key as keyof typeof vcData;

                  if (key === 'birth_date') {
                    return <DateDropdown key={key} />;
                  }

                  if (key === 'gender') {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-[#ffa600] mb-2 text-lg">Gender</label>
                        <select
                          value={vcData[typedKey]}
                          onChange={(e) => setVcData({ ...vcData, [key]: e.target.value })}
                          className="bg-white text-black p-3 w-full rounded-md font-sans text-lg"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    );
                  }

                  if (key === 'citizenship') {
                    return (
                      <div key={key} className="mb-4">
                        <label className="block text-[#ffa600] mb-2 text-lg">Citizenship</label>
                        <select
                          value={vcData[typedKey]}
                          onChange={(e) => setVcData({ ...vcData, [key]: e.target.value })}
                          className="bg-white text-black p-3 w-full rounded-md font-sans text-lg"
                        >
                          <option value="">Select Citizenship</option>
                          <option value="Republic of Korea">Republic of Korea</option>
                          <option value="United States">United States</option>
                        </select>
                      </div>
                    );
                  }

                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-[#ffa600] mb-2 text-lg">
                        {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                      </label>
                      <input
                        type="text"
                        value={vcData[typedKey]}
                        onChange={(e) => setVcData({ ...vcData, [key]: e.target.value })}
                        placeholder={getPlaceholder(key)}
                        className={`bg-white text-black p-3 w-full rounded-md font-sans text-lg
                        ${errors[typedKey] ? 'border-2 border-red-500' : ''}`}
                      />
                      {errors[typedKey] && (
                        <p className="text-red-500 text-sm mt-1">{errors[typedKey]}</p>
                      )}
                    </div>
                  );
                })}
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
          ) : currentSection === 'vp' ? (
            <>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>VP Generator</h2>

              <div className="flex justify-end mb-4">  {/* Adjusted alignment to right */}
                {/* Reload Button with Icon */}
                <button
                  onClick={handleReload}
                  className="bg-[#ffa600] text-white p-2 rounded-full hover:bg-[#ff8800] flex items-center justify-center"
                  style={{ width: '40px', height: '40px' }}  // Making the button round
                >
                  {/* SVG Icon for Reload */}
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


          ) : currentSection === 'vplist' ? (
            <>
              <h2 className="text-5xl font-bold mb-8" style={{ color: '#ffa600' }}>내 VP 목록</h2>
              <div className="grid grid-cols-1 gap-4">
                {myVPs.map((vp) => (
                  <div key={vp.id} className="bg-[#1f2937] rounded-xl p-6" style={{ fontFamily: '"Pretendard", "DM Serif Display", serif' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm mb-4">
                          생성일: {new Date(vp.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-[#ffa600] mb-3">포함된 정보:</p>
                        <div className="flex flex-wrap gap-2">
                          {vp.selectedFields.map((field) => (
                            <span key={field}
                              className="bg-[#ffa600] text-black px-4 py-1 rounded-full text-sm font-sans"
                              style={{ minWidth: '80px', textAlign: 'center' }}
                            >
                              {field}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-3 ml-4">
                        <button
                          onClick={() => handleUseVP(vp.vp)}
                          className="bg-[#ffa600] text-white px-6 py-2 rounded-lg hover:bg-[#ff8800] transition-colors duration-300 font-sans"
                          style={{ width: '100px', height: '40px' }}
                        >
                          USE
                        </button>
                        <button
                          onClick={() => handleDeleteVP(vp.id)}
                          className="bg-[#dc2626] text-white px-6 py-2 rounded-lg hover:bg-[#b91c1c] transition-colors duration-300 font-sans"
                          style={{ width: '100px', height: '40px' }}
                        >
                          DELETE
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
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