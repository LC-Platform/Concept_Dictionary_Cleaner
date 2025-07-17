import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { 
  colors, typography, spacing, shadows, 
  buttonStyles, inputStyles, tableStyles, cardStyles 
} from '../styles/styles';

const ITEMS_PER_PAGE = 5;

const DuplicateList = ({ 
  onEditClick, 
  duplicates, 
  setDuplicates,
  currentPage,
  setCurrentPage
}) =>  {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!duplicates) {
      fetchDuplicates();
    } else {
      setLoading(false);
    }
  }, [duplicates, setDuplicates]);

  const fetchDuplicates = () => {
    setLoading(true);
    axios.get('https://canvas.iiit.ac.in/lc/api/concepts/duplicates')
      .then(res => {
        setDuplicates(res.data);
      })
      .catch(() => alert("No duplicates found"))
      .finally(() => setLoading(false));
  };

  const filteredLabels = useMemo(() => {
    if (!duplicates) return [];
    
    const allLabels = Object.keys(duplicates);
    
    if (!searchTerm.trim()) return allLabels;
    
    const searchLower = searchTerm.toLowerCase();
    
    return allLabels.filter(label => {
      // Check if label matches search term
      if (label.toLowerCase().includes(searchLower)) return true;
      
      // Check if any concept in this label group matches the search term
      return duplicates[label].some(concept => {
        return (
          (concept.hindi_label && concept.hindi_label.toLowerCase().includes(searchLower)) ||
          (concept.sanskrit_label && concept.sanskrit_label.toLowerCase().includes(searchLower)) ||
          (concept.english_label && concept.english_label.toLowerCase().includes(searchLower)) ||
          (concept.mrsc && concept.mrsc.toLowerCase().includes(searchLower))
        );
      });
    });
  }, [duplicates, searchTerm]);

  const totalPages = Math.ceil(filteredLabels.length / ITEMS_PER_PAGE);
  const currentLabels = filteredLabels.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, 
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, setCurrentPage]);

  const promptUsername = (id) => {
    setPendingDeleteId(id);
    setShowUsernameModal(true);
  };

  const handleDelete = () => {
    if (!username.trim()) {
      alert("Please enter your name");
      return;
    }

    setIsDeleting(true);
    const originalDuplicates = {...duplicates};
    const originalPage = currentPage;
    
    // Optimistic update
    const updated = {...duplicates};
    for (let label in updated) {
      updated[label] = updated[label].filter(con => con.concept_id !== pendingDeleteId);
      if (updated[label].length === 0) {
        delete updated[label];
      }
    }
    setDuplicates(updated);

    axios.delete(`https://canvas.iiit.ac.in/lc/api/concepts/delete/${pendingDeleteId}`, {
      data: { username }
    })
      .then(() => {
        alert("Deleted successfully");
        // If we're on a page that might now be empty, adjust the page
        const allLabels = Object.keys(updated);
        const totalPages = Math.ceil(allLabels.length / ITEMS_PER_PAGE);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        fetchDuplicates().then(() => {
          // After refetch, restore to original page
          setCurrentPage(originalPage);
        });
      })
      .catch(() => {
        alert("Delete failed");
        // Revert on error
        setDuplicates(originalDuplicates);
      })
      .finally(() => {
        setIsDeleting(false);
        setUsername('');
        setShowUsernameModal(false);
      });
  };

  if (loading) return <div style={{ padding: spacing.large }}>Loading...</div>;
  if (!duplicates) return null;

  return (
    <div style={cardStyles.base}>
      <h2 style={cardStyles.title}>Duplicate Concept Labels</h2>
      
      {/* Search Input */}
      <div style={{ marginBottom: spacing.medium }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search duplicates..."
          style={{ 
            ...inputStyles.base, 
            width: '100%',
            maxWidth: '400px',
            padding: spacing.small,
            fontSize: typography.fontSize
          }}
        />
      </div>
      
      {filteredLabels.length === 0 ? (
        <p style={{ color: colors.lightText }}>
          {searchTerm.trim() ? 'No matching duplicates found' : 'No duplicates found'}
        </p>
      ) : (
        <>
          {currentLabels.map(label => (
            <div key={label} style={{ marginBottom: spacing.xlarge }}>
              <h4 style={{ color: colors.secondary }}>Concept Label: {label}</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyles.base}>
                  <thead>
                    <tr style={tableStyles.header}>
                      <th style={{ ...tableStyles.cell, ...tableStyles.header }}>Concept</th>
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
                        <td style={tableStyles.cell}>{con.concept_label}</td>
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
                            disabled={isDeleting}
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
                    disabled={isDeleting}
                    style={buttonStyles.primary}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm'}
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