import React, { useState } from 'react';
import DuplicateList from './components/DuplicateList';
import EditConceptForm from './components/EditConceptForm';
import ConceptSearchAndValidate from './components/ConceptSearchAndValidate';

function App() {
  const [editingConceptId, setEditingConceptId] = useState(null);
  const [duplicates, setDuplicates] = useState(null);

  const openEditModal = (conceptId) => setEditingConceptId(conceptId);
  const closeEditModal = () => setEditingConceptId(null);

  const handleUpdate = (conceptId, updatedData) => {
    const updated = { ...duplicates };
    for (let label in updated) {
      updated[label] = updated[label].map(concept =>
        concept.concept_id === conceptId
          ? { ...concept, ...updatedData }
          : concept
      );
    }
    setDuplicates(updated);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <h1>Concept Dictionary - Duplicate Cleaner</h1>

      {/* NEW: Search and Validate Component
      <ConceptSearchAndValidate /> */}

      <DuplicateList
        onEditClick={openEditModal}
        duplicates={duplicates}
        setDuplicates={setDuplicates}
      />

      {editingConceptId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <div style={{
            background: '#fff',
            margin: 'auto',
            padding: '20px',
            width: '400px',
            borderRadius: '8px'
          }}>
            <button
              onClick={closeEditModal}
              style={{
                float: 'right',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px'
              }}
            >
              X
            </button>
            <h3>Edit Concept</h3>
            <EditConceptForm
              conceptId={editingConceptId}
              onClose={closeEditModal}
              onUpdate={handleUpdate}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
