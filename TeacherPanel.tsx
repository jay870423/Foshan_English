import React, { useState, useRef, useMemo } from 'react';
import { Word, Grade, Semester } from './types';
import { saveCustomWords, clearCustomWords, getWords, resetUnitWords } from './services/storage';
import * as XLSX from 'xlsx';

export const TeacherPanel: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [csvContent, setCsvContent] = useState('');
  const [status, setStatus] = useState<{msg: string, type: 'success' | 'error' | 'info' | ''}>({ msg: '', type: '' });
  const [updateTrigger, setUpdateTrigger] = useState(0); // Force re-render of stats
  
  // Confirm States
  const [confirmUnitReset, setConfirmUnitReset] = useState(false);
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  // Default Assignment State
  const [targetGrade, setTargetGrade] = useState<Grade>(3);
  const [targetSemester, setTargetSemester] = useState<Semester>('1');
  const [targetUnit, setTargetUnit] = useState<number>(1);
  const [useDefaults, setUseDefaults] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Recalculate words whenever updateTrigger changes
  const allWords = useMemo(() => getWords(), [updateTrigger]);

  const showStatus = (msg: string, type: 'success' | 'error' | 'info') => {
      setStatus({ msg, type });
      setTimeout(() => setStatus({ msg: '', type: '' }), 5000);
  };

  const forceRefresh = () => {
      setUpdateTrigger(prev => prev + 1);
  }

  const processData = (rawData: string) => {
    try {
        let newWords: Word[] = [];
        
        // Check if it's JSON
        if (rawData.trim().startsWith('[') || rawData.trim().startsWith('{')) {
            try {
                const json = JSON.parse(rawData);
                const arr = Array.isArray(json) ? json : [json];
                newWords = arr.map((item: any, idx: number) => ({
                    id: item.id || `json-${Date.now()}-${idx}`,
                    text: item.text,
                    translation: item.translation,
                    ipa: item.ipa,
                    sentence: item.sentence,
                    grade: item.grade || (useDefaults ? targetGrade : 1),
                    semester: item.semester || (useDefaults ? targetSemester : '1'),
                    unit: item.unit || (useDefaults ? targetUnit : 1)
                }));
            } catch (e) {
                showStatus("Invalid JSON format", 'error');
                return;
            }
        } 
        // Assume CSV/Text/Excel-converted-CSV
        else {
            const lines = rawData.split(/\r?\n/);
            newWords = lines.map((line, index) => {
                if (!line.trim()) return null;
                
                // Ignore header rows if they look like headers (simple check)
                const lowerLine = line.toLowerCase();
                if (lowerLine.startsWith('word|translation') || lowerLine.startsWith('word,translation')) {
                    return null;
                }

                // Support pipe | or comma ,
                const separator = line.includes('|') ? '|' : ',';
                const cols = line.split(separator).map(c => c.trim());
                
                // Format A: Full Data (7 columns)
                if (cols.length >= 7) {
                    return {
                        id: `csv-${Date.now()}-${index}`,
                        text: cols[0],
                        translation: cols[1],
                        ipa: cols[2],
                        sentence: cols[3],
                        grade: parseInt(cols[4]) as Grade,
                        semester: cols[5] as Semester,
                        unit: parseInt(cols[6])
                    };
                }
                // Format B: Simple Data (2-4 columns) -> Use Defaults
                else if (cols.length >= 2) {
                    return {
                        id: `csv-${Date.now()}-${index}`,
                        text: cols[0],
                        translation: cols[1],
                        ipa: cols[2] || '',
                        sentence: cols[3] || `This is a ${cols[0]}.`,
                        grade: targetGrade,
                        semester: targetSemester,
                        unit: targetUnit
                    };
                }
                return null;
            }).filter(Boolean) as Word[];
        }

        if (newWords.length === 0) {
            showStatus("No valid words found.", 'error');
            return;
        }

        saveCustomWords(newWords);
        forceRefresh();
        showStatus(`Success! Imported ${newWords.length} words to Grade ${targetGrade}, Unit ${targetUnit}.`, 'success');
        setCsvContent('');
        if(fileInputRef.current) fileInputRef.current.value = '';

    } catch (e) {
        console.error(e);
        showStatus("Error processing data.", 'error');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();

      // Handle Excel Files
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          reader.onload = (event) => {
              const data = event.target?.result;
              try {
                  const workbook = XLSX.read(data, { type: 'array' });
                  const firstSheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[firstSheetName];
                  
                  // Convert sheet to CSV using pipe | as delimiter (safer than comma)
                  const csvOutput = XLSX.utils.sheet_to_csv(worksheet, { FS: '|' });
                  processData(csvOutput);
              } catch (error) {
                  showStatus("Failed to parse Excel file", 'error');
              }
          };
          reader.readAsArrayBuffer(file);
      } 
      // Handle Text/JSON/CSV Files
      else {
          reader.onload = (event) => {
              if (event.target?.result) {
                  processData(event.target.result as string);
              }
          };
          reader.readAsText(file);
      }
  };

  const handleClearAll = () => {
      if (!confirmClearAll) {
          setConfirmClearAll(true);
          setTimeout(() => setConfirmClearAll(false), 3000); // Reset after 3s
          return;
      }
      
      clearCustomWords();
      forceRefresh();
      showStatus('All custom words cleared. Restored defaults.', 'info');
      setConfirmClearAll(false);
  };
  
  const handleUnitReset = () => {
      if (!confirmUnitReset) {
          setConfirmUnitReset(true);
          setTimeout(() => setConfirmUnitReset(false), 3000);
          return;
      }

      resetUnitWords(targetGrade, targetSemester, targetUnit);
      forceRefresh();
      showStatus(`Reset Grade ${targetGrade} Unit ${targetUnit} to defaults.`, 'info');
      setConfirmUnitReset(false);
  }

  const fillExample = () => {
      setCsvContent(`apple|苹果|/ˈæpl/|I like apples.
banana|香蕉|/bəˈnɑːnə/|This is a banana.
orange|橙子|/ˈɒrɪndʒ/|An orange.`);
      showStatus("Example loaded. Click 'Import Text' to save.", 'info');
  };
  
  // Statistics
  const stats = [1,2,3,4,5,6].map(g => {
      const count = allWords.filter(w => w.grade === g).length;
      return { grade: g, count };
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-500 font-bold hover:text-foshan-green">← Back</button>
            <h1 className="text-xl font-bold text-slate-800">Teacher Panel 🍎</h1>
        </div>
        <div className="text-sm text-gray-500 font-mono font-bold">Total Words: {allWords.length}</div>
      </div>

      <div className="max-w-3xl mx-auto w-full p-6 space-y-6">
        
        {/* Dashboard Stats */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 uppercase text-xs font-bold tracking-wider mb-3">Database Overview</h3>
            <div className="grid grid-cols-6 gap-2 text-center">
                {stats.map(s => (
                    <div key={s.grade} className="bg-gray-50 p-2 rounded-lg border">
                        <div className="text-xs text-gray-400 font-bold">Grade {s.grade}</div>
                        <div className={`text-lg font-bold ${s.count > 0 ? 'text-foshan-green' : 'text-red-400'}`}>
                            {s.count}
                        </div>
                    </div>
                ))}
            </div>
            {allWords.length === 0 && <p className="text-center text-red-500 text-sm mt-2">Database is empty! Check constants.ts</p>}
        </div>

        {/* Assignment Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-indigo-900">1. Target Assignment</h3>
                <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input type="checkbox" checked={useDefaults} onChange={e => setUseDefaults(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded" />
                    Apply to simple imports
                </label>
            </div>
            
            <div className={`grid grid-cols-3 gap-4 ${!useDefaults ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Grade</label>
                    <select value={targetGrade} onChange={e => setTargetGrade(Number(e.target.value) as Grade)} className="w-full p-2 border rounded-lg bg-gray-50 font-bold">
                        {[1,2,3,4,5,6].map(g => <option key={g} value={g}>Grade {g}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Semester</label>
                    <select value={targetSemester} onChange={e => setTargetSemester(e.target.value as Semester)} className="w-full p-2 border rounded-lg bg-gray-50 font-bold">
                        <option value="1">Term 1 (上)</option>
                        <option value="2">Term 2 (下)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Unit</label>
                    <select value={targetUnit} onChange={e => setTargetUnit(Number(e.target.value))} className="w-full p-2 border rounded-lg bg-gray-50 font-bold">
                        {[1,2,3,4,5,6].map(u => <option key={u} value={u}>Unit {u}</option>)}
                    </select>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-indigo-50 flex justify-between items-center">
                 <p className="text-xs text-gray-400">
                    * Removes custom words for this specific unit. Built-in words will reappear.
                 </p>
                 <button 
                    onClick={handleUnitReset}
                    className={`text-xs px-4 py-2 rounded border font-bold transition-all duration-200
                        ${confirmUnitReset 
                            ? 'bg-red-500 text-white border-red-600 scale-105' 
                            : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100'}`}
                 >
                    {confirmUnitReset ? '⚠️ Confirm Reset?' : 'Reset This Unit'}
                 </button>
            </div>
        </div>

        {/* Import Area */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-foshan-yellow">
            <h3 className="font-bold text-lg text-foshan-darkYellow mb-4">2. Import Data</h3>
            
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-sm text-slate-700 space-y-3 border border-yellow-100">
                <p className="font-bold text-foshan-darkYellow">Supported Formats (Excel, CSV, Text, JSON):</p>
                <div className="text-xs text-gray-600 italic mb-2">
                    Note: If you import a word that exists in the built-in list (same spelling), it will <b>overwrite</b> the built-in definition.
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <span className="font-bold block mb-1 text-indigo-600">Format A: Simple</span>
                        <code className="block bg-white p-2 rounded border text-xs break-all">
                            Word | Translation | IPA | Sentence
                        </code>
                        <p className="text-xs text-gray-400 mt-1">Example: apple|苹果|/æpl/|I like apples.</p>
                    </div>
                    <div>
                        <span className="font-bold block mb-1 text-indigo-600">Format B: Advanced</span>
                        <code className="block bg-white p-2 rounded border text-xs break-all">
                            Word | Translation | IPA | Sentence | Grade | Sem | Unit
                        </code>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                    <p className="font-bold text-gray-600 mb-2">Method A: Upload File (.xlsx, .csv)</p>
                    <input 
                        ref={fileInputRef}
                        type="file" 
                        accept=".xlsx,.xls,.csv,.txt,.json"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-slate-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-foshan-yellow file:text-white
                        hover:file:bg-foshan-darkYellow
                        cursor-pointer"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                         <p className="font-bold text-gray-600">Method B: Copy & Paste</p>
                         <button onClick={fillExample} className="text-xs text-blue-500 underline">Fill Example Data</button>
                    </div>
                    <textarea
                        className="w-full h-32 border p-3 rounded-lg text-sm font-mono focus:ring-2 focus:ring-foshan-yellow outline-none"
                        placeholder="apple|苹果|/æpl/|This is an apple."
                        value={csvContent}
                        onChange={(e) => setCsvContent(e.target.value)}
                    />
                    <button 
                        onClick={() => processData(csvContent)}
                        disabled={!csvContent.trim()}
                        className="mt-2 w-full bg-foshan-green text-white py-2 rounded-lg font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Import Text Data
                    </button>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div className="pt-6 border-t flex justify-end">
            <button 
                onClick={handleClearAll}
                className={`text-sm font-bold border px-6 py-3 rounded transition-all duration-200
                    ${confirmClearAll 
                        ? 'bg-red-600 text-white border-red-700 scale-105 shadow-lg' 
                        : 'text-red-500 border-red-200 hover:bg-red-50'}`}
            >
                {confirmClearAll ? '⚠️ CLICK AGAIN TO DELETE ALL CUSTOM DATA' : '🗑 Clear ALL Custom Data'}
            </button>
        </div>

      </div>

      {/* Toast Notification */}
      {status.msg && (
          <div className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full shadow-xl font-bold text-white animate-bounce-short z-50
            ${status.type === 'success' ? 'bg-green-600' : status.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}
          `}>
              {status.msg}
          </div>
      )}
    </div>
  );
};