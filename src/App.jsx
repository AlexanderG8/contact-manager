import './App.css'
import Header from './components/Header'
import ContactList from './components/ContactList'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <div>
        <Header />
        <main>
          <ContactList />
          <Footer />
        </main>
        
      </div>
    </>
  )
}

export default App
