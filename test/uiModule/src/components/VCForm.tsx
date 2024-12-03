import React, { useState } from 'react';
import SubmitButton from './common/SubmitButton';
import { useDispatch, useSelector } from 'react-redux';
import { setVcData, setVcDataError, VcData } from '../redux/slice/vcData';
import { RootState } from '../redux/store/store';

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
function validateFields(vcData: VcData) {
	const dispatch = useDispatch();
	// const errors = useSelector((state: RootState) => state.vcDataErrorReducer.vcDataError);
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

const DateDropdown = () => {
	const dispatch = useDispatch();
	const vcData = useSelector((state: RootState) => state.vcDataReducer.vcData);
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
					onChange={(e) => dispatch(setVcData({ ...vcData, birth_date: `${e.target.value}-${month}-${day}` }))}
					className="bg-white text-black p-3 rounded-md font-sans text-lg flex-1"
				>
					{Array.from({ length: 101 }, (_, i) => (1920 + i).toString()).map((y) => (
						<option key={y} value={y}>{y}</option>
					))}
				</select>
				<select
					value={month}
					onChange={(e) => dispatch(setVcData({ ...vcData, birth_date: `${year}-${e.target.value}-${day}` }))}
					className="bg-white text-black p-3 rounded-md font-sans text-lg flex-1"
				>
					{Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((m) => (
						<option key={m} value={m}>{m}</option>
					))}
				</select>
				<select
					value={day}
					onChange={(e) => dispatch(setVcData({ ...vcData, birth_date: `${year}-${month}-${e.target.value}` }))}
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

export default function VCForm(
	props: {
		handleVcSubmit: (e: React.FormEvent) => Promise<void>
	}
) {
	const dispatch = useDispatch();
	const vcData = useSelector((state: RootState) => state.vcDataReducer.vcData);
	const errors = useSelector((state: RootState) => state.vcDataErrorReducer.vcDataError);
	const { handleVcSubmit } = props;
	return (
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
								onChange={(e) => dispatch(setVcData({ ...vcData, [key]: e.target.value }))}
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
								onChange={(e) => dispatch(setVcData({ ...vcData, [key]: e.target.value }))}
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
							onChange={(e) => dispatch(setVcData({ ...vcData, [key]: e.target.value }))}
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
	)
}
