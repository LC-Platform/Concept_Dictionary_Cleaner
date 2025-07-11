import { useState, useEffect } from 'react';
import axios from 'axios';

const EditConceptForm = ({ conceptId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [hindiLabelOptions, setHindiLabelOptions] = useState([]);
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW - search controls
  const [searchType, setSearchType] = useState("hindi");
  const [searchLabel, setSearchLabel] = useState("");

  useEffect(() => {
    axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconceptbyid/${conceptId}`)
      .then(res => {
        const concept = res.data.concept;
        setFormData({
          concept_label: concept.concept_label,
          hindi_label: concept.hindi_label,
          sanskrit_label: concept.sanskrit_label,
          english_label: concept.english_label,
          mrsc: concept.mrsc
        });

        const baseConceptLabel = concept.concept_label.split('_')[0];
        axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${baseConceptLabel}`)
          .then(res => {
            const labels = Object.keys(res.data.concepts);
            setHindiLabelOptions(labels);
          })
          .catch(() => console.warn("No related Hindi labels found."));

        axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${baseConceptLabel}`)
          .then(res => {
            const conceptsArray = Object.values(res.data.concepts);
            setRelatedConcepts(conceptsArray);
          })
          .catch(() => console.warn("No related concepts found."));
      })
      .catch(() => {
        alert("Failed to load concept.");
        onClose();
      });
  }, [conceptId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`https://canvas.iiit.ac.in/lc/api/concepts/edit/${conceptId}`, formData)
      .then(() => {
        alert("Updated successfully");
        onUpdate(conceptId, formData);
        onClose();
      })
      .catch(() => alert("Update failed"));
  };

  const handleValidate = (labelType, labelValue) => {
    if (!labelValue || labelValue === '-') {
      alert(`Label is empty for ${labelType}.`);
      return;
    }

    setLoading(true);
    setValidationResult(null);

    let url = '';
    if (labelType === 'hindi') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_hindi_label/${labelValue}`;
    } else if (labelType === 'sanskrit') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_sanskrit_label/${labelValue}`;
    } else if (labelType === 'english') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/getconceptss/${labelValue}`;
    } else if (labelType === 'concept') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_hindi_label/${labelValue}`;
    }

    axios
      .get(url)
      .then((res) => {
        setValidationResult({
          labelType,
          labelValue,
          ...res.data,
        });
      })
      .catch(() => alert(`Validation failed for ${labelValue}.`))
      .finally(() => setLoading(false));
  };

  // NEW - search handler
  const handleSearch = () => {
    if (!searchLabel.trim()) {
      alert("Please enter a label to search.");
      return;
    }

    let url = "";
    if (searchType === "hindi") {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${searchLabel}`;
    } else if (searchType === "sanskrit") {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/get_sanskrit_concepts/sanskrit/${searchLabel}`;
    } else if (searchType === "english") {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/english/${searchLabel}`;
    }

    setLoading(true);

    axios.get(url)
      .then(res => {
        const conceptsObj = res.data.concepts || {};
        // Convert object entries to array, keeping the key as 'concept_key'
        const conceptsArray = Object.entries(conceptsObj).map(([key, item]) => ({
          concept_key: key,               // keep the key here
          concept_id: item.concept_id || "-",
          concept_label: item.concept_label || "-",
          english_label: item.english_label || "-", // might be missing
          hindi_label: item.hindi_label || "-",
          sanskrit_label: item.sanskrit_label || "-"
        }));
        setRelatedConcepts(conceptsArray);
      })
      .catch(() => {
        alert(`No concepts found for "${searchLabel}"`);
        setRelatedConcepts([]);
      })
      .finally(() => setLoading(false));
  };

  if (!formData) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      {/* Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Concept Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', minWidth: '150px' }}>Concept Label:</label>
          <input
            type="text"
            name="concept_label"
            value={formData.concept_label}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => handleValidate('concept', formData.concept_label)}
            style={{
              padding: '5px 10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Validate
          </button>
        </div>

        {/* Sanskrit Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', minWidth: '150px' }}>Sanskrit Label:</label>
          <input
            type="text"
            name="sanskrit_label"
            value={formData.sanskrit_label}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => handleValidate('sanskrit', formData.sanskrit_label)}
            style={{
              padding: '5px 10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Validate
          </button>
        </div>

        {/* English Label */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', minWidth: '150px' }}>English Label:</label>
          <input
            type="text"
            name="english_label"
            value={formData.english_label}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => handleValidate('english', formData.english_label)}
            style={{
              padding: '5px 10px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Validate
          </button>
        </div>

        {/* MRSC */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 'bold', minWidth: '150px' }}>MRSC:</label>
          <input
            type="text"
            name="mrsc"
            value={formData.mrsc}
            readOnly
            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px',
            marginTop: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Save Changes
        </button>
      </form>

      {/* Validation Result */}
      {validationResult && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ddd' }}>
          <h4>Validation Result</h4>
          <p><strong>Label Type:</strong> {validationResult.labelType}</p>
          <p><strong>Label Value:</strong> {validationResult.labelValue}</p>
          <p><strong>Message:</strong> {validationResult.message}</p>
          <p><strong>Suggested Label:</strong> {validationResult.suggested_label}</p>
        </div>
      )}

      {/* NEW - Search Section */}
      <div style={{ marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '20px' }}>
        <h3>Search Concepts by Label</h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select value={searchType} onChange={e => setSearchType(e.target.value)}>
            <option value="hindi">Hindi</option>
            <option value="sanskrit">Sanskrit</option>
            <option value="english">English</option>
          </select>
          <input
            type="text"
            value={searchLabel}
            onChange={e => setSearchLabel(e.target.value)}
            placeholder="Enter label value..."
          />
          <button
            onClick={handleSearch}
            style={{
              padding: '6px 12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {/* Related Concepts Table */}
      {/* Related Concepts Table */}
{relatedConcepts.length > 0 && (
  <div style={{ 
    marginTop: '20px', 
    overflowX: 'auto',   // horizontal scroll if needed
    overflowY: 'auto',   // vertical scroll
    maxWidth: '100%',
    maxHeight: '300px',  // fixed max height for vertical scroll area
  }}>
    <h3>Related Concepts</h3>
    <table
      border="1"
      cellPadding="8"
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        tableLayout: 'fixed' // fix column widths and enable wrapping
      }}
    >
      <thead>
        <tr>
          <th style={{ width: '10%' }}>Concept ID</th>
          <th style={{ width: '25%' }}>Concept Label</th>
          <th style={{ width: '25%' }}>English Label</th>
          <th style={{ width: '20%' }}>Hindi Label</th>
          <th style={{ width: '20%' }}>Sanskrit Label</th>
        </tr>
      </thead>
      <tbody>
        {relatedConcepts.map((item, index) => (
          <tr key={index} style={{ wordBreak: 'break-word' }}>
            <td>{item.concept_id}</td>
            <td>{item.concept_label}</td>
            <td>
              {searchType === "english"
                ? item.concept_key
                : item.english_label || item.concept_label || "-"}
            </td>
            <td>{item.hindi_label}</td>
            <td>{item.sanskrit_label}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

    </div>
  );
};

export default EditConceptForm;
