import React, { useState } from 'react';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // 사용자 데이터를 서버로 전송할 때 사용하는 로직
    console.log({ name, id, unique_id, gender, birth_date, email, address, phone_number });
    // 예: 서버에 POST 요청 보내기
    try {
      const response = await fetch('/issue-vc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: { name, id, unique_id, gender, birth_date, email, address, phone_number },  // 'payload'라는 키로 감싸서 전송
        }),
      });

      if (response.status == 200) {
        const data = await response.json();

        const { encodedSdjwt } = data;

        setVcMessage(`Here's your selectively disclosable VC! We've made it so that you can choose to hide anything that you want, except the issuance time.\n\n`);
        setSdJwtObject(encodedSdjwt); // Store the SD-JWT object for display

      } else {
        setErrorMessage('Failed to fetch SD-JWT from the server.');
      }


    } catch (error) {

      setErrorMessage('Error occurred while fetching data.');

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
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display errors if any */}
      </div>
    </div>
  );
};

// ReactDOM 렌더링
ReactDOM.render(<React.StrictMode>
  <UserForm />
</React.StrictMode>, document.getElementById('app'));
