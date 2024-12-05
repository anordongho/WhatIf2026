const SubmitButton = ({ label, disabled = false }: { label: string; disabled?: boolean }) => (
	<button
		type="submit"
		// className={"bg-[#ffa600] text-white p-3 w-full mb-4 rounded-md font-sans text-lg"}
		disabled={disabled}
		className={`bg-[#f78400] text-white p-3 rounded-md w-full text-lg font-sans font-bold 
        ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-[#cd812a] transition-colors duration-300'}`}
	>
		{label}
	</button>
);

export default SubmitButton;