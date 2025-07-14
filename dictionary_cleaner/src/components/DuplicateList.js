// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   colors, typography, spacing, shadows, 
//   buttonStyles, inputStyles, tableStyles, cardStyles 
// } from '../styles/styles';

// const ITEMS_PER_PAGE = 5;

// const DuplicateList = ({ onEditClick, duplicates, setDuplicates }) => {
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     if (!duplicates) {
//       axios.get('https://canvas.iiit.ac.in/lc/api/concepts/duplicates')
//         .then(res => setDuplicates(res.data))
//         .catch(() => alert("No duplicates found"))
//         .finally(() => setLoading(false));
//     } else {
//       setLoading(false);
//     }
//   }, [duplicates, setDuplicates]);

//   const handleDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this concept?")) {
//       axios.delete(`https://canvas.iiit.ac.in/lc/api/concepts/delete/${id}`)
//         .then(() => {
//           const updated = { ...duplicates };
//           for (let label in updated) {
//             updated[label] = updated[label].filter(con => con.concept_id !== id);
//             if (updated[label].length === 0) {
//               delete updated[label];
//             }
//           }
//           setDuplicates(updated);
//           alert("Deleted successfully");
//         })
//         .catch(() => alert("Delete failed"));
//     }
//   };

//   if (loading) return <div style={{ padding: spacing.large }}>Loading...</div>;
//   if (!duplicates) return null;

//   const allLabels = Object.keys(duplicates);
//   const totalPages = Math.ceil(allLabels.length / ITEMS_PER_PAGE);
//   const currentLabels = allLabels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

//   return (
//     <div style={cardStyles.base}>
//       <h2 style={cardStyles.title}>Duplicate Concept Labels</h2>
      
//       {currentLabels.length === 0 ? (
//         <p style={{ color: colors.lightText }}>No duplicates found</p>
//       ) : (
//         <>
//           {currentLabels.map(label => (
//             <div key={label} style={{ marginBottom: spacing.xlarge }}>
//               <h4 style={{ color: colors.secondary }}>Concept Label: {label}</h4>
//               <div style={{ overflowX: 'auto' }}>
//                 <table style={tableStyles.base}>
//                   <thead>
//                     <tr style={tableStyles.header}>
//                       <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Hindi</th>
//                       <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Sanskrit</th>
//                       <th style={{ ...tableStyles.cell, ...tableStyles.header }}>English</th>
//                       <th style={{ ...tableStyles.cell, ...tableStyles.header }}>MRSC</th>
//                       <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {duplicates[label].map(con => (
//                       <tr key={con.concept_id} style={tableStyles.row}>
//                         <td style={tableStyles.cell}>{con.hindi_label}</td>
//                         <td style={tableStyles.cell}>{con.sanskrit_label}</td>
//                         <td style={tableStyles.cell}>{con.english_label}</td>
//                         <td style={tableStyles.cell}>{con.mrsc}</td>
//                         <td style={tableStyles.cell}>
//                           <button 
//                             onClick={() => onEditClick(con.concept_id)}
//                             style={{ ...buttonStyles.secondary, marginRight: spacing.small }}
//                           >
//                             Edit
//                           </button>
//                           <button 
//                             onClick={() => handleDelete(con.concept_id)}
//                             style={buttonStyles.danger}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div style={{ 
//               display: 'flex', 
//               justifyContent: 'center', 
//               alignItems: 'center',
//               gap: spacing.medium, 
//               marginTop: spacing.large 
//             }}>
//               <button 
//                 onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
//                 disabled={currentPage === 1}
//                 style={buttonStyles.primary}
//               >
//                 Previous
//               </button>
//               <span style={{ color: colors.text }}>
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button 
//                 onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
//                 disabled={currentPage === totalPages}
//                 style={buttonStyles.primary}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default DuplicateList;



import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  colors, typography, spacing, shadows, 
  buttonStyles, inputStyles, tableStyles, cardStyles 
} from '../styles/styles';

const ITEMS_PER_PAGE = 5;

const DuplicateList = ({ onEditClick, duplicates, setDuplicates }) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    if (!duplicates) {
      axios.get('https://canvas.iiit.ac.in/lc/api/concepts/duplicates')
        .then(res => setDuplicates(res.data))
        .catch(() => alert("No duplicates found"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [duplicates, setDuplicates]);

  const promptUsername = (id) => {
    setPendingDeleteId(id);
    setShowUsernameModal(true);
  };

  const handleDelete = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    if (window.confirm("Are you sure you want to delete this concept?")) {
      axios.delete(`https://canvas.iiit.ac.in/lc/api/concepts/delete/${pendingDeleteId}`, {
        data: { username }
      })
        .then(() => {
          const updated = { ...duplicates };
          for (let label in updated) {
            updated[label] = updated[label].filter(con => con.concept_id !== pendingDeleteId);
            if (updated[label].length === 0) {
              delete updated[label];
            }
          }
          setDuplicates(updated);
          alert("Deleted successfully");
          setUsername('');
          setShowUsernameModal(false);
        })
        .catch(() => alert("Delete failed"));
    }
  };

  if (loading) return <div style={{ padding: spacing.large }}>Loading...</div>;
  if (!duplicates) return null;

  const allLabels = Object.keys(duplicates);
  const totalPages = Math.ceil(allLabels.length / ITEMS_PER_PAGE);
  const currentLabels = allLabels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div style={cardStyles.base}>
      <h2 style={cardStyles.title}>Duplicate Concept Labels</h2>
      
      {currentLabels.length === 0 ? (
        <p style={{ color: colors.lightText }}>No duplicates found</p>
      ) : (
        <>
          {currentLabels.map(label => (
            <div key={label} style={{ marginBottom: spacing.xlarge }}>
              <h4 style={{ color: colors.secondary }}>Concept Label: {label}</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyles.base}>
                  <thead>
                    <tr style={tableStyles.header}>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Hindi</th>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Sanskrit</th>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>English</th>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>MRSC</th>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {duplicates[label].map(con => (
                      <tr key={con.concept_id} style={tableStyles.row}>
                        <td style={tableStyles.cell}>{con.hindi_label}</td>
                        <td style={tableStyles.cell}>{con.sanskrit_label}</td>
                        <td style={tableStyles.cell}>{con.english_label}</td>
                        <td style={tableStyles.cell}>{con.mrsc}</td>
                        <td style={tableStyles.cell}>
                          <button 
                            onClick={() => onEditClick(con.concept_id)}
                            style={{ ...buttonStyles.secondary, marginRight: spacing.small }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => promptUsername(con.concept_id)}
                            style={buttonStyles.danger}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

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
              zIndex: '1000'
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
                    onClick={handleDelete}
                    style={buttonStyles.primary}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              gap: spacing.medium, 
              marginTop: spacing.large 
            }}>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1}
                style={buttonStyles.primary}
              >
                Previous
              </button>
              <span style={{ color: colors.text }}>
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                disabled={currentPage === totalPages}
                style={buttonStyles.primary}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DuplicateList;