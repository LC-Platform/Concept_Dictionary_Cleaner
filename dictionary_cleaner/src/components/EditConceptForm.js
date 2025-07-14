// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { 
//   colors, typography, spacing, shadows, 
//   buttonStyles, inputStyles, tableStyles, cardStyles 
// } from '../styles/styles';

// const EditConceptForm = ({ conceptId, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState(null);
//   const [hindiLabelOptions, setHindiLabelOptions] = useState([]);
//   const [relatedConcepts, setRelatedConcepts] = useState([]);
//   const [validationResult, setValidationResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchType, setSearchType] = useState("hindi");
//   const [searchLabel, setSearchLabel] = useState("");

//   useEffect(() => {
//     setLoading(true);
//     axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconceptbyid/${conceptId}`)
//       .then(res => {
//         const concept = res.data.concept;
//         setFormData({
//           concept_label: concept.concept_label,
//           hindi_label: concept.hindi_label,
//           sanskrit_label: concept.sanskrit_label,
//           english_label: concept.english_label,
//           mrsc: concept.mrsc
//         });

//         const baseConceptLabel = concept.concept_label.split('_')[0];
//         axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${baseConceptLabel}`)
//           .then(res => {
//             const labels = Object.keys(res.data.concepts);
//             setHindiLabelOptions(labels);
//           })
//           .catch(() => console.warn("No related Hindi labels found."));

//         axios.get(`https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${baseConceptLabel}`)
//           .then(res => {
//             const conceptsObj = res.data.concepts || {};
//             const conceptsArray = Object.entries(conceptsObj).map(([key, item]) => ({
//               concept_key: key,
//               concept_id: item.concept_id || "-",
//               concept_label: item.cocnept_label || "-",
//               english_label: item.english_label || "-",
//               hindi_label: item.hindi_label || "-",
//               sanskrit_label: item.sanskrit_label || "-"
//             }));
//             setRelatedConcepts(conceptsArray);
//           })
//           .catch(() => console.warn("No related concepts found."));
//       })
//       .catch(() => {
//         alert("Failed to load concept.");
//         onClose();
//       })
//       .finally(() => setLoading(false));
//   }, [conceptId]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setLoading(true);
//     axios.put(`https://canvas.iiit.ac.in/lc/api/concepts/edit/${conceptId}`, formData)
//       .then(() => {
//         alert("Updated successfully");
//         onUpdate(conceptId, formData);
//         onClose();
//       })
//       .catch(() => alert("Update failed"))
//       .finally(() => setLoading(false));
//   };

//   const handleValidate = (labelType, labelValue) => {
//     if (!labelValue || labelValue === '-') {
//       alert(`Label is empty for ${labelType}.`);
//       return;
//     }

//     setLoading(true);
//     setValidationResult(null);

//     let url = '';
//     if (labelType === 'hindi') {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_concept_label/${labelValue}`;
//     } else if (labelType === 'sanskrit') {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_sanskrit_label/${labelValue}`;
//     } else if (labelType === 'english') {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/getconceptss/${labelValue}`;
//     } else if (labelType === 'concept') {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_concept_label/${labelValue}`;
//     }

//     axios
//       .get(url)
//       .then((res) => {
//         setValidationResult({
//           labelType,
//           labelValue,
//           ...res.data,
//         });
//       })
//       .catch(() => alert(`Validation failed for ${labelValue}.`))
//       .finally(() => setLoading(false));
//   };

//   const handleSearch = () => {
//     if (!searchLabel.trim()) {
//       alert("Please enter a label to search.");
//       return;
//     }

//     let url = "";
//     if (searchType === "hindi") {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/${searchLabel}`;
//     } else if (searchType === "sanskrit") {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/get_sanskrit_concepts/sanskrit/${searchLabel}`;
//     } else if (searchType === "english") {
//       url = `https://canvas.iiit.ac.in/lc/api/concepts/getconcepts/english/${searchLabel}`;
//     }

//     setLoading(true);

//     axios.get(url)
//       .then(res => {
//         const conceptsObj = res.data.concepts || {};
//         const conceptsArray = Object.entries(conceptsObj).map(([key, item]) => ({
//           concept_key: key,
//           concept_id: item.concept_id || "-",
//           concept_label: item.cocnept_label || "-",
//           english_label: item.english_label || "-",
//           hindi_label: item.hindi_label || "-",
//           sanskrit_label: item.sanskrit_label || "-"
//         }));
//         setRelatedConcepts(conceptsArray);
//       })
//       .catch(() => {
//         alert(`No concepts found for "${searchLabel}"`);
//         setRelatedConcepts([]);
//       })
//       .finally(() => setLoading(false));
//   };

//   if (!formData) return (
//     <div style={{ 
//       display: 'flex', 
//       justifyContent: 'center', 
//       alignItems: 'center', 
//       height: '200px',
//       fontSize: typography.fontSize.large
//     }}>
//       Loading concept data...
//     </div>
//   );

//   return (
//     <div style={{
//       position: 'fixed',
//       top: '0',
//       left: '0',
//       right: '0',
//       bottom: '0',
//       backgroundColor: 'rgba(0,0,0,0.5)',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       zIndex: '1000',
//       padding: spacing.large
//     }}>
//       <div style={{
//         ...cardStyles.base,
//         width: '90%',
//         maxWidth: '1200px',
//         maxHeight: '90vh',
//         overflowY: 'auto',
//         padding: spacing.xlarge
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: spacing.large
//         }}>
//           <h2 style={{ ...cardStyles.title, margin: 0 }}>Edit Concept</h2>
//           <button 
//             onClick={onClose}
//             style={{
//               ...buttonStyles.secondary,
//               padding: `${spacing.small} ${spacing.medium}`,
//               fontSize: typography.fontSize.medium
//             }}
//           >
//             Close
//           </button>
//         </div>
        
//         <form onSubmit={handleSubmit} style={{ marginBottom: spacing.xlarge }}>
//           <div style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//             gap: spacing.large,
//             marginBottom: spacing.large
//           }}>
//             <div style={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               gap: spacing.small
//             }}>
//               <label style={{ 
//                 fontWeight: 'bold',
//                 color: colors.text 
//               }}>Concept Label:</label>
//               <div style={{ display: 'flex', gap: spacing.small }}>
//                 <input
//                   type="text"
//                   name="concept_label"
//                   value={formData.concept_label}
//                   onChange={handleChange}
//                   style={{ ...inputStyles.base, flex: 1 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleValidate('concept', formData.concept_label)}
//                   disabled={loading}
//                   style={{ ...buttonStyles.secondary, minWidth: '100px' }}
//                 >
//                   {loading ? 'Validating...' : 'Validate'}
//                 </button>
//               </div>
//             </div>

//             <div style={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               gap: spacing.small
//             }}>
//               <label style={{ 
//                 fontWeight: 'bold',
//                 color: colors.text 
//               }}>Sanskrit Label:</label>
//               <div style={{ display: 'flex', gap: spacing.small }}>
//                 <input
//                   type="text"
//                   name="sanskrit_label"
//                   value={formData.sanskrit_label}
//                   onChange={handleChange}
//                   style={{ ...inputStyles.base, flex: 1 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleValidate('sanskrit', formData.sanskrit_label)}
//                   disabled={loading}
//                   style={{ ...buttonStyles.secondary, minWidth: '100px' }}
//                 >
//                   {loading ? 'Validating...' : 'Validate'}
//                 </button>
//               </div>
//             </div>

//             <div style={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               gap: spacing.small
//             }}>
//               <label style={{ 
//                 fontWeight: 'bold',
//                 color: colors.text 
//               }}>English Label:</label>
//               <div style={{ display: 'flex', gap: spacing.small }}>
//                 <input
//                   type="text"
//                   name="english_label"
//                   value={formData.english_label}
//                   onChange={handleChange}
//                   style={{ ...inputStyles.base, flex: 1 }}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => handleValidate('english', formData.english_label)}
//                   disabled={loading}
//                   style={{ ...buttonStyles.secondary, minWidth: '100px' }}
//                 >
//                   {loading ? 'Validating...' : 'Validate'}
//                 </button>
//               </div>
//             </div>

//             <div style={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               gap: spacing.small
//             }}>
//               <label style={{ 
//                 fontWeight: 'bold',
//                 color: colors.text 
//               }}>MRSC:</label>
//               <input
//                 type="text"
//                 name="mrsc"
//                 value={formData.mrsc}
//                 readOnly
//                 style={{ 
//                   ...inputStyles.base, 
//                   backgroundColor: '#f0f0f0', 
//                   cursor: 'not-allowed' 
//                 }}
//               />
//             </div>
//           </div>

//           <div style={{ display: 'flex', gap: spacing.medium }}>
//             <button
//               type="submit"
//               disabled={loading}
//               style={{ 
//                 ...buttonStyles.primary, 
//                 padding: `${spacing.medium} ${spacing.large}`,
//                 fontSize: typography.fontSize.medium
//               }}
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               style={{ 
//                 ...buttonStyles.secondary, 
//                 padding: `${spacing.medium} ${spacing.large}`,
//                 fontSize: typography.fontSize.medium
//               }}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>

//         {validationResult && (
//           <div style={{ 
//             marginBottom: spacing.large,
//             padding: spacing.medium,
//             backgroundColor: '#f8f9fa',
//             borderRadius: '4px',
//             borderLeft: `4px solid ${colors.accent}`
//           }}>
//             <h4 style={{ color: colors.primary, marginTop: 0 }}>Validation Result</h4>
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
//               gap: spacing.medium
//             }}>
//               <div>
//                 <p style={{ fontWeight: 'bold', margin: 0 }}>Label Type:</p>
//                 <p style={{ margin: 0 }}>{validationResult.labelType}</p>
//               </div>
//               <div>
//                 <p style={{ fontWeight: 'bold', margin: 0 }}>Label Value:</p>
//                 <p style={{ margin: 0 }}>{validationResult.labelValue}</p>
//               </div>
//               <div>
//                 <p style={{ fontWeight: 'bold', margin: 0 }}>Message:</p>
//                 <p style={{ margin: 0 }}>{validationResult.message}</p>
//               </div>
//               <div>
//                 <p style={{ fontWeight: 'bold', margin: 0 }}>Suggested Label:</p>
//                 <p style={{ margin: 0 }}>{validationResult.suggested_label}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         <div style={{ marginBottom: spacing.large }}>
//           <h3 style={{ color: colors.primary }}>Search Concepts by Label</h3>
//           <div style={{ 
//             display: 'flex', 
//             gap: spacing.medium, 
//             alignItems: 'center',
//             flexWrap: 'wrap',
//             marginBottom: spacing.medium
//           }}>
//             <select 
//               value={searchType} 
//               onChange={e => setSearchType(e.target.value)}
//               style={{ ...inputStyles.base, minWidth: '120px' }}
//             >
//               <option value="hindi">Hindi</option>
//               <option value="sanskrit">Sanskrit</option>
//               <option value="english">English</option>
//             </select>
//             <input
//               type="text"
//               value={searchLabel}
//               onChange={e => setSearchLabel(e.target.value)}
//               placeholder="Enter label value..."
//               style={{ ...inputStyles.base, flex: 1, minWidth: '200px' }}
//             />
//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               style={{ ...buttonStyles.primary, minWidth: '100px' }}
//             >
//               {loading ? 'Searching...' : 'Search'}
//             </button>
//           </div>
//         </div>

//         {relatedConcepts.length > 0 && (
//           <div>
//             <h3 style={{ color: colors.primary }}>Related Concepts</h3>
//             <div style={{ 
//               overflowX: 'auto',
//               maxHeight: '400px',
//               border: `1px solid ${colors.border}`,
//               borderRadius: '4px'
//             }}>
//               <table style={{ 
//                 ...tableStyles.base,
//                 width: '100%',
//                 minWidth: '800px'
//               }}>
//                 <thead>
//                   <tr style={tableStyles.header}>
//                     <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '15%' }}>Concept ID</th>
//                     <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '25%' }}>Concept Label</th>
//                     <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>English Label</th>
//                     <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>Hindi Label</th>
//                     <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>Sanskrit Label</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {relatedConcepts.map((item, index) => (
//                     <tr key={index} style={tableStyles.row}>
//                       <td style={tableStyles.cell}>{item.concept_id}</td>
//                       <td style={tableStyles.cell}>{item.concept_label}</td>
//                       <td style={tableStyles.cell}>
//                         {searchType === "english"
//                           ? item.concept_key
//                           : item.english_label || item.concept_label || "-"}
//                       </td>
//                       <td style={tableStyles.cell}>{item.hindi_label}</td>
//                       <td style={tableStyles.cell}>{item.sanskrit_label}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default EditConceptForm;







import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  colors, typography, spacing, shadows, 
  buttonStyles, inputStyles, tableStyles, cardStyles 
} from '../styles/styles';

const EditConceptForm = ({ conceptId, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(null);
  const [hindiLabelOptions, setHindiLabelOptions] = useState([]);
  const [relatedConcepts, setRelatedConcepts] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState("hindi");
  const [searchLabel, setSearchLabel] = useState("");
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  useEffect(() => {
    setLoading(true);
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
            const conceptsObj = res.data.concepts || {};
            const conceptsArray = Object.entries(conceptsObj).map(([key, item]) => ({
              concept_key: key,
              concept_id: item.concept_id || "-",
              concept_label: item.cocnept_label || "-",
              english_label: item.english_label || "-",
              hindi_label: item.hindi_label || "-",
              sanskrit_label: item.sanskrit_label || "-"
            }));
            setRelatedConcepts(conceptsArray);
          })
          .catch(() => console.warn("No related concepts found."));
      })
      .catch(() => {
        alert("Failed to load concept.");
        onClose();
      })
      .finally(() => setLoading(false));
  }, [conceptId, onClose]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowUsernameModal(true);
  };

  const confirmSubmit = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);
    axios.put(`https://canvas.iiit.ac.in/lc/api/concepts/edit/${conceptId}`, {
      ...formData,
      username
    })
      .then(() => {
        alert("Updated successfully");
        onUpdate(conceptId, formData);
        onClose();
      })
      .catch(() => alert("Update failed"))
      .finally(() => {
        setLoading(false);
        setShowUsernameModal(false);
        setUsername('');
      });
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
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_concept_label/${labelValue}`;
    } else if (labelType === 'sanskrit') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_sanskrit_label/${labelValue}`;
    } else if (labelType === 'english') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/getconceptss/${labelValue}`;
    } else if (labelType === 'concept') {
      url = `https://canvas.iiit.ac.in/lc/api/concepts/validate_concept_label/${labelValue}`;
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
        const conceptsArray = Object.entries(conceptsObj).map(([key, item]) => ({
          concept_key: key,
          concept_id: item.concept_id || "-",
          concept_label: item.cocnept_label || "-",
          english_label: item.english_label || "-",
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

  if (!formData) return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '200px',
      fontSize: typography.fontSize.large
    }}>
      Loading concept data...
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '1000',
      padding: spacing.large
    }}>
      <div style={{
        ...cardStyles.base,
        width: '90%',
        maxWidth: '1200px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: spacing.xlarge
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: spacing.large
        }}>
          <h2 style={{ ...cardStyles.title, margin: 0 }}>Edit Concept</h2>
          <button 
            onClick={onClose}
            style={{
              ...buttonStyles.secondary,
              padding: `${spacing.small} ${spacing.medium}`,
              fontSize: typography.fontSize.medium
            }}
          >
            Close
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: spacing.xlarge }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: spacing.large,
            marginBottom: spacing.large
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: spacing.small
            }}>
              <label style={{ 
                fontWeight: 'bold',
                color: colors.text 
              }}>Concept Label:</label>
              <div style={{ display: 'flex', gap: spacing.small }}>
                <input
                  type="text"
                  name="concept_label"
                  value={formData.concept_label}
                  onChange={handleChange}
                  style={{ ...inputStyles.base, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleValidate('concept', formData.concept_label)}
                  disabled={loading}
                  style={{ ...buttonStyles.secondary, minWidth: '100px' }}
                >
                  {loading ? 'Validating...' : 'Validate'}
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: spacing.small
            }}>
              <label style={{ 
                fontWeight: 'bold',
                color: colors.text 
              }}>Sanskrit Label:</label>
              <div style={{ display: 'flex', gap: spacing.small }}>
                <input
                  type="text"
                  name="sanskrit_label"
                  value={formData.sanskrit_label}
                  onChange={handleChange}
                  style={{ ...inputStyles.base, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleValidate('sanskrit', formData.sanskrit_label)}
                  disabled={loading}
                  style={{ ...buttonStyles.secondary, minWidth: '100px' }}
                >
                  {loading ? 'Validating...' : 'Validate'}
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: spacing.small
            }}>
              <label style={{ 
                fontWeight: 'bold',
                color: colors.text 
              }}>English Label:</label>
              <div style={{ display: 'flex', gap: spacing.small }}>
                <input
                  type="text"
                  name="english_label"
                  value={formData.english_label}
                  onChange={handleChange}
                  style={{ ...inputStyles.base, flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => handleValidate('english', formData.english_label)}
                  disabled={loading}
                  style={{ ...buttonStyles.secondary, minWidth: '100px' }}
                >
                  {loading ? 'Validating...' : 'Validate'}
                </button>
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: spacing.small
            }}>
              <label style={{ 
                fontWeight: 'bold',
                color: colors.text 
              }}>MRSC:</label>
              <input
                type="text"
                name="mrsc"
                value={formData.mrsc}
                readOnly
                style={{ 
                  ...inputStyles.base, 
                  backgroundColor: '#f0f0f0', 
                  cursor: 'not-allowed' 
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: spacing.medium }}>
            <button
              type="submit"
              disabled={loading}
              style={{ 
                ...buttonStyles.primary, 
                padding: `${spacing.medium} ${spacing.large}`,
                fontSize: typography.fontSize.medium
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ 
                ...buttonStyles.secondary, 
                padding: `${spacing.medium} ${spacing.large}`,
                fontSize: typography.fontSize.medium
              }}
            >
              Cancel
            </button>
          </div>
        </form>

        {validationResult && (
          <div style={{ 
            marginBottom: spacing.large,
            padding: spacing.medium,
            backgroundColor: '#f8f9fa',
            borderRadius: '4px',
            borderLeft: `4px solid ${colors.accent}`
          }}>
            <h4 style={{ color: colors.primary, marginTop: 0 }}>Validation Result</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: spacing.medium
            }}>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Label Type:</p>
                <p style={{ margin: 0 }}>{validationResult.labelType}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Label Value:</p>
                <p style={{ margin: 0 }}>{validationResult.labelValue}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Message:</p>
                <p style={{ margin: 0 }}>{validationResult.message}</p>
              </div>
              <div>
                <p style={{ fontWeight: 'bold', margin: 0 }}>Suggested Label:</p>
                <p style={{ margin: 0 }}>{validationResult.suggested_label}</p>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: spacing.large }}>
          <h3 style={{ color: colors.primary }}>Search Concepts by Label</h3>
          <div style={{ 
            display: 'flex', 
            gap: spacing.medium, 
            alignItems: 'center',
            flexWrap: 'wrap',
            marginBottom: spacing.medium
          }}>
            <select 
              value={searchType} 
              onChange={e => setSearchType(e.target.value)}
              style={{ ...inputStyles.base, minWidth: '120px' }}
            >
              <option value="hindi">Hindi</option>
              <option value="sanskrit">Sanskrit</option>
              <option value="english">English</option>
            </select>
            <input
              type="text"
              value={searchLabel}
              onChange={e => setSearchLabel(e.target.value)}
              placeholder="Enter label value..."
              style={{ ...inputStyles.base, flex: 1, minWidth: '200px' }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{ ...buttonStyles.primary, minWidth: '100px' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {relatedConcepts.length > 0 && (
          <div>
            <h3 style={{ color: colors.primary }}>Related Concepts</h3>
            <div style={{ 
              overflowX: 'auto',
              maxHeight: '400px',
              border: `1px solid ${colors.border}`,
              borderRadius: '4px'
            }}>
              <table style={{ 
                ...tableStyles.base,
                width: '100%',
                minWidth: '800px'
              }}>
                <thead>
                  <tr style={tableStyles.header}>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '15%' }}>Concept ID</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '25%' }}>Concept Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>English Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>Hindi Label</th>
                    <th style={{ ...tableStyles.cell, ...tableStyles.header, width: '20%' }}>Sanskrit Label</th>
                  </tr>
                </thead>
                <tbody>
                  {relatedConcepts.map((item, index) => (
                    <tr key={index} style={tableStyles.row}>
                      <td style={tableStyles.cell}>{item.concept_id}</td>
                      <td style={tableStyles.cell}>{item.concept_label}</td>
                      <td style={tableStyles.cell}>
                        {searchType === "english"
                          ? item.concept_key
                          : item.english_label || item.concept_label || "-"}
                      </td>
                      <td style={tableStyles.cell}>{item.hindi_label}</td>
                      <td style={tableStyles.cell}>{item.sanskrit_label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Username Modal */}
      {showUsernameModal && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1001'
        }}>
          <div style={{
            ...cardStyles.base,
            width: '400px',
            padding: spacing.xlarge
          }}>
            <h3 style={{ marginTop: 0 }}>Enter Your Name</h3>
            <p style={{ marginBottom: spacing.medium }}>Please enter your name to record this action:</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              style={{ ...inputStyles.base, width: '100%', marginBottom: spacing.medium }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing.small }}>
              <button 
                onClick={() => {
                  setShowUsernameModal(false);
                  setUsername('');
                }}
                style={buttonStyles.secondary}
              >
                Cancel
              </button>
              <button 
                onClick={confirmSubmit}
                disabled={loading}
                style={buttonStyles.primary}
              >
                {loading ? 'Saving...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditConceptForm;