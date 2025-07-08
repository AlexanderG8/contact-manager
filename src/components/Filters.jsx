export default function Filters({
  showOnlyFavorites,
  handleChangeFavorite,
  handleChangeAllFavorite,
  contacts,
  handlerClearContacts,
}) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#b7b1b0",
          borderRadius: "8px",
          margin: "1rem 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="checkbox"
            id="showOnlyFavorites"
            checked={showOnlyFavorites}
            onChange={handleChangeFavorite}
            style={{
              cursor: "pointer",
              width: "50px",
              height: "20px",
            }}
          />
          <label
            htmlFor="showOnlyFavorites"
            style={{
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            Show favorites
          </label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="checkbox"
            id="markAllFavorites"
            onChange={handleChangeAllFavorite}
            style={{
              cursor: "pointer",
              width: "18px",
              height: "18px",
            }}
          />
          <label
            htmlFor="markAllFavorites"
            style={{
              fontSize: "0.9rem",
              color: "#666",
            }}
          >
            Mark/Unmark favorites to all
          </label>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <input
            type="button"
            id="btnClearContact"
            onClick={handlerClearContacts}
            value={"Clear Contacts"}
            style={{
              cursor: "pointer",
              width: "100px",
              height: "18px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <label
            style={{
              fontSize: "0.9rem",
              color: "#666",
              fontWeight: "500",
            }}
          >
            {contacts.filter((contact) => contact.isFavorite).length} favorites
          </label>
        </div>
        <label
          style={{
            marginLeft: "auto",
            fontSize: "0.9rem",
            color: "#666",
            fontWeight: "500",
          }}
        >
          1 of {contacts.length} contacts
        </label>
      </div>
    </section>
  );
}
