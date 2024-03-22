import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { BsFillTrashFill } from 'react-icons/bs';
import { BsPencilSquare } from 'react-icons/bs';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categoryToUpdate, setCategoryToUpdate] = useState(null);
  const [error, setError] = useState(null);
  const [addCategoryError, setAddCategoryError] = useState(null);
  const [updateCategoryError, setUpdateCategoryError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
      setCategories(response.data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleUpdateClick = (category) => {
    setCategoryToUpdate(category);
    setShowUpdateModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`https://api.escuelajs.co/api/v1/categories/${categoryToDelete.id}`);
      setShowDeleteModal(false);
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
    } catch (error) {
      setError(error.message);
    }
  };

  const handleConfirmUpdate = async () => {
    try {
      if (!categoryToUpdate.name || !categoryToUpdate.image) {
        setUpdateCategoryError("Por favor complete todos los campos.");
        return;
      }
      
      await axios.put(`https://api.escuelajs.co/api/v1/categories/${categoryToUpdate.id}`, categoryToUpdate);
      setShowUpdateModal(false);
      // Actualizar lista de categorías después de la actualización
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddCategory = async () => {
    try {
      if (!categoryToUpdate.name || !categoryToUpdate.image) {
        setAddCategoryError("Por favor complete todos los campos.");
        return;
      }
      
      await axios.post(`https://api.escuelajs.co/api/v1/categories/`, categoryToUpdate);
      setShowUpdateModal(false);
      // Actualizar lista de categorías después de la adición
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td><img src={category.image} alt={category.name} style={{ width: '100px' }} /></td>
              <td>
              <Button variant="info" onClick={() => handleUpdateClick(category)}>
                <BsPencilSquare /> Actualizar
              </Button>
              <Button variant="danger" onClick={() => handleDeleteClick(category)}>
                <BsFillTrashFill /> Eliminar
              </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro de que desea eliminar la categoría "{categoryToDelete?.name}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Eliminar</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{categoryToUpdate ? 'Actualizar Categoría' : 'Agregar Categoría'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" placeholder="Ingrese el nombre" value={categoryToUpdate?.name || ''} onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, name: e.target.value })} />
              {updateCategoryError && <Alert variant="danger">{updateCategoryError}</Alert>}
            </Form.Group>
            <Form.Group controlId="categoryImage">
              <Form.Label>Imagen (URL)</Form.Label>
              <Form.Control type="text" placeholder="Ingrese la URL de la imagen" value={categoryToUpdate?.image || ''} onChange={(e) => setCategoryToUpdate({ ...categoryToUpdate, image: e.target.value })} />
              {addCategoryError && <Alert variant="danger">{addCategoryError}</Alert>}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancelar</Button>
          {categoryToUpdate ? (
            <Button variant="primary" onClick={handleConfirmUpdate}>Actualizar</Button>
          ) : (
            <Button variant="primary" onClick={handleAddCategory}>Agregar</Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CategoryList;
