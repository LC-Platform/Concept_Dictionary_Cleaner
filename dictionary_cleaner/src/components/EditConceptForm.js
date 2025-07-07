import { useState, useEffect } from 'react';
import axios from 'axios';

const EditConceptForm = ({ conceptId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [hindiLabelOptions, setHindiLabelOptions] = useState([]);
  const [relatedConcepts, setRelatedConcepts] = useState([]);

  useEffect(() => {
    // Step 1: Fetch concept by ID
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

        // Step 2: Fetch hindi_label options using concept label root
        const baseConceptLabel = concept.concept_label.split('_')[0];
        axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${baseConceptLabel}`)
          .then(res => {
            const labels = Object.keys(res.data.concepts);
            setHindiLabelOptions(labels);
          })
          .catch(() => console.warn("No related Hindi labels found."));

        // Step 3: Fetch related concepts by hindi_label for table display
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

  if (!formData) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', padding: '20px' }}>
      {/* Edit Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <label style={{ fontWeight: 'bold' }}>Concept Label:</label>
          <input
            type="text"
            name="concept_label"
            value={formData.concept_label}
            onChange={handleChange}
          />
        </div>

        
        <div>
          <label style={{ fontWeight: 'bold' }}>Sanskrit Label:</label>
          <input
            type="text"
            name="sanskrit_label"
            value={formData.sanskrit_label}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>English Label:</label>
          <input
            type="text"
            name="english_label"
            value={formData.english_label}
            onChange={handleChange}
          />
        </div>

        <div>
          <label style={{ fontWeight: 'bold' }}>MRSC:</label>
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
          style={{ padding: '10px', marginTop: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          Save Changes
        </button>
      </form>

      {/* Related Concepts Table */}
      {relatedConcepts.length > 0 && (
        <div>
          <h3>Related Concepts</h3>
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Concept Label</th>
                <th>English Label</th>
                <th>Hindi Label</th>
                <th>Sanskrit Label</th>
              </tr>
            </thead>
            <tbody>
              {relatedConcepts.map((item, index) => (
                <tr key={index}>
                  <td>{item.hindi_label || '-'}</td>
                  <td>{item.english_label}</td>
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
