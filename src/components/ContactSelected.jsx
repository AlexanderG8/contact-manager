import ContactCard from "./ContactCard";

export default function ContactSelected({selectContact, toggleFavorite, handleNextContact}){
    return(
        <section
            style={{
              justifyItems: "center",
              alignItems: "center"
            }}
            >
            {selectContact ? <h3>Contacto Selecionado</h3> : null}
            {selectContact ? <ContactCard contact={selectContact} toggleFavorite={toggleFavorite} handleNextContact={handleNextContact} selectContact={selectContact}/> : <p>No hay un contacto seleccionado</p>}
          </section>
    )
}