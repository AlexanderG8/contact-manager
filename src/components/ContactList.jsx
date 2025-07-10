import ContactCard from "./ContactCard";

const ContactList = ({
  contactsToShow,
  toggleFavorite,
  handleSelectContact,
  handleNextContact,
  selectContact,
}) => {
  return (
    <section className="w-full">
      {contactsToShow.length === 0 ? (
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-8 text-center">
          <div className="text-slate-400 mb-3 text-5xl">📋</div>
          <h3 className="text-white text-lg font-medium mb-2">No contacts found</h3>
          <p className="text-slate-400 text-sm">Add a new contact or change your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {contactsToShow.map((contact) => (
            <div 
              key={contact.id} 
              onClick={() => handleSelectContact(contact)}
              className="cursor-pointer transition-transform hover:-translate-y-1"
            >
              <ContactCard
                contact={contact}
                toggleFavorite={toggleFavorite}
                handleNextContact={handleNextContact}
                selectContact={selectContact}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ContactList;
