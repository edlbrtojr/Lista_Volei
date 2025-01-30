import { useState, useEffect } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [entries, setEntries] = useState([]);
  const [waitingList, setWaitingList] = useState([]);
  const [config, setConfig] = useState({ size: 12 });

  useEffect(() => {
    // Fetch initial data from localStorage or API
    const storedEntries = JSON.parse(localStorage.getItem('entries')) || [];
    const storedConfig = JSON.parse(localStorage.getItem('config')) || { size: 12 };
    setEntries(storedEntries);
    setConfig(storedConfig);
  }, []);

  const handleSubmit = () => {
    const newEntry = {
      input,
      date: new Date().toLocaleString(),
      ip: '127.0.0.1' // Placeholder for actual IP
    };
    const updatedEntries = [...entries, newEntry];
    if (updatedEntries.length <= config.size) {
      setEntries(updatedEntries);
      localStorage.setItem('entries', JSON.stringify(updatedEntries));
    } else {
      setWaitingList([...waitingList, newEntry]);
    }
    setInput('');
  };

  return (
    <div>
      <h1>Lista dos Desesperado</h1>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSubmit}>Enviar</button>
      <h2>Lista Principal</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Input</th>
            <th>Data e Hora</th>
            <th>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{entry.input}</td>
              <td>{entry.date}</td>
              <td>{entry.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {waitingList.length > 0 && (
        <>
          <h2>Lista de Espera</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Input</th>
                <th>Data e Hora</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {waitingList.map((entry, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{entry.input}</td>
                  <td>{entry.date}</td>
                  <td>{entry.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
