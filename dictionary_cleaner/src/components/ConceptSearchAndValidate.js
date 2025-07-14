import { useState } from 'react';
import axios from 'axios';
import { 
  colors, typography, spacing, shadows, 
  buttonStyles, inputStyles, tableStyles, cardStyles 
} from './styles';

const ConceptSearchAndValidate = () => {
  const [searchLabel, setSearchLabel] = useState('');
  const [searchType, setSearchType] = useState('hindi');
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
    <div style={{ ...cardStyles.base, marginBottom: spacing.xlarge }}>
      <h2 style={{ ...cardStyles.title }}>Search & Validate Concepts</h2>
      <div style={{ 
        display: 'flex', 
        gap: spacing.medium, 
        marginBottom: spacing.medium,
        flexWrap: 'wrap' 
      }}>
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value)}
          style={{ ...inputStyles.base, minWidth: '150px' }}
        >
          <option value="hindi">Hindi Label</option>
          <option value="sanskrit">Sanskrit Label</option>
          <option value="english">English Label</option>
        </select>
        <input
          type="text"
          value={searchLabel}
          onChange={(e) => setSearchLabel(e.target.value)}
          placeholder="Enter label..."
          style={{ ...inputStyles.base, flex: 1, minWidth: '200px' }}
        />
        <button 
          onClick={handleSearch} 
          disabled={loading}
          style={{ ...buttonStyles.primary, minWidth: '100px' }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button 
          onClick={handleValidate} 
          disabled={loading}
          style={{ ...buttonStyles.secondary, minWidth: '100px' }}
        >
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div style={{ marginTop: spacing.large }}>
          <h3 style={{ color: colors.primary }}>Search Results</h3>
          {searchResults.concepts ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyles.base}>
                <thead>
                  <tr style={tableStyles.header}>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Concept ID</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Hindi Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Sanskrit Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header }}>English Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Concept Label</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(searchResults.concepts).map((concept, idx) => (
                    <tr key={idx} style={tableStyles.row}>
                      <td style={tableStyles.cell}>{concept.concept_id}</td>
                      <td style={tableStyles.cell}>{concept.hindi_label}</td>
                      <td style={tableStyles.cell}>{concept.sanskrit_label}</td>
                      <td style={tableStyles.cell}>{concept.english_label}</td>
                      <td style={tableStyles.cell}>{concept.concept_label || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p style={{ color: colors.lightText }}>{searchResults.message}</p>
          )}
        </div>
      )}

      {/* Validation Result */}
      {validationResult && (
        <div style={{ 
          marginTop: spacing.large,
          padding: spacing.medium,
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          borderLeft: `4px solid ${colors.accent}`
        }}>
          <h3 style={{ color: colors.primary }}>Validation Result</h3>
          <p><strong>Message:</strong> {validationResult.message}</p>
          <p><strong>Suggested Label:</strong> {validationResult.suggested_label}</p>
        </div>
      )}
    </div>
  );
};

export default ConceptSearchAndValidate;