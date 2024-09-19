import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// 사용자 입력 폼 컴포넌트
const UserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 사용자 데이터를 서버로 전송할 때 사용하는 로직
    console.log({ name, age, gender, birthdate });
    // 예: 서버에 POST 요청 보내기
    fetch('/issue-vc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        payload: { name, age, gender, birthdate },  // 'payload'라는 키로 감싸서 전송
      }),
    })
    .then(response => response.json())
    .then(data => {
      // 서버 응답 처리
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
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
          <label>Age:</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
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
          <input type="date" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} required />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// ReactDOM 렌더링
ReactDOM.render(<React.StrictMode>
    <UserForm />
  </React.StrictMode>, document.getElementById('app'));
