

import { useEffect, useState } from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

const DuplicateList = ({ onEditClick, duplicates, setDuplicates }) => {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

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

  const handleDelete = (id) => {
    axios.delete(`https://canvas.iiit.ac.in/lc/api/concepts/delete/${id}`)
      .then(() => {
        const updated = { ...duplicates };
        for (let label in updated) {
          updated[label] = updated[label].filter(con => con.concept_id !== id);
        }
        setDuplicates(updated);
        alert("Deleted successfully");
      });
  };

  if (loading) return <div>Loading...</div>;
  if (!duplicates) return null;

  const allLabels = Object.keys(duplicates);
  const totalPages = Math.ceil(allLabels.length / ITEMS_PER_PAGE);
  const currentLabels = allLabels.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div>
      <h2>Duplicate Concept Labels</h2>
      {currentLabels.map(label => (
        <div key={label} style={{ marginBottom: '20px' }}>
          <h4>Concept Label: {label}</h4>
          <table border="1" cellPadding="8" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Hindi</th><th>Sanskrit</th><th>English</th><th>MRSC</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {duplicates[label].map(con => (
                <tr key={con.concept_id}>
                  <td>{con.hindi_label}</td>
                  <td>{con.sanskrit_label}</td>
                  <td>{con.english_label}</td>
                  <td>{con.mrsc}</td>
                  <td>
                    <button onClick={() => onEditClick(con.concept_id)}>Edit</button>
                    <button onClick={() => handleDelete(con.concept_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DuplicateList;
