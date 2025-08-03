import ContactCard from "./ContactCard";

export default function ContactSelected({selectContact, toggleFavorite, handleNextContact, searchTerm, onDeleteContact, onEditContact}){
    return(
        <section className="w-full">
            {selectContact ? (
                <ContactCard 
                    contact={selectContact} 
                    toggleFavorite={toggleFavorite} 
                    handleNextContact={handleNextContact} 
                    selectContact={selectContact}
                    searchTerm={searchTerm}
                    onDelete={onDeleteContact} // Pasamos la función para eliminar contactos
                    onEdit={onEditContact} // Pasamos la función para editar contactos
                />
            ) : (
                <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center">
                    <div className="text-slate-400 mb-3 text-5xl">👤</div>
                    <h3 className="text-white text-lg font-medium mb-2">No contact selected</h3>
                    <p className="text-slate-400 text-sm">Select a contact from the list</p>
                </div>
            )}
        </section>
    )
}