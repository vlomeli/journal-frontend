import { useState, useEffect} from 'react';
import { removeJwt } from '../../ApiServices/JwtService';
import { useNavigate} from 'react-router-dom';

import { createEntry, deleteEntry, getUserEntries } from '../../ApiServices/JournalService';

import Navbar from '../../components/Navbar/Navbar';


import './HomePage.css';

const HomePage = () => {
    const [newTitleValue, setNewTitleValue] = useState('');
    const [newContentValue, setNewContentValue] = useState('');
    const [newMoodValue, setNewMoodValue] = useState('');
    
    const [ entries, setEntries ] = useState ([]);

// allows you to render entries when you open home page


    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            const fetchedEntries = await getUserEntries();
            console.log('entries, fetchedEntries', fetchedEntries);
            setEntries(fetchedEntries.entries);
        } catch (error) {
            console.log('Error fetching entries', error);
        }
    }

// allows to create a new entry
    const handleCreateEntry = async () => {
        console.log({
            newTitleValue,
            newContentValue,
            newMoodValue
        })
        await createEntry({
            newTitleValue,
            newContentValue,
            newMoodValue
        });
        // rerenders when submitted
        fetchEntries();
    }
    
    const handleDeleteEntry = async (entryId) => {
        await deleteEntry(entryId);

        fetchEntries();
    }

// takes you to login page when you click
    const navigate = useNavigate()

    const LogOut = () => {
        removeJwt();
        navigate('/')
    }

// logic to render entries
    const renderEntriesList = () => {
        console.log('entries', entries )
        
        // Check if entries is an array
        if(!Array.isArray(entries)) {
            console.log('Entries is not an array');
            return <p> No entries to display</p>;
        }  

       const entriesElements = entries.map((entry, index) => (
        <div key={`${index}${entry.EntryID}`}>
            <p>Date: {new Date(entry.DateCreated).toLocaleDateString(undefined, 
                { month: 'numeric', day: 'numeric', year: '2-digit' })} {' '}
                {new Date(entry.DateCreated).toLocaleTimeString([], 
                { hour: '2-digit', minute: '2-digit' })}</p>
            <p> Title: {entry.Title}</p>
            <p> Content: {entry.Content}</p>
            <p> Mood: {entry.Mood}</p>

            <button onClick={() => handleDeleteEntry(entry.EntryID)}> Delete </button>
        </div>
       ));
          
       return <div>{entriesElements}</div>
    }

// all that is rendered on the page
    return (
        <div className='home-page-container'>
        <div className='navbar-container'>
          <Navbar />
        </div>
    
        <div className="content-container">
          <div className='inputs-container'>
            <label htmlFor='new-entry-title-input'>Title:</label>
            <input onChange={(event) => setNewTitleValue(event.target.value)} id='new-entry-title-input' type='text' />
    
            <label htmlFor='new-entry-content-input'>Content:</label>
            <input onChange={(event) => setNewContentValue(event.target.value)} id='new-entry-content-input' type='text' />
    
            <label htmlFor='new-entry-mood-input'>Mood:</label>
            <input onChange={(event) => setNewMoodValue(event.target.value)} id='new-entry-mood-input' type='text' />
            
            <button onClick={handleCreateEntry} className='logout-button'> New Entry </button>
          </div>
    
          <div className='entries-container'>
            <h1> All ENTRIES</h1>
            {renderEntriesList()}
          </div>
        </div>
    
        <div className='logout-button-container'>
          <button className='logout-button' onClick={LogOut}>LOG OUT</button>
        </div>
      </div>
    );
}

export default HomePage;