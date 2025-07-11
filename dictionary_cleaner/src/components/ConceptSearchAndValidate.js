import { useState } from 'react';
import axios from 'axios';

const ConceptSearchAndValidate = () => {
  const [searchLabel, setSearchLabel] = useState('');
  const [searchType, setSearchType] = useState('hindi'); // hindi | sanskrit | english
  const [searchResults, setSearchResults] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'https://canvas.iiit.ac.in/lc/api/concepts';

  const handleSearch = () => {
    if (!searchLabel.trim()) {
      alert('Please enter a label to search.');
      return;
    }
    setLoading(true);
    setSearchResults(null);
    setValidationResult(null);

    let url = '';
    if (searchType === 'hindi') {
      url = `${API_BASE}/getconcepts/${searchLabel}`;
    } else if (searchType === 'sanskrit') {
      url = `${API_BASE}/get_sanskrit_concepts/sanskrit/${searchLabel}`;
    } else {
      url = `${API_BASE}/getconcepts/english/${searchLabel}`;
    }

    axios
      .get(url)
      .then((res) => setSearchResults(res.data))
      .catch(() => alert('No concepts found.'))
      .finally(() => setLoading(false));
  };

  const handleValidate = () => {
    if (!searchLabel.trim()) {
      alert('Please enter a label to validate.');
      return;
    }
    setLoading(true);
    setSearchResults(null);
    setValidationResult(null);

    let url = '';
    if (searchType === 'hindi') {
      url = `${API_BASE}/validate_hindi_label/${searchLabel}`;
    } else if (searchType === 'sanskrit') {
      url = `${API_BASE}/validate_sanskrit_label/${searchLabel}`;
    } else {
      url = `${API_BASE}/getconceptss/${searchLabel}`;
    }

    axios
      .get(url)
      .then((res) => setValidationResult(res.data))
      .catch(() => alert('Validation failed.'))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', marginBottom: '30px' }}>
      <h2>Search & Validate Concepts</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="hindi">Hindi Label</option>
          <option value="sanskrit">Sanskrit Label</option>
          <option value="english">English Label</option>
        </select>
        <input
          type="text"
          value={searchLabel}
          onChange={(e) => setSearchLabel(e.target.value)}
          placeholder="Enter label..."
          style={{ flex: 1 }}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button onClick={handleValidate} disabled={loading}>
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div style={{ marginTop: '20px' }}>
          <h3>Search Results</h3>
          {searchResults.concepts ? (
            <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Concept ID</th>
                  <th>Hindi Label</th>
                  <th>Sanskrit Label</th>
                  <th>English Label</th>
                  <th>Concept Label</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(searchResults.concepts).map((concept, idx) => (
                  <tr key={idx}>
                    <td>{concept.concept_id}</td>
                    <td>{concept.hindi_label}</td>
                    <td>{concept.sanskrit_label}</td>
                    <td>{concept.english_label}</td>
                    <td>{concept.concept_label || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>{searchResults.message}</p>
          )}
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Validation Result</h3>
          <p><strong>Message:</strong> {validationResult.message}</p>
          <p><strong>Suggested Label:</strong> {validationResult.suggested_label}</p>
        </div>
      )}
    </div>
  );
};

export default ConceptSearchAndValidate;
