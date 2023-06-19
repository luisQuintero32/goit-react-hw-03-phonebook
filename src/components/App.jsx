import React, { Component } from 'react';
import shortid from 'shortid';
import style from './App.module.css';

import Section from './Section/Section';
import ContactForm from './ContactForm/ContactForm';
import ContactList from './ContactList/ContacsList';
import Filter from './Filter/Filter';

const localStorageKey = "contacts";

class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const storedContacts = localStorage.getItem(localStorageKey);

    if (storedContacts) {
      const parsedContacts = JSON.parse(storedContacts);
      this.setState({ contacts: parsedContacts });
    }
  }

  addContact = ({ name, number }) => {
    const { contacts } = this.state;
    const newContact = {
      id: shortid.generate(),
      name,
      number,
    };
    const updatedContacts = [...contacts, newContact];

    this.setState({ contacts: updatedContacts }, () => {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedContacts));
    });

    
  };

  handleFilterChange = (event) => {
    this.setState({ filter: event.target.value });
  };

  getFilteredContacts = () => {
    const { contacts, filter } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  deleteContact = (id) => {
    const { contacts } = this.state;
    const updatedContacts = contacts.filter((contact) => contact.id !== id);

    // Actualizamos el estado de los contactos y guardamos los cambios en el local storage.
    this.setState({ contacts: updatedContacts }, () => {
      localStorage.setItem(localStorageKey, JSON.stringify(updatedContacts));
    });
  };


  render() {
    const { contacts, filter } = this.state;
    const filteredContacts = this.getFilteredContacts();

    return (
      <div className={style.container}>
        <Section title="Directorio telefónico">
          <ContactForm onSubmit={this.addContact} />
        </Section>

        <Section title="Contactos">
          <Filter value={filter} onChange={this.handleFilterChange} />
          <div className={style.allContacts}>Contactos: {contacts.length}</div>
          <ContactList
            contacts={filteredContacts}
            onDeleteContact={this.deleteContact}
          />
        </Section>
      </div>
    );
  }
}

export default App;
