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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
// 사용자 입력 폼 컴포넌트
const UserForm = () => {
    const [name, setName] = (0, react_1.useState)('');
    const [age, setAge] = (0, react_1.useState)('');
    const [gender, setGender] = (0, react_1.useState)('');
    const [birthdate, setBirthdate] = (0, react_1.useState)('');
    const handleSubmit = (event) => {
        event.preventDefault();
        // 사용자 데이터를 서버로 전송할 때 사용하는 로직
        console.log({ name, age, gender, birthdate });
        // 예: 서버에 POST 요청 보내기
        fetch('/issue-vc', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                payload: { name, age, gender, birthdate }, // 'payload'라는 키로 감싸서 전송
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
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { children: "Verifiable Credential Issuer" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Name:" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Age:" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: age, onChange: (e) => setAge(e.target.value), required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Gender:" }), (0, jsx_runtime_1.jsxs)("select", { value: gender, onChange: (e) => setGender(e.target.value), required: true, children: [(0, jsx_runtime_1.jsx)("option", { value: "", children: "Select" }), (0, jsx_runtime_1.jsx)("option", { value: "Male", children: "Male" }), (0, jsx_runtime_1.jsx)("option", { value: "Female", children: "Female" }), (0, jsx_runtime_1.jsx)("option", { value: "Other", children: "Other" })] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Birthdate:" }), (0, jsx_runtime_1.jsx)("input", { type: "date", value: birthdate, onChange: (e) => setBirthdate(e.target.value), required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", children: "Submit" })] })] }));
};
// ReactDOM 렌더링
react_dom_1.default.render((0, jsx_runtime_1.jsx)(react_1.default.StrictMode, { children: (0, jsx_runtime_1.jsx)(UserForm, {}) }), document.getElementById('app'));
