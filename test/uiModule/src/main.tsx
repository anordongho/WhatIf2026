import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// 사용자 입력 폼 컴포넌트
const UserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [unique_id, setUniqueId] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [birth_date, setBirthdate] = useState('');

  const [vcMessage, setVcMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sdJwtObject, setSdJwtObject] = useState<object | null>(null);
  const [disclosureobject, setDisclosureObject] = useState<object | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Log form data
    console.log({ name, id, unique_id, gender, birth_date, email, address, phone_number });

    try {
      // Step 0: encrypt the data

      // Step 1: Send form data to the server to issue the SD-JWT
      const response = await fetch('/issue-vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formContents: { name, id, unique_id, gender, birth_date, email, address, phone_number } }),
      });

      // Check if issuance was successful
      if (response.status === 200) {
        const data = await response.json();
        const { encryptedCredentialandIV, encryptedSymmetricKey } = data;

        // Decrypt the response
        const sdjwtResponse = await fetch('/decrypt-holder-aes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            encryptedCredentialandIV, encryptedSymmetricKey
          }),
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


            // Step 3: Display the decoded SD-JWT disclosures
            setVcMessage(`Here's your selectively disclosable VC! We've made it so that you can choose to hide anything that you want, except the issuance time.\n\n`);
            setSdJwtObject(sdjwt); // the encoded form of sdjwt
            setDisclosureObject(decodedDisclosures);  // Store the decoded SD-JWT disclosures part for display
            console.log(decodedDisclosures);
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
  };


  return (
    <div>
      <h1>Verifiable Credential Issuer</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>ID:</label>
          <input type="number" value={id} onChange={(e) => setId(e.target.value)} required />
        </div>
        <div>
          <label>Unique ID:</label>
          <input type="number" value={unique_id} onChange={(e) => setUniqueId(e.target.value)} required />
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Birthdate:</label>
          <input type="date" value={birth_date} onChange={(e) => setBirthdate(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Current address:</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div>
          <label>Phone number:</label>
          <input type="text" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h1>Your Verifiable Credential</h1>
        {vcMessage && <pre>{vcMessage}</pre>} {/* Display the VC */}
        {sdJwtObject && <pre>{JSON.stringify(sdJwtObject, null, 2)}</pre>} {/* Display the SD-JWT object */}
        {disclosureobject && <pre>{JSON.stringify(disclosureobject, null, 2)}</pre>} {/* Display the decoded disclosure object */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display errors if any */}
      </div>
    </div>
  );
};


const DisclosureForm: React.FC = () => {
  const [isDisclosureFormVisible, setDisclosureFormVisible] = useState(false);

  const [selectedDisclosures, setSelectedDisclosures] = useState<string[]>([]);

  // Array of disclosable information options
  const disclosureOptions = ['id', 'email', 'address', 'phone_number', 'gender', 'birth_date'];

  // Mapping of raw names to display names
  const disclosureLabels: { [key: string]: string } = {
    id: 'ID',
    email: 'Email',
    address: 'Address',
    phone_number: 'Phone number',
    gender: 'Gender',
    birth_date: 'Birth date',
  };

  // Check localStorage for 'sdjwt' and 'disclosures'
  const checkLocalStorage = () => {
    const sdjwt = localStorage.getItem('sdjwt');
    const disclosures = localStorage.getItem('disclosures');

    // Update form visibility if both are available
    if (sdjwt && disclosures) {
      setDisclosureFormVisible(true);
    } else {
      setDisclosureFormVisible(false);
    }
  };

  // Handle checkbox selection
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (event.target.checked) {
      setSelectedDisclosures([...selectedDisclosures, value]);
    } else {
      setSelectedDisclosures(selectedDisclosures.filter(item => item !== value));
    }
  };

  const handleDisclosureFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Submit form logic for disclosures
  };

  // Run check when component mounts
  useEffect(() => {
    checkLocalStorage();

    // Optionally, add event listener for storage changes
    window.addEventListener('storage', checkLocalStorage);

    return () => {
      window.removeEventListener('storage', checkLocalStorage);
    };
  }, []);

  return (
    <div>
      {/* Button to manually trigger localStorage check */}
      <button onClick={checkLocalStorage}>I've issued my VC!</button>

      {isDisclosureFormVisible ? (
        <form onSubmit={handleDisclosureFormSubmit}>
          <label>Information you would like to disclose:</label>
          {disclosureOptions.map((option, index) => (
            <div key={index}>
              <input
                type="checkbox"
                id={option}
                value={option}
                onChange={handleCheckboxChange}
              />
              <label htmlFor={option}>{disclosureLabels[option]}</label>
            </div>
          ))}
          <button type="submit">Submit Disclosures</button>
        </form>
      ) : (
        <p>Please issue a VC first...</p>
      )}
    </div>
  );
};

// ReactDOM 렌더링
ReactDOM.render(<React.StrictMode>
  <UserForm />
  <DisclosureForm />
</React.StrictMode>, document.getElementById('app'));
