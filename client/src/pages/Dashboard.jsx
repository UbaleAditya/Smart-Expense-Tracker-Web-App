import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGateway } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
    const [summary, setSummary] = useState({ totals: { income: 0, expense: 0, balance: 0 }, categoryDistribution: {}, breachedBudgets: [] });
    const [txns, setTxns] = useState([]);
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('EXPENSE');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [budgetCategory, setBudgetCategory] = useState('Food');
    const [budgetAmount, setBudgetAmount] = useState('');

    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Operator';

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        syncDataPipelines();
    }, []);

    const syncDataPipelines = async () => {
        try {
            const sData = await apiGateway.fetchDashboardSummaryData();
            const tData = await apiGateway.fetchTxns();
            if (sData.totals) setSummary(sData);
            if (tData.data) setTxns(tData.data);
        } catch (err) {
            console.error('Telemetry stream dropped.', err);
        }
    };

    const handleAddTxn = async (e) => {
        e.preventDefault();
        try {
            await apiGateway.logTxn({ amount: Number(amount), type, category, description });
            setAmount(''); setDescription('');
            syncDataPipelines();
        } catch (err) {
            console.error('Push rejection.', err);
        }
    };

    const handleSetBudget = async (e) => {
        e.preventDefault();
        try {
            await apiGateway.modifyBudget({ category: budgetCategory, amount: Number(budgetAmount) });
            setBudgetAmount('');
            syncDataPipelines();
        } catch (err) {
            console.error('Threshold manipulation failure.', err);
        }
    };

    const handleDeleteTxn = async (id) => {
        try {
            await apiGateway.deleteTxn(id);
            syncDataPipelines();
        } catch (err) {
            console.error('Row erase failed.', err);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const categoriesArray = Object.keys(summary.categoryDistribution);
    const spendingValuesArray = Object.values(summary.categoryDistribution);

    const pieChartPayload = {
        labels: categoriesArray.length ? categoriesArray : ['NO_VECTORS'],
        datasets: [{
            data: spendingValuesArray.length ? spendingValuesArray : [1],
            backgroundColor: ['#f43f5e', '#3b82f6', '#a855f7', '#eab308', '#14b8a6', '#f97316'],
            borderColor: '#090d16',
            borderWidth: 2
        }]
    };

    const chartOptions = {
        plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'monospace', size: 11 } } }
        }
    };

    return (
        <div style={ds.container}>
            {/* Top Operational Status Header Bar */}
            <header style={ds.nav}>
                <div>
                    <div style={ds.badgeTitle}>// LOGICAL_DATAFEED_STREAM</div>
                    <h2 style={ds.mainTitle}>FINANCIAL_TELEMETRY_HUD</h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#94a3b8', marginBottom: '5px', fontSize: '13px' }}>SYS_OP: <span style={{color: '#00ff66'}}>{userName.toUpperCase()}</span></div>
                    <button onClick={handleLogout} style={ds.logoutBtn}>[DISCONNECT_SESSION]</button>
                </div>
            </header>

            {/* Threshold Violations Flash Layer */}
            {summary.breachedBudgets.map((b, i) => (
                <div key={i} style={ds.alertBanner}>
                    💥 [CAP_INFRINGE_ALERT]: LEVEL BOUNDARY EXCEEDED IN NODE [{b.category.toUpperCase()}] // COMBINED_BURN: {b.burned} &gt; ALLOCATED_LIMIT: {b.allotted} (CORRUPTION: +{b.breachAmount})
                </div>
            ))}

            {/* Strategic Vector Analytics Balance Strips */}
            <div style={ds.metricsGrid}>
                <div style={ds.metricCard}>
                    <span style={ds.cardCorner}></span>
                    <div style={ds.metTitle}>CAPITAL_INFLOW_CREDIT</div>
                    <div style={{ ...ds.metVal, color: '#00ff66' }}>+{summary.totals.income}</div>
                </div>
                <div style={ds.metricCard}>
                    <span style={ds.cardCorner}></span>
                    <div style={ds.metTitle}>CAPITAL_OUTFLOW_DEBIT</div>
                    <div style={{ ...ds.metVal, color: '#f43f5e' }}>-{summary.totals.expense}</div>
                </div>
                <div style={ds.metricCard}>
                    <span style={ds.cardCorner}></span>
                    <div style={ds.metTitle}>NET_RESERVE_SURPLUS</div>
                    <div style={{ ...ds.metVal, color: '#38bdf8' }}>// {summary.totals.balance}</div>
                </div>
            </div>

            {/* Primary Action Console Split View */}
            <div style={ds.workspaceLayout}>
                {/* Control Panel Block Column */}
                <div style={ds.column}>
                    <div style={ds.panel}>
                        <div style={ds.panelHeader}>[01] INJECT_STREAM_DATA_ROW</div>
                        <form onSubmit={handleAddTxn} style={ds.vForm}>
                            <input type="number" placeholder="[QUANTITY_VALUE]" required value={amount} onChange={e => setAmount(e.target.value)} style={ds.inp} />
                            <select value={type} onChange={e => setType(e.target.value)} style={ds.inp}>
                                <option value="EXPENSE">DEBIT_OUTFLOW</option>
                                <option value="INCOME">CREDIT_INFLOW</option>
                            </select>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={ds.inp}>
                                <option value="Food">Food & Dining</option>
                                <option value="Rent">Housing & Rent</option>
                                <option value="Travel">Transit & Travel</option>
                                <option value="Shopping">Shopping / Luxuries</option>
                                <option value="Bills">Utility Bills</option>
                                <option value="Education">Education</option>
                            </select>
                            <input type="text" placeholder="[RECORD_METADATA_STRING]" value={description} onChange={e => setDescription(e.target.value)} style={ds.inp} />
                            <button type="submit" style={ds.commitBtn}>COMMIT_RECORD_TO_BLOCK</button>
                        </form>
                    </div>

                    <div style={ds.panel}>
                        <div style={ds.panelHeader}>[02] ADJUST_THRESHOLD_BOUNDARY_CAP</div>
                        <form onSubmit={handleSetBudget} style={ds.vForm}>
                            <select value={budgetCategory} onChange={e => setBudgetCategory(e.target.value)} style={ds.inp}>
                                <option value="Food">Food & Dining</option>
                                <option value="Rent">Housing & Rent</option>
                                <option value="Travel">Transit & Travel</option>
                                <option value="Shopping">Shopping / Luxuries</option>
                                <option value="Bills">Utility Bills</option>
                                <option value="Education">Education</option>
                            </select>
                            <input type="number" placeholder="[BOUND_THRESHOLD_LIMIT]" required value={budgetAmount} onChange={e => setBudgetAmount(e.target.value)} style={ds.inp} />
                            <button type="submit" style={{ ...ds.commitBtn, borderColor: '#d97706', backgroundColor: 'rgba(217, 119, 6, 0.1)', color: '#fb923c' }}>LOCK_RULE_DAEMON</button>
                        </form>
                    </div>
                </div>

                {/* Graphical Vector Distribution Column */}
                <div style={ds.column}>
                    <div style={{ ...ds.panel, flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={ds.panelHeader}>[03] VECTOR_DENSITY_ANALYSIS</div>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                            <div style={{ maxWidth: '240px', width: '100%' }}>
                                <Pie data={pieChartPayload} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stream Ledger Row Log Matrix */}
            <div style={ds.panel}>
                <div style={ds.panelHeader}>[04] BUFFERED_TELEMETRY_RECORD_LEDGER</div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={ds.tbl}>
                        <thead>
                            <tr style={{ backgroundColor: '#090d16' }}>
                                <th style={ds.th}>TIMESTAMP</th>
                                <th style={ds.th}>NODE_TAG</th>
                                <th style={ds.th}>METADATA_STRING</th>
                                <th style={ds.th}>FLOW_TYPE</th>
                                <th style={ds.th}>QUANTITY</th>
                                <th style={ds.th}>GATEWAY_ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {txns.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ ...ds.td, textAlign: 'center', color: '#475569', padding: '30px' }}>// SYSTEM_LOG_BUFFER_EMPTY //</td>
                                </tr>
                            ) : (
                                txns.map(t => (
                                    <tr key={t._id} style={{ borderBottom: '1px solid #1e293b' }}>
                                        <td style={ds.td}>{new Date(t.date).toLocaleDateString()}</td>
                                        <td style={ds.td}><span style={ds.badge}>{t.category.toUpperCase()}</span></td>
                                        <td style={ds.td}>{t.description || '-'}</td>
                                        <td style={{ ...ds.td, fontWeight: 'bold', color: t.type === 'INCOME' ? '#00ff66' : '#f43f5e' }}>{t.type}</td>
                                        <td style={{ ...ds.td, fontWeight: 'bold', color: '#f1f5f9' }}>{t.amount}</td>
                                        <td style={ds.td}>
                                            <button onClick={() => handleDeleteTxn(t._id)} style={ds.delBtn}>PURGE_ROW</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const ds = {
    container: { padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'monospace', backgroundColor: '#05070f', minHeight: '100vh', color: '#cbd5e1' },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px dashed #334155', marginBottom: '30px' },
    badgeTitle: { fontSize: '11px', color: '#38bdf8', letterSpacing: '1px' },
    mainTitle: { margin: '5px 0 0 0', fontSize: '20px', color: '#ffffff', fontWeight: 'bold', letterSpacing: '0.5px' },
    logoutBtn: { padding: '6px 12px', border: '1px solid #dc2626', backgroundColor: 'rgba(220, 38, 38, 0.1)', color: '#f87171', cursor: 'pointer', fontSize: '11px', fontFamily: 'monospace' },
    alertBanner: { backgroundColor: 'rgba(244, 63, 94, 0.08)', border: '1px dashed #f43f5e', color: '#f43f5e', padding: '14px 20px', fontSize: '12px', fontWeight: 'bold', marginBottom: '25px', borderRadius: '2px' },
    metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '30px' },
    metricCard: { backgroundColor: '#070b16', padding: '20px', border: '1px solid #1e293b', position: 'relative', overflow: 'hidden' },
    cardCorner: { position: 'absolute', top: 0, left: 0, width: '4px', height: '4px', backgroundColor: '#38bdf8' },
    metTitle: { fontSize: '11px', color: '#64748b', letterSpacing: '0.5px', marginBottom: '8px' },
    metVal: { fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px' },
    workspaceLayout: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '30px', marginBottom: '30px' },
    column: { display: 'flex', flexDirection: 'column', gap: '25px' },
    panel: { backgroundColor: '#070b16', border: '1px solid #1e293b', borderRadius: '2px' },
    panelHeader: { backgroundColor: '#0c1122', padding: '12px 20px', fontSize: '13px', color: '#ffffff', fontWeight: 'bold', borderBottom: '1px solid #1e293b', letterSpacing: '0.5px' },
    vForm: { display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' },
    inp: { padding: '12px', border: '1px solid #334155', borderRadius: '2px', fontSize: '13px', outline: 'none', backgroundColor: '#020408', color: '#00ff66', fontFamily: 'monospace' },
    commitBtn: { padding: '12px', border: '1px solid #2563eb', backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#38bdf8', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' },
    tbl: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
    th: { padding: '12px 20px', borderBottom: '1px solid #1e293b', fontSize: '12px', color: '#64748b', fontWeight: 'bold' },
    td: { padding: '12px 20px', fontSize: '13px', verticalAlign: 'middle', backgroundColor: '#070b16' },
    badge: { backgroundColor: '#090d16', color: '#38bdf8', padding: '3px 8px', borderRadius: '1px', fontSize: '11px', border: '1px solid #334155' },
    delBtn: { backgroundColor: 'rgba(239, 68, 68, 0.05)', border: '1px solid #ef4444', color: '#f87171', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', fontFamily: 'monospace' }
};

export default Dashboard;