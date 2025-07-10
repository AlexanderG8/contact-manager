import { useState } from "react";

export default function ContactForm ({handleAddContact}) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: ""
    });

    const [errors, setErrors] = useState({});
    
    function validateForm(){
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
        if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido";
        if (!formData.phone) newErrors.phone = "El teléfono es requerido";
        if (!/^\d+$/.test(formData.phone)) newErrors.phone = "Solo se permiten números";
        if (!formData.email.trim()) newErrors.email = "El email es requerido";
        if(!formData.email.trim().includes("@")) newErrors.email = "El email debe contener un @";
        return newErrors;
    }

  const handleChangeContact = (event) => {
    // Lo que realizo es obtengo los datos del formulario y los actualizo
    // con los datos que se ingresan en el formulario
    setFormData({... formData, name: event.target.value});
  };
  const handleChangeTelContact = (event) => {
    setFormData({... formData, phone: event.target.value});
  };

  const handleChangeEmail = (event) => {
    setFormData({... formData, email: event.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formErrors = validateForm();
    if(Object.keys(formErrors).length > 0){
        setErrors(formErrors);
        return;
    }

    setErrors({});

    const newContact = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
    }
    // Llamo al callback onAddContact y le paso el nuevo contacto
    handleAddContact && handleAddContact(newContact);
    setFormData({name: "", phone: "", email: ""});
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div
        className="form-row"
        style={{ display: "flex", gap: "1rem", alignItems: "flex-end" }}
      >
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChangeContact}
            placeholder="Ingrese nombre"
            required
            className="form-input"
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="phone">Teléfono</label>
          <input
            type="text"
            id="phone"
            // min={0}
            value={formData.phone}
            onChange={handleChangeTelContact}
            placeholder="Ingrese teléfono"
            required
            className="form-input"
          />
          {errors.phone && <p className="error">{errors.phone}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={formData.email}
            onChange={handleChangeEmail}
            placeholder="Ingrese email"
            required
            className="form-input"
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <button type="submit" className="submit-btn">
          Agregar Contacto
        </button>
      </div>
    </form>
  );
};
