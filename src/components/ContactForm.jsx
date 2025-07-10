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
    <form onSubmit={handleSubmit} className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-lg">
      <div className="space-y-4">
        <div className="form-group">
          <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Name</label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChangeContact}
              placeholder="Enter name"
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-slate-500 sm:text-sm"></span>
            </div>
          </div>
          {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="phone" className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
          <div className="relative">
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChangeTelContact}
              placeholder="Enter phone number"
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
          <div className="relative">
            <input
              type="text"
              id="email"
              value={formData.email}
              onChange={handleChangeEmail}
              placeholder="Enter email"
              required
              className="w-full bg-slate-900/50 text-white border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
          </div>
          {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
        </div>
        
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Save Contact
        </button>
      </div>
    </form>
  );
};
