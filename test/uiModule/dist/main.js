"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const VotingApp = () => {
    const [currentSection, setCurrentSection] = (0, react_1.useState)('vote');
    const [voterId, setVoterId] = (0, react_1.useState)('');
    const [isVoterVerified, setIsVoterVerified] = (0, react_1.useState)(false);
    const [isVerifying, setIsVerifying] = (0, react_1.useState)(false);
    const [isIssuingVC, setIsIssuingVC] = (0, react_1.useState)(false);
    const [isPresentingVP, setIsPresentingVP] = (0, react_1.useState)(false);
    const [vcData, setVcData] = (0, react_1.useState)({
        name: '',
        age: '',
        address: '',
        gender: '',
        citizenship: '',
    });
    const [vpData, setVpData] = (0, react_1.useState)({
        name: false,
        age: false,
        address: false,
        gender: false,
        citizenship: false,
    });
    const [vote, setVote] = (0, react_1.useState)('');
    const [message, setMessage] = (0, react_1.useState)('');
    const [vcCode, setVcCode] = (0, react_1.useState)('');
    const [vpCode, setVpCode] = (0, react_1.useState)('');
    const [isVoteSubmitted, setIsVoteSubmitted] = (0, react_1.useState)(false);
    const [loadingDots, setLoadingDots] = (0, react_1.useState)('');
    (0, react_1.useEffect)(() => {
        let interval;
        if (isVerifying || isIssuingVC || isPresentingVP) {
            interval = setInterval(() => {
                setLoadingDots(prev => (prev.length >= 3 ? '' : prev + '.'));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isVerifying, isIssuingVC, isPresentingVP]);
    (0, react_1.useEffect)(() => {
        // 섹션이 변경될 때마다 메시지 초기화
        setMessage('');
    }, [currentSection]);
    const handleVoterIdSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsVerifying(true);
        setTimeout(() => {
            setIsVerifying(false);
            setIsVoterVerified(true);
            setMessage('Verification successful. You can now vote.');
        }, 5000);
    });
    const handleVcSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsIssuingVC(true);
        setTimeout(() => {
            const exampleVcCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
            setVcCode(exampleVcCode);
            setIsIssuingVC(false);
            setMessage('VC issued successfully.');
        }, 5000);
    });
    const handleVpSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsPresentingVP(true);
        setTimeout(() => {
            const exampleVpCode = '0xadc99f9a8b8d78' + Math.random().toString(36).substring(2, 15);
            setVpCode(exampleVpCode);
            setIsPresentingVP(false);
            setMessage('VP generated successfully.');
        }, 5000);
    });
    const handleVoteSubmit = (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        setIsVoteSubmitted(true);
        setMessage('Your vote has been submitted successfully!');
        setTimeout(() => {
            setIsVoteSubmitted(false);
            setIsVoterVerified(false);
            setVote('');
            setMessage('');
        }, 5000);
    });
    const NavButton = ({ section, label }) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => {
            setCurrentSection(section);
            setMessage(''); // 네비게이션 시 메시지 초기화
        }, className: "text-[#ffa600] hover:text-white transition-colors duration-300 text-sm mr-4", children: label }));
    const SubmitButton = ({ label }) => ((0, jsx_runtime_1.jsx)("button", { type: "submit", className: "bg-[#ffa600] text-white p-3 rounded-md w-full text-lg font-sans font-bold hover:bg-[#cc8500] transition-colors duration-300", children: label }));
    const LoadingScreen = ({ message }) => ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsxs)("h2", { className: "text-5xl font-bold", style: { color: '#ffa600' }, children: [message, loadingDots] }) }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "bg-black text-white min-h-screen flex flex-col", style: { fontFamily: '"DM Serif Display", serif' }, children: [(0, jsx_runtime_1.jsxs)("nav", { className: "p-4 absolute top-0 left-0", children: [(0, jsx_runtime_1.jsx)(NavButton, { section: "vote", label: "Verify & Vote" }), (0, jsx_runtime_1.jsx)(NavButton, { section: "vc", label: "VC Issue" }), (0, jsx_runtime_1.jsx)(NavButton, { section: "vp", label: "VP Generate" })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex-grow flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("div", { className: "max-w-md w-full px-6 py-8", children: isVerifying ? ((0, jsx_runtime_1.jsx)(LoadingScreen, { message: "Verifying your VP" })) : isIssuingVC ? ((0, jsx_runtime_1.jsx)(LoadingScreen, { message: "Issuing your VC" })) : isPresentingVP ? ((0, jsx_runtime_1.jsx)(LoadingScreen, { message: "Presenting your VP" })) : isVoteSubmitted ? ((0, jsx_runtime_1.jsx)("div", { className: "text-center", children: (0, jsx_runtime_1.jsx)("h2", { className: "text-5xl font-bold", style: { color: '#ffa600' }, children: "Your vote has been submitted!" }) })) : currentSection === 'vote' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl mb-2", children: "Be a part of decision" }), (0, jsx_runtime_1.jsx)("h2", { className: "text-5xl font-bold mb-8", style: { color: '#ffa600' }, children: "Verify your right to vote" }), !isVoterVerified && ((0, jsx_runtime_1.jsxs)("form", { onSubmit: handleVoterIdSubmit, className: "mb-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "text", value: voterId, onChange: (e) => setVoterId(e.target.value), placeholder: "ENTER YOUR VP CODE", className: "bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg" }), (0, jsx_runtime_1.jsx)(SubmitButton, { label: "VERIFY" })] })), message && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-[#ffa600]", children: message })), isVoterVerified && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-bold mt-8 mb-4", style: { color: '#ffa600' }, children: "Voting Panel" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleVoteSubmit, children: [(0, jsx_runtime_1.jsxs)("select", { value: vote, onChange: (e) => setVote(e.target.value), className: "bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg", children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select Candidate" }), (0, jsx_runtime_1.jsx)("option", { value: "candidate1", children: "Candidate 1" }), (0, jsx_runtime_1.jsx)("option", { value: "candidate2", children: "Candidate 2" }), (0, jsx_runtime_1.jsx)("option", { value: "candidate3", children: "Candidate 3" })] }), (0, jsx_runtime_1.jsx)(SubmitButton, { label: "SUBMIT VOTE" })] })] }))] })) : currentSection === 'vc' ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-5xl font-bold mb-8", style: { color: '#ffa600' }, children: "VC Issuer" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleVcSubmit, children: [Object.keys(vcData).map((key) => ((0, jsx_runtime_1.jsx)("input", { type: "text", value: vcData[key], onChange: (e) => setVcData(Object.assign(Object.assign({}, vcData), { [key]: e.target.value })), placeholder: key.charAt(0).toUpperCase() + key.slice(1), className: "bg-white text-black p-3 w-full mb-4 rounded-md font-sans text-lg" }, key))), (0, jsx_runtime_1.jsx)(SubmitButton, { label: "ISSUE VC" })] }), message && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-[#ffa600]", children: message })), vcCode && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold mb-2", style: { color: '#ffa600' }, children: "Your VC code is" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white text-black p-3 rounded-md font-mono text-lg break-all relative", children: [vcCode, (0, jsx_runtime_1.jsx)("button", { className: "absolute right-2 bottom-2 text-gray-500 hover:text-gray-700", children: (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: [(0, jsx_runtime_1.jsx)("path", { d: "M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" }), (0, jsx_runtime_1.jsx)("path", { d: "M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" })] }) })] })] }))] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-5xl font-bold mb-8", style: { color: '#ffa600' }, children: "VP Generator" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleVpSubmit, children: [Object.keys(vpData).map((key) => ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center mb-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "checkbox", checked: vpData[key], onChange: (e) => setVpData(Object.assign(Object.assign({}, vpData), { [key]: e.target.checked })), className: "mr-2" }), (0, jsx_runtime_1.jsx)("label", { className: "text-lg", children: key.charAt(0).toUpperCase() + key.slice(1) })] }, key))), (0, jsx_runtime_1.jsx)(SubmitButton, { label: "GENERATE VP" })] }), message && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 text-[#ffa600]", children: message })), vpCode && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold mb-2", style: { color: '#ffa600' }, children: "Your VP code is" }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white text-black p-3 rounded-md font-mono text-lg break-all relative", children: [vpCode, (0, jsx_runtime_1.jsx)("button", { className: "absolute right-2 bottom-2 text-gray-500 hover:text-gray-700", children: (0, jsx_runtime_1.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: [(0, jsx_runtime_1.jsx)("path", { d: "M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" }), (0, jsx_runtime_1.jsx)("path", { d: "M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" })] }) })] })] }))] })) }) })] }));
};
// ReactDOM 렌더링
react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(VotingApp, {}) }), document.getElementById('app'));
exports.default = VotingApp;
