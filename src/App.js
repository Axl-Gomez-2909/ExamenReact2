import React, { useState } from 'react';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import { Button } from 'react-bootstrap'; 

function App() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="container">
      <h1>Listado de Categorías</h1>
      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3"><i className="bi bi-plus"></i> Agregar Categoría</Button>
      <CategoryList />
      <CategoryForm showModal={showAddModal} setShowModal={setShowAddModal} />
      
    </div>
  );
}

export default App;
