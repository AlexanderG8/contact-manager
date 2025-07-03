import ContactCard from "./ContactCard"

const ContactList = ({contact, toggleFavorite}) => {
  return (
  <ContactCard contact={contact} toggleFavorite={toggleFavorite}/>
  );
};

export default ContactList;