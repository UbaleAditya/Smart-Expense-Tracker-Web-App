import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiGateway } from '../services/api';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [statusText, setStatusText] = useState('READY_TO_ALLOCATE_MEM_SPACE');
    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusText('COMPILING_IDENTITY_VECTORS... SPINNING_UP_BUDGET_LOGIC');
        try {
            const dataResponse = await apiGateway.register({ name, email, password });
            setStatusText('NODE_REGISTERED_SUCCESSFULLY // BOOTING_WORKSPACE');
            localStorage.setItem('token', dataResponse.token);
            localStorage.setItem('userName', dataResponse.user.name);
            setTimeout(() => navigate('/dashboard'), 800);
        } catch (err) {
            setError(err.message || 'REGISTRATION_REJECTED');
            setStatusText('COMPILATION_ERROR // RE-INJECT PARAMETERS');
        }
    };

    return (
        <div style={ui.wrapper}>
            <div style={ui.leftPanel}>
                <div style={ui.glitchText}>// SECURITY_CORE_INITIALIZATION</div>
                <div style={ui.statusConsole}>
                    <p style={{color: '#38bdf8'}}>&gt; ARTIFACT_ENGINE: COMPILING</p>
                    <p style={{color: '#a855f7'}}>&gt; CIPHER_TYPE: AES_256_JWT</p>
                    <p style={{color: '#f43f5e'}}>&gt; OVER_CAP_ALERT_DAEMON: ARMED</p>
                    <div style={ui.statusLine}>TELEMETRY: {statusText}</div>
                </div>
            </div>
            <div style={ui.rightPanel}>
                <div style={ui.formContainer}>
                    <h2 style={ui.title}>SPAWN_NEW_IDENTITY_NODE</h2>
                    {error && <div style={ui.error}>[COMPILE_ERR]: {error.toUpperCase()}</div>}
                    <form onSubmit={handleFormSubmit} style={ui.form}>
                        <div style={ui.inputWrapper}>
                            <span style={ui.prompt}>[OPERATOR_NAME]:</span>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} style={ui.field} autoComplete="off" />
                        </div>
                        <div style={ui.inputWrapper}>
                            <span style={ui.prompt}>[ENDPOINT_EMAIL]:</span>
                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={ui.field} autoComplete="off" />
                        </div>
                        <div style={ui.inputWrapper}>
                            <span style={ui.prompt}>[ROOT_PASSPHRASE]:</span>
                            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={ui.field} />
                        </div>
                        <button type="submit" style={ui.actionBtn}>COMPILE_AND_MOUNT</button>
                    </form>
                    <p style={ui.linkText}>
                        ALREADY_AUTHORIZED? <Link to="/login" style={ui.link}>RETURN_TO_GATE</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

const ui = {
    wrapper: { display: 'flex', minHeight: '100vh', backgroundColor: '#05070f', fontFamily: 'monospace', color: '#e5e7eb' },
    leftPanel: { flex: 1, padding: '40px', backgroundColor: '#070b16', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid #111827' },
    glitchText: { color: '#38bdf8', fontSize: '14px', fontWeight: 'bold', letterSpacing: '2px' },
    statusConsole: { backgroundColor: '#020408', padding: '20px', borderRadius: '4px', border: '1px solid #1e293b' },
    statusLine: { borderTop: '1px dashed #334155', marginTop: '15px', paddingTop: '10px', fontSize: '13px', color: '#00ff66' },
    rightPanel: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px' },
    formContainer: { width: '100%', maxWidth: '420px' },
    title: { fontSize: '24px', color: '#ffffff', marginBottom: '30px', letterSpacing: '1px', borderBottom: '2px solid #059669', paddingBottom: '10px' },
    error: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '12px', border: '1px solid #ef4444', fontSize: '12px', marginBottom: '20px' },
    form: { display: 'flex', flexDirection: 'column', gap: '18px' },
    inputWrapper: { display: 'flex', flexDirection: 'column', gap: '5px' },
    prompt: { color: '#64748b', fontSize: '12px' },
    field: { padding: '12px', border: '1px solid #334155', backgroundColor: '#090d16', color: '#38bdf8', fontSize: '14px', outline: 'none', fontFamily: 'monospace', caretColor: '#38bdf8' },
    actionBtn: { padding: '14px', border: '1px solid #059669', backgroundColor: 'rgba(5, 150, 105, 0.1)', color: '#00ff66', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', fontFamily: 'monospace', letterSpacing: '1px', transition: 'all 0.3s' },
    linkText: { marginTop: '25px', textAlign: 'center', fontSize: '12px', color: '#64748b' },
    link: { color: '#38bdf8', textDecoration: 'none' }
};

export default Register;