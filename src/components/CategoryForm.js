import React, { useState } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Alert } from 'react-bootstrap';

const CategoryForm = ({ showModal, setShowModal, fetchData }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryImage) {
      setError('Por favor complete todos los campos.');
      return;
    }
    try {
      await axios.post('https://api.escuelajs.co/api/v1/categories', { name: categoryName, image: categoryImage });
      setCategoryName('');
      setCategoryImage('');
      setSuccess('Categoría agregada con éxito');
      setShowModal(false);
      // Llamar a la función fetchData para actualizar la lista de categorías
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Categoría</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="categoryName">
            <Form.Label>Nombre:</Form.Label>
            <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)}  />
          </Form.Group>
          <Form.Group controlId="categoryImage">
            <Form.Label>Imagen (URL):</Form.Label>
            <Form.Control type="text" value={categoryImage} onChange={(e) => setCategoryImage(e.target.value)} />
          </Form.Group>
          <Button variant="primary" type="submit">Agregar</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CategoryForm;
