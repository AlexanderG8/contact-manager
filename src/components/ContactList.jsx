import ContactCard from "./ContactCard";

const ContactList = ({
  contactsToShow,
  toggleFavorite,
  handleSelectContact,
  handleNextContact,
  selectContact,
}) => {
  return (
    // <ContactCard contact={contact} toggleFavorite={toggleFavorite}/>
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
      }}
    >
      {contactsToShow.map((contact) => (
        <div key={contact.id} onClick={() => handleSelectContact(contact)}>
          <ContactCard
            contact={contact}
            toggleFavorite={toggleFavorite}
            handleNextContact={handleNextContact}
            selectContact={selectContact}
          />
        </div>
      ))}
    </section>
  );
};

export default ContactList;
