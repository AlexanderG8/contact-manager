import ContactCard from "./ContactCard"

const ContactList = () => {
  return (
        <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem'
        }}>
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
            <ContactCard />
        </div>
  );
};

export default ContactList;